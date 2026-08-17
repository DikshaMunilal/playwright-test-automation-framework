export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.itemNamesLocator = page.getByTestId('inventory-item-name');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu'});
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async sortBy(option) {
    await this.sortSelect.selectOption(option); // e.g. 'lohi', 'za'
  }

  #itemByName(name) {
    return this.items.filter({ hasText: name });
  }

  async addItem(name) {
    await this.#itemByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItem(name) {
    await this.#itemByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async itemPrices() {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map(t => Number(t.replace('$', '')));
  }

  async itemNames() {
    return this.itemNamesLocator.allTextContents();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}