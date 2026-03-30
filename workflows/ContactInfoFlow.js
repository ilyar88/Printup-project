const ContactInfo = require('../pageObjects/ContactInfo');
const ClientInfo = require('../pageObjects/ClientInfo');
const { typeText, isChecked } = require('../fixtures/User interface');
const { readExcel } = require('../TDD/ExcelReader');

class ContactInfoFlow {
    static data = readExcel('ContactInfoFlow');

    static async contactInfoFlow(page, data) {
        const clientInfo = new ClientInfo(page);
        const contactInfo = new ContactInfo(page);
        const checkboxes = clientInfo.checkboxes();
        await typeText(contactInfo.fullName(), data.fullName);
        await isChecked(checkboxes.nth(2), data.Main_phone_number);
        await typeText(contactInfo.phoneNumber(), data.Main_phone_number.split('-')[0].trim());
        await isChecked(checkboxes.nth(3), data.Email);
        await typeText(contactInfo.email(), data.Email.split('-')[0].trim());
        await typeText(contactInfo.role(), data.Role);
        await typeText(contactInfo.notes(), data.Notes);
    }
}

module.exports = ContactInfoFlow;
