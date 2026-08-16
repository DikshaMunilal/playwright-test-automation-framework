import { test, expect } from '../../src/fixtures/ui.fixtures.js';
import { users, PASSWORD } from '../../src/data/users.js';
import { makeCustomer } from '../../src/data/customer.factory.js';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, PASSWORD);
});

test.describe('checkout', () => {
  test('completes an order end to end', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await test.step('add item and open cart', async () => {
      await inventoryPage.addItem('Sauce Labs Backpack');
      await inventoryPage.openCart();
    });

    await test.step('checkout with generated customer details', async () => {
      await cartPage.checkout();
      await checkoutPage.fillInfo(makeCustomer());
    });

    await test.step('overview shows the item and a total', async () => {
      expect(await cartPage.itemNames()).toEqual(['Sauce Labs Backpack']);
      await expect(checkoutPage.summaryTotal).toContainText('$');
    });

    await test.step('finish shows order confirmation', async () => {
      await checkoutPage.finishButton.click();
      await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');
    });
  });

  test('missing first name blocks checkout', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addItem('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.continueButton.click(); // submit empty form
    await expect(checkoutPage.errorMessage).toContainText(/First Name is required/i);
  });

  test('cancel from overview returns to inventory', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addItem('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(makeCustomer());
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});