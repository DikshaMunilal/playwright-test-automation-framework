import { test, expect } from '../../src/fixtures/ui.fixtures.js';
import { users, PASSWORD } from '../../src/data/users.js';

test.describe('authentication', () => {
  for (const [type, user] of Object.entries(users)) {
    test(`${type} user login`, async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(user.username, PASSWORD);

      if (user.valid) {
        await expect(page).toHaveURL(/inventory\.html/);
      } else {
        await expect(loginPage.errorMessage).toContainText(user.error);
      }
    });
  }

  test('wrong password shows an error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});