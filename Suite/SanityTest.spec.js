const { test } = require('@playwright/test'), { allure } = require('allure-playwright');
const BasePage = require('../base/BasePage');
const { LoginFlow,
        ClientInfoFlow,
        ContactInfoFlow,
        ProjectInfoFlow,
        MaterialsInfoFlow } = require('../workflows');
const { setup, teardown } = require('../fixtures/Hooks');
const { iteration } = require('../fixtures/User interface');

class SanityPage extends BasePage {

    runTests() {
        setup(this);
        teardown(this);

        test.describe.configure({ mode: 'serial' });
        test.describe('Sanity test', () => {

            test('#1 Login to the website', async () => {
                await allure.feature('Login');
                await LoginFlow.login(this.page);
            });

            for (let i = 0; i < 1; i++) {
                test(`#2 Add client - iteration ${i + 1}`, async () => {
                    await allure.feature('Client info');
                    await iteration(ClientInfoFlow, this.page, i);
                });
                test(`#3 Add contact - iteration ${i + 1}`, async () => {
                    await allure.feature('Contact info');
                    await iteration(ContactInfoFlow, this.page, i);
                });
                test(`#4 Add project - iteration ${i + 1}`, async () => {
                    await allure.feature('Project info');
                    await iteration(ProjectInfoFlow, this.page, i);
                });

                 test(`#5 Add material - iteration ${i + 1}`, async () => {
                    await allure.feature('Material info');
                    await iteration(MaterialsInfoFlow, this.page, i);
                });
            }
        });
    }
}

module.exports = SanityPage;

const sanity = new SanityPage(null);
sanity.runTests();
