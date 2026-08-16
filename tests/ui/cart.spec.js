import { test, expect } from '../../src/fixtures/ui.fixtures.js';
import { users, PASSWORD } from '../../src/data/users.js';

const ITEMS = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

test.beforeEach(async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, PASSWORD);
  for (const item of ITEMS) await inventoryPage.addItem(item);
});

test.describe('shopping cart', () => {
  test('shows added items with correct badge count', async ({ inventoryPage, cartPage }) => {
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.openCart();
    expect(await cartPage.itemNames()).toEqual(ITEMS);
  });

  test('removing an item updates cart and badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.openCart();
    await cartPage.removeItem(ITEMS[0]);
    expect(await cartPage.itemNames()).toEqual([ITEMS[1]]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('cart persists across navigation', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.openCart();
    await cartPage.continueShopping.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await inventoryPage.openCart();
    expect(await cartPage.itemNames()).toEqual(ITEMS);
  });
});