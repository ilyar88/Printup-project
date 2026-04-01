const Login = require('../pageObjects/Login');
const { typeText, click } = require('../fixtures/User interface');
const { verifyEquals } = require('../fixtures/Assert');

// Automates the login page using credentials from environment variables.
class LoginFlow {
    // Enters email and password, clicks login, and verifies the page title is 'Client'.
    static async login(page) {
        const loginPage = new Login(page);
        await typeText(loginPage.email(), process.env.EMAIL);
        await typeText(loginPage.password(), process.env.PASSWORD);
        await click(loginPage.login());
        const title = await page.title();
        verifyEquals(title, 'Client');
    }
}

module.exports = LoginFlow;
