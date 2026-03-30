const base = require('@playwright/test');
const { allure } = require('allure-playwright');

const envValues = Object.values(process.env).filter(v => v && v.length > 0);

function isSensitive(text) {
    return envValues.includes(text);
}

function mask(text) {
    return text[0] + '*'.repeat(text.length - 1);
}

async function typeText(locator, text) {
    if (!text) return;
    const display = isSensitive(text) ? mask(text) : text;
    await allure.step(`Fill: ${display}`, async () => {
        await locator.fill('');
        await locator.fill(String(text));
    });
}

async function click(locator) {
    await allure.step('Click element', async () => {
        await locator.click();
    });
}

async function isChecked(locator, text) {
    await allure.step(text.includes('yes') ? 'Checkbox enabled' : 'Checkbox disabled', async () => {
        text.includes('yes') ? await locator.check() : await locator.uncheck();
    });
}

async function selectOption(locator, option, value) {
    switch (option) {
        case 'value':
            const options = await locator.locator('option').allTextContents();
            if (options.some(o => o.includes(value)))
                await locator.selectOption({ label: options.find(o => o.includes(value)) });
            break;
        case 'index':
            await locator.selectOption({ index: parseInt(value) });
            break;
        default:
            throw new Error(`Invalid select type: ${option}`);
    }
    const checked = locator.locator('option:checked');
    if (await checked.count() > 0) {
        const selectedText = await checked.textContent();
        await allure.step(`Select option: ${selectedText}`, async () => {});
    }
}

async function selectDate(locator, date) {
    await allure.step(`Select date: ${date}`, async () => {
        const [d, m, y] = date.split('.');
        const formatted = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        await locator.fill(formatted);
    });
}

async function uploadFile(locator, filePath) {
    if (!filePath) return;
    await allure.step(`Upload file: ${filePath}`, async () => {
        await locator.setInputFiles(filePath);
    });
}

async function iteration(T, page, i) {
    const method = T.name[0].toLowerCase() + T.name.slice(1);
    T.data[i] && await T[method](page, T.data[i]);
}

module.exports = { typeText, click, selectOption, selectDate, iteration, isChecked, uploadFile };
