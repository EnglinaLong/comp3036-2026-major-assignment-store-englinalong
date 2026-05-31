import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import {
  featuredProductCard,
  featuredProductsSection,
  resetStorefrontState,
} from "./helpers";

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
      const categorySummary = featuredProducts
        .locator("p.text-sm.font-medium:visible")
        .filter({ hasText: /^Showing / });
      const backendToolkitCard = featuredProductCard(
        page,
        "Backend Starter Toolkit",
      );
      const reactStorefrontCard = featuredProductCard(
        page,
        "React Storefront UI Kit",
      );
      const dockerToolkitCard = featuredProductCard(
        page,
        "Docker Deployment Toolkit",
      );
      const mobileResponsiveCard = featuredProductCard(
        page,
        "Mobile Responsive Design Pack",
      );
      await expect(
        backendToolkitCard.locator("a").filter({
          hasText: "Backend Starter Toolkit",
        }),
      ).toBeVisible();

      await page
        .locator("#shop-by-category")
        .getByRole("button", { name: /React/ })
        .click();
      await expect(page).toHaveURL(/\/\?category=react#featured-products$/);
      await expect(categorySummary).toHaveText("Showing React products");
      await expect(reactStorefrontCard).toBeVisible();
      await expect(dockerToolkitCard).not.toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(/\/\?category=react#featured-products$/);
      await expect(categorySummary).toHaveText("Showing React products");

      await page.getByRole("button", { name: "Clear filters" }).click();
      await expect(page).toHaveURL("http://localhost:3001/");
      await expect(categorySummary).toHaveText("Showing all products");

      await page
        .locator("#shop-by-category")
        .getByRole("button", { name: /DevOps/ })
        .click();
      await expect(page).toHaveURL(/\/\?category=devops#featured-products$/);
      await expect(categorySummary).toHaveText("Showing DevOps products");
      await expect(dockerToolkitCard).toBeVisible();
      await expect(reactStorefrontCard).not.toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await expect(categorySummary).toHaveText("Showing all products");

      await page
        .locator("#shop-by-category")
        .getByRole("button", { name: /Responsive Design/ })
        .click();
      await expect(categorySummary).toHaveText(
        "Showing Responsive Design products",
      );
      await expect(mobileResponsiveCard).toBeVisible();
    },
  );
});
