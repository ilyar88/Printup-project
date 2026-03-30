const Login = require('../pageObjects/Login');
const { typeText, click } = require('../fixtures/User interface');
const { verifyEquals } = require('../fixtures/Assert');

class LoginFlow {
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
