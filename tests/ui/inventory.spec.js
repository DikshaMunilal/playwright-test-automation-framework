import { test, expect } from '../../src/fixtures/ui.fixtures.js';
import { users, PASSWORD } from '../../src/data/users.js';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, PASSWORD);
});

test.describe('inventory', () => {
  test('lists all six products', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sorts by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.itemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.itemNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('add and remove toggles the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItem('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeItem('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});