const { expect } = require('@playwright/test');
const { allure } = require('allure-playwright');

function verifyEquals(actual, expected) {
    allure.step(`Verify text: ${actual} is equal to ${expected}`, () => {
        expect(actual, `Verify equals failed: ${actual} is not equal to: ${expected}`).toBe(expected);
    });
}

function verifyText(actual, expected) {
    allure.step(`Verify text: ${actual} is in ${expected}`, () => {
        expect(actual, `Verify text failed: '${actual}', does not contain: '${expected}'`).toContain(expected);
    });
}

function assertFailed(message) {
    allure.step('Assert failed', () => {
        expect(false, message).toBeTruthy();
    });
}

async function isDisplayed(locator, expected) {
    await allure.step(`Verify element display: ${expected}`, async () => {
        if (expected) {
            await expect(locator).toBeVisible();
        } else {
            await expect(locator).not.toBeVisible();
        }
    });
}

function verifyTextSoft(actual, expected) {
    allure.step(`Verify soft assert text: ${actual} is in ${expected}`, () => {
        expect.soft(actual, `Verify text failed: '${actual}', does not contain: '${expected}'`).toContain(expected);
    });
}

module.exports = { verifyEquals, verifyText, assertFailed, isDisplayed, verifyTextSoft };
