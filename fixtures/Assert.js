const { expect } = require('@playwright/test');
const { allure } = require('allure-playwright');

// Each function wraps an assertion inside an Allure step for reporting

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

// Forces the test to fail with a custom message
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

// Soft assert — check if the actual text contains in the expected text, it doesn't fail the test immediately.
function verifyTextSoft(actual, expected) {
    allure.step(`Verify soft assert text: ${actual} is in ${expected}`, () => {
        expect.soft(actual, `Verify text failed: '${actual}', does not contain: '${expected}'`).toContain(expected);
    });
}

module.exports = { verifyEquals, verifyText, assertFailed, isDisplayed, verifyTextSoft };
