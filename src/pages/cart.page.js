export class CartPage {
  constructor(page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.itemNamesLocator = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShopping = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async itemNames() {
    return this.itemNamesLocator.allTextContents();
  }

  async removeItem(name) {
    await this.items.filter({ hasText: name })
      .getByRole('button', { name: 'Remove' }).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}