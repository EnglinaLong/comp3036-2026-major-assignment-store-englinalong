import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";
import { featuredProductsSection } from "./helpers";

test.describe("FULL STACK STORE LATEST ARRIVALS", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Storefront latest arrivals filter shows matching month products and resets",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");
      const featuredProducts = featuredProductsSection(page);

      await expect(page.getByRole("heading", { name: "New in Store" })).toBeVisible();
      await page
        .locator("#collections")
        .getByRole("button", { name: /May, 2026/ })
        .first()
        .click();
      await expect(
        page.getByText("Showing products from May 2026"),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-15")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-2"),
      ).not.toBeVisible();

      await page.getByRole("button", { name: "Clear filters" }).click();
      await expect(page.getByText("Showing all products")).toBeVisible();
    },
  );
});
