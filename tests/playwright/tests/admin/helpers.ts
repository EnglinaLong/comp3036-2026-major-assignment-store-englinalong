import { expect, type Locator, type Page } from "@playwright/test";

export function productCard(page: Page, title: string): Locator {
  return page.locator("article").filter({
    has: page.getByRole("link", {
      name: title,
      exact: true,
    }),
  });
}

export async function waitForAdminProductList(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Admin of Full Stack Store" }),
  ).toBeVisible();
  await expect(page.locator("article").first()).toBeVisible();
}
