import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { featuredProductsSection, resetStorefrontState } from "./helpers";

test.describe("FULL STACK STORE COLLECTIONS", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Storefront collection filter shows matching tagged products and resets",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");
      const featuredProducts = featuredProductsSection(page);

      await page
        .locator("#collections")
        .getByRole("button", { name: /Front-End/ })
        .click();
      await expect(page).toHaveURL(/\/\?collection=front-end#featured-products$/);
      await expect(
        page.getByText("Showing products tagged: Front-End"),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-2")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-4"),
      ).not.toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(/\/\?collection=front-end#featured-products$/);
      await expect(
        page.getByText("Showing products tagged: Front-End"),
      ).toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await page
        .locator("#collections")
        .getByRole("button", { name: /Docker/ })
        .click();
      await expect(page).toHaveURL(/\/\?collection=docker#featured-products$/);
      await expect(
        page.getByText("Showing products tagged: Docker"),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-2"),
      ).not.toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await expect(page).toHaveURL("http://localhost:3001/");
      await expect(page.getByText("Showing all products")).toBeVisible();

      await page
        .locator("#collections")
        .getByRole("button", { name: /Mobile/ })
        .click();
      await expect(page).toHaveURL(/\/\?collection=mobile#featured-products$/);
      await expect(
        page.getByText("Showing products tagged: Mobile"),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-15")).toBeVisible();
    },
  );
});
