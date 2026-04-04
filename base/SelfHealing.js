'use strict';

const fs   = require('fs');
const path = require('path');
const OpenAI = require('openai');

const PAGE_OBJECTS_DIR = path.join(__dirname, '../pageObjects');

// Playwright locator methods that trigger an actual interaction with the DOM
const ACTION_METHODS = new Set([
    'click', 'dblclick', 'fill', 'type', 'press', 'check', 'uncheck',
    'selectOption', 'waitFor', 'getAttribute', 'textContent', 'inputValue',
    'innerText', 'innerHTML', 'setInputFiles', 'tap', 'focus', 'blur',
    'hover', 'dispatchEvent', 'evaluate', 'scrollIntoViewIfNeeded',
    'isVisible', 'isEnabled', 'isChecked', 'isEditable', 'isHidden',
    'isDisabled', 'count', 'boundingBox',
]);

class SelfHealing {
    constructor() {
        this._cache = new Map(); // Avoids asking the AI twice for the same broken selector
        this._ai = null;
    }

    _getAI() {
        return this._ai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    // Wraps the Playwright page so every page.locator() call goes through self-healing
    wrapPage(rawPage) {
        if (!rawPage) return rawPage;
        return new Proxy(rawPage, {
            get: (target, prop) => prop === 'locator'
                ? (selector, options) => this._selfHealingLocator(target, selector, options)
                : typeof target[prop] === 'function' ? target[prop].bind(target) : target[prop],
        });
    }

    // Returns a Proxy around a locator that intercepts action calls.
    // If the element is not found, it asks the AI for a replacement selector.
    _selfHealingLocator(page, selector, options) {
        return new Proxy(page.locator(selector, options), {
            get: (target, prop) => {
                const value = Reflect.get(target, prop);
                // Pass through non-action properties unchanged
                if (typeof value !== 'function' || !ACTION_METHODS.has(prop))
                    return typeof value === 'function' ? value.bind(target) : value;

                return async (...args) => {
                    // Quick 5 s check — if the element exists, run normally without AI
                    const found = await target.waitFor({ state: 'attached', timeout: 5000 })
                        .then(() => true, () => false);

                    if (!found) {
                        console.warn(`[SelfHealing] "${selector}" not found — asking AI...`);
                        const healed = await this._heal(page, selector).catch(e => {
                            console.error(`[SelfHealing] AI error: ${e.message}`);
                            return null;
                        });
                        if (healed) {
                            let result, succeeded = false;
                            try {
                                result = await page.locator(healed)[prop](...args);
                                succeeded = true;
                            } catch (e) {
                                console.error(`[SelfHealing] Healed selector "${healed}" failed: ${e.message}`);
                            }
                            // Only persist the new selector when the action actually succeeded
                            if (succeeded) {
                                this._updateFile(selector, healed);
                                return result;
                            }
                        }
                        throw new Error(`[SelfHealing] Could not heal "${selector}"`);
                    }

                    return await value.call(target, ...args);
                };
            },
        });
    }

    // Sends the broken selector + page HTML to the AI and returns a replacement CSS selector
    async _heal(page, selector) {
        if (this._cache.has(selector)) {
            console.warn(`[SelfHealing] Using cached: "${this._cache.get(selector)}"`);
            return this._cache.get(selector);
        }
        const html = (await page.evaluate(() => document.body.innerHTML)).substring(0, 15000);
        const res = await this._getAI().chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 150,
            messages: [{ role: 'user', content:
                `Playwright selector broke after a UI change.\nFailed: ${selector}\n` +
                `Return ONLY a valid CSS selector for the same element. No explanation.\n\nHTML:\n${html}` }],
        });
        const raw = res.choices[0]?.message?.content?.trim() ?? null;
        // Strip any markdown code fences the AI may have wrapped around the selector
        const healed = raw ? raw.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim().replace(/"/g, "'") : null;
        if (healed) this._cache.set(selector, healed);
        return healed;
    }

    // Replaces the old selector with the healed one directly in the page object file
    _updateFile(oldSelector, newSelector) {
        for (const file of fs.readdirSync(PAGE_OBJECTS_DIR).filter(f => f.endsWith('.js'))) {
            const filePath = path.join(PAGE_OBJECTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(oldSelector)) {
                fs.writeFileSync(filePath, content.replace(oldSelector, newSelector), 'utf8');
                console.warn(`[SelfHealing] ✓ "${oldSelector}" → "${newSelector}" saved in ${file}`);
                return;
            }
        }
    }
}

const selfHealing = new SelfHealing();
module.exports = { wrapPage: selfHealing.wrapPage.bind(selfHealing) };
