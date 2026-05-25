import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { featuredProductsSection, resetStorefrontState } from "./helpers";

test.describe("FULL STACK STORE CATEGORIES", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Storefront category filter shows matching category products and resets",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");
      const featuredProducts = featuredProductsSection(page);
      await expect(
        featuredProducts.getByText("Backend Starter Toolkit"),
      ).toBeVisible();

      await page
        .locator("#shop-by-category")
        .getByRole("button", { name: /React/ })
        .click();
      await expect(page).toHaveURL(/\/\?category=react#featured-products$/);
      await expect(page.getByText("Showing React products")).toBeVisible();
      await expect(
        featuredProducts.getByText("React Storefront UI Kit"),
      ).toBeVisible();
      await expect(
        featuredProducts.getByText("Docker Deployment Toolkit"),
      ).not.toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(/\/\?category=react#featured-products$/);
      await expect(page.getByText("Showing React products")).toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await expect(page).toHaveURL("http://localhost:3001/");
      await expect(page.getByText("Showing all products")).toBeVisible();

      await page
        .locator("#shop-by-category")
        .getByRole("button", { name: /DevOps/ })
        .click();
      await expect(page).toHaveURL(/\/\?category=devops#featured-products$/);
      await expect(page.getByText("Showing DevOps products")).toBeVisible();
      await expect(
        featuredProducts.getByText("Docker Deployment Toolkit"),
      ).toBeVisible();
      await expect(
        featuredProducts.getByText("React Storefront UI Kit"),
      ).not.toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await expect(page.getByText("Showing all products")).toBeVisible();

      await page
        .locator("#shop-by-category")
        .getByRole("button", { name: /Responsive Design/ })
        .click();
      await expect(
        page.getByText("Showing Responsive Design products"),
      ).toBeVisible();
      await expect(
        featuredProducts.getByText("Mobile Responsive Design Pack"),
      ).toBeVisible();
    },
  );
});
