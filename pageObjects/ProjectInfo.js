class ProjectInfo {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    projectEstablish() {
        return this.page.locator("button.rounded-none").nth(0);
    }

    customerName() {
        return this.page.locator("select.appearance-none.cursor-pointer");
    }

    projectName() {
        return this.page.locator("input[name='name']");
    }

    subtitle() {
        return this.page.locator("input[name='subtitle']");
    }

    date() {
        return this.page.locator("input[name='endDate']");
    }

    approved() {
        return this.page.locator("input[type='checkbox']");
    }

    urgency() {
        return this.page.locator("div:nth-child(3) > select");
    }

    time() {
        return this.page.locator("input[type='time']");
    }

    status() {
        return this.page.locator("div.flex.items-center.justify-end > select");
    }

    folderPath() {
        return this.page.locator("input[name='folderPath']");
    }

    notes() {
        return this.page.locator("textarea[name='workNotes']");
    }
    /***
    * עבר לגרפיקה - Moved to graphics
    * בתהליך יצור - In the production process
    * באריזה - In the package
    ***/
    async selects() {
        return await this.page.locator("div.grid-cols-3 select").all();
    }
}

module.exports = ProjectInfo;