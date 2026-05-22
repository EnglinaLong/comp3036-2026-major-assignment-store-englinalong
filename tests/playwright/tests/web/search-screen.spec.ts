import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { featuredProductsSection } from "./helpers";

test.describe("FULL STACK STORE SEARCH", () => {
  test.beforeEach(async () => {
    await seedTestData();
  });

  test(
    "Storefront search filter matches title, description, category, tags, and clears cleanly",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      const searchInput = page.getByPlaceholder("Search products");
      const featuredProducts = featuredProductsSection(page);
      const storeHighlights = page
        .locator("section")
        .filter({ has: page.getByText("Store highlights") });

      await searchInput.click();
      await expect(searchInput).toBeFocused();
      await searchInput.pressSequentially("docker");
      await expect(searchInput).toHaveValue("docker");
      await expect(searchInput).toBeFocused();
      await expect(page.getByText("Showing results for: docker")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();

      await searchInput.fill("react");
      await expect(
        page.getByRole("heading", { name: "Search Results" }),
      ).toBeVisible();
      await expect(page).toHaveURL(/\/\?q=react#featured-products$/);
      await expect(page.getByText("Showing results for: react")).toBeVisible();
      await expect(
        page.getByText('Showing', { exact: false }).filter({
          hasText: 'for "react"',
        }),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-2")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-3")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-12")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-1"),
      ).not.toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await searchInput.fill("toolkit");
      await expect(page).toHaveURL(/\/\?q=toolkit#featured-products$/);
      await expect(page.getByText("Showing results for: toolkit")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-1")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();

      await searchInput.fill("docker");
      await expect(page.getByText("Showing results for: docker")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-2"),
      ).not.toBeVisible();

      await searchInput.fill("ecommerce");
      await expect(page.getByText("Showing results for: ecommerce")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-5")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-10")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-12")).toBeVisible();

      await searchInput.fill("backend");
      await expect(page.getByText("Showing results for: backend")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-1")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();

      await searchInput.fill("containerised");
      await expect(
        page.getByText("Showing results for: containerised"),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();
      await expect(
        featuredProducts.getByTestId("product-card-1"),
      ).not.toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await searchInput.fill("Back-End");
      await expect(
        page.getByText("Showing results for: Back-End"),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-1")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();

      await searchInput.fill("Node");
      await expect(page.getByText("Showing results for: Node")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-1")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-14")).toBeVisible();

      await searchInput.fill("Mobile Responsive");
      await expect(
        page.getByText("Showing results for: Mobile Responsive"),
      ).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-15")).toBeVisible();

      await searchInput.fill("zzzz-store-search");
      await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
      await expect(page).toHaveURL(/\/\?q=zzzz-store-search#featured-products$/);
      await expect(page.getByText("Showing results for: zzzz-store-search")).toBeVisible();
      await expect(page.getByText("No products found")).toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await page.reload();
      await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
      await expect(page.getByText("Showing results for: zzzz-store-search")).toBeVisible();
      await expect(page.getByText("No products found")).toBeVisible();

      await searchInput.fill("");
      await expect(page).toHaveURL("http://localhost:3001/");
      await expect(
        page.getByRole("heading", { name: "Featured Products" }),
      ).toBeVisible();
      await expect(page.getByText("Showing all products")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-1")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-4")).toBeVisible();
      await expect(storeHighlights).toBeVisible();
    },
  );
});
