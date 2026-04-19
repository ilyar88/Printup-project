class Login {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    email() {
        return this.page.locator("input[type='email']");
    }

    password() {
        return this.page.locator("input[type='password']");
    }

    forgotPassword() {
        return this.page.locator("button[type='button']").nth(0);
    }

    login() {
        return this.page.locator("button[type='submit']");
    }

    signup() {
        return this.page.locator("button[type='button']").nth(1);
    }
}

module.exports = Login;