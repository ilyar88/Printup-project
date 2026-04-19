class UploadFiles {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    uploadFile() {
        return this.page.locator("div.overflow-auto > div > div > button");
    }

    designFiles() {
        return this.page.locator("button.border-\\[\\#5a8aa8\\].bg-white");
    }

    projectFiles() {
        return this.page.locator("button[type='button']").nth(0);
    }

    workOrder() {
        return this.page.locator("button[type='submit']");
    }

    projectArchive() {
        return this.page.locator("button[type='button']").nth(1);
    }

    addProject() {
        return this.page.locator("button.text-primary.font-light");
    }
}

module.exports = UploadFiles;