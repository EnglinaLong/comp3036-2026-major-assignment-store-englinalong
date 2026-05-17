import type { Page } from "@playwright/test";

export function featuredProductsSection(page: Page) {
  return page.locator("#featured-products");
}

export function productCard(page: Page, id: number) {
  return page.getByTestId(`product-card-${id}`);
}

export function productDetail(page: Page, id: number) {
  return page.getByTestId(`product-detail-${id}`);
}
