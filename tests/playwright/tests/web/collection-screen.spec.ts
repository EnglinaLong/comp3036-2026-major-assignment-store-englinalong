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
      const collectionSummary = featuredProducts
        .locator("p:visible")
        .filter({ hasText: "Showing products tagged:" });

      await page
        .locator("#collections")
        .getByRole("button", { name: /Front-End/ })
        .click();
      await expect(page).toHaveURL(/\/\?collection=front-end#featured-products$/);
      await expect(collectionSummary).toHaveText(
        "Showing products tagged: Front-End",
      );
      await expect(featuredProducts.getByTestId("product-card-2")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-4"),
      ).not.toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(/\/\?collection=front-end#featured-products$/);
      await expect(collectionSummary).toHaveText(
        "Showing products tagged: Front-End",
      );

      await page.getByRole("button", { name: "Clear filters" }).click();
      await page
        .locator("#collections")
        .getByRole("button", { name: /Docker/ })
        .click();
      await expect(page).toHaveURL(/\/\?collection=docker#featured-products$/);
      await expect(collectionSummary).toHaveText(
        "Showing products tagged: Docker",
      );
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-2"),
      ).not.toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await expect(page).toHaveURL("http://localhost:3001/");
      await expect(page.getByText("Showing all products")).toBeVisible();

      const backEndButton = page
        .locator("#collections")
        .getByRole("button", { name: /Back-End/ });
      await backEndButton.click();
      await expect(page).toHaveURL(/\/\?collection=back-end#featured-products$/);
      await expect(collectionSummary).toHaveText(
        "Showing products tagged: Back-End",
      );
      await expect(backEndButton).toHaveClass(
        /bg-\[color:var\(--color-wsu\)\]\/10/,
      );
      await expect(featuredProducts.getByTestId("product-card-1")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-2")).not.toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await page
        .locator("#collections")
        .getByRole("button", { name: /Mobile/ })
        .click();
      await expect(page).toHaveURL(/\/\?collection=mobile#featured-products$/);
      await expect(collectionSummary).toHaveText(
        "Showing products tagged: Mobile",
      );
      await expect(featuredProducts.getByTestId("product-card-15")).toBeVisible();
    },
  );
});
