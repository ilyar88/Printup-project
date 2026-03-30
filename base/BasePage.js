const { chromium } = require('@playwright/test');
const { config } = require('../configuration/playwright.config');

class BasePage {

    constructor(page) {
        this.page = page;
        this.baseUrl = config.baseUrl;
    }

    static async openBrowser() {
        const browser = await chromium.launch({
            headless: config.browser.headless,
            slowMo: config.browser.slowMo,
            args: ['--start-maximized'],
        });
        const context = await browser.newContext({
            viewport: null,
        });
        const page = await context.newPage();
        const instance = new this(page);
        instance.browser = browser;
        instance.context = context;
        await instance.navigate();
        return instance;
    }

    async closeBrowser() {
        await this.context.close();
        await this.browser.close();
    }

    async navigate(path = '') {
        await this.page.goto(`${this.baseUrl}${path}`);
    }
}

module.exports = BasePage;
