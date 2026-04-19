class LayersInfo {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    upload() {
        return this.page.locator("div.p-4.shrink-0 > div > div.flex.items-center > button");
    }

    name() {
        return this.page.locator("input[placeholder='שם מותאם']");
    }

    description(name) {
        return this.page.locator("span.truncate.min-w-0", { hasText: name });
    }

    async iconDropDown() {
        return this.page.locator("svg.transition-transform[fill='currentColor']").all();
    }
}

module.exports = LayersInfo;