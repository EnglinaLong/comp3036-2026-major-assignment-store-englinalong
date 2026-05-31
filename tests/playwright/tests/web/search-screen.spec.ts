import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import {
  featuredProductCard,
  featuredProductsSection,
  resetStorefrontState,
} from "./helpers";

test.describe("FULL STACK STORE SEARCH", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Storefront search filter matches title, description, category, tags, and clears cleanly",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      const searchInput = page.locator(
        'input[placeholder="Search products"]:visible',
      );
      const featuredProducts = featuredProductsSection(page);
      const searchResultsSection = page
        .locator("section")
        .filter({
          has: page.getByRole("heading", { name: "Search Results" }),
        })
        .first();
      const searchSummary = searchResultsSection
        .locator("p.text-sm.font-medium:visible")
        .filter({ hasText: /^Showing results for:/ });
      const emptySearchState = searchResultsSection
        .locator("p.text-lg.font-semibold:visible")
        .filter({ hasText: "No products found" });
      const backendToolkitCard = featuredProductCard(
        page,
        "Backend Starter Toolkit",
      );
      const dockerToolkitCard = featuredProductCard(
        page,
        "Docker Deployment Toolkit",
      );
      const reactStorefrontCard = featuredProductCard(
        page,
        "React Storefront UI Kit",
      );
      const frontendPerformanceCard = featuredProductCard(
        page,
        "Frontend Performance Toolkit",
      );
      const reactEcommerceCard = featuredProductCard(
        page,
        "React Ecommerce Components",
      );
      const nextEcommerceCard = featuredProductCard(
        page,
        "Next.js Ecommerce Starter",
      );
      const ecommerceAnalyticsCard = featuredProductCard(
        page,
        "Ecommerce Analytics Dashboard",
      );
      const nodeApiBuilderCard = featuredProductCard(
        page,
        "Node API Builder Pack",
      );
      const mobileResponsiveCard = featuredProductCard(
        page,
        "Mobile Responsive Design Pack",
      );
      const storeHighlights = page
        .locator("section")
        .filter({ has: page.getByText("Store highlights") });

      await searchInput.click();
      await expect(searchInput).toBeFocused();
      await searchInput.pressSequentially("docker");
      await expect(searchInput).toHaveValue("docker");
      await expect(searchInput).toBeFocused();
      await expect(searchSummary).toHaveText("Showing results for: docker");
      await expect(dockerToolkitCard).toBeVisible();
      await expect(backendToolkitCard).not.toBeVisible();

      await searchInput.fill("react");
      await expect(
        page.getByRole("heading", { name: "Search Results" }),
      ).toBeVisible();
      await expect(page).toHaveURL(/\/\?q=react#featured-products$/);
      await expect(searchSummary).toHaveText("Showing results for: react");
      await expect(
        page.getByText('Showing', { exact: false }).filter({
          hasText: 'for "react"',
        }),
      ).toBeVisible();
      await expect(reactStorefrontCard).toBeVisible();
      await expect(frontendPerformanceCard).toBeVisible();
      await expect(reactEcommerceCard).toBeVisible();
      await expect(backendToolkitCard).not.toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await searchInput.fill("toolkit");
      await expect(page).toHaveURL(/\/\?q=toolkit#featured-products$/);
      await expect(searchSummary).toHaveText("Showing results for: toolkit");
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();

      await searchInput.fill("docker");
      await expect(searchSummary).toHaveText("Showing results for: docker");
      await expect(dockerToolkitCard).toBeVisible();
      await expect(reactStorefrontCard).not.toBeVisible();

      await searchInput.fill("ecommerce");
      await expect(searchSummary).toHaveText("Showing results for: ecommerce");
      await expect(nextEcommerceCard).toBeVisible();
      await expect(ecommerceAnalyticsCard).toBeVisible();
      await expect(reactEcommerceCard).toBeVisible();

      await searchInput.fill("backend");
      await expect(searchSummary).toHaveText("Showing results for: backend");
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();

      await searchInput.fill("containerised");
      await expect(searchSummary).toHaveText("Showing results for: containerised");
      await expect(dockerToolkitCard).toBeVisible();
      await expect(backendToolkitCard).not.toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await searchInput.fill("Back-End");
      await expect(searchSummary).toHaveText("Showing results for: Back-End");
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();

      await searchInput.fill("Node");
      await expect(searchSummary).toHaveText("Showing results for: Node");
      await expect(backendToolkitCard).toBeVisible();
      await expect(nodeApiBuilderCard).toBeVisible();

      await searchInput.fill("Mobile Responsive");
      await expect(searchSummary).toHaveText("Showing results for: Mobile Responsive");
      await expect(mobileResponsiveCard).toBeVisible();

      await searchInput.fill("zzzz-store-search");
      await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
      await expect(page).toHaveURL(/\/\?q=zzzz-store-search#featured-products$/);
      await expect(searchSummary).toHaveText(
        "Showing results for: zzzz-store-search",
      );
      await expect(emptySearchState).toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await page.reload();
      await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
      await expect(searchSummary).toHaveText(
        "Showing results for: zzzz-store-search",
      );
      await expect(emptySearchState).toBeVisible();

      await searchInput.fill("");
      await expect(page).toHaveURL("http://localhost:3001/");
      await expect(
        page.getByRole("heading", { name: "Featured Products" }),
      ).toBeVisible();
      await expect(page.getByText("Showing all products")).toBeVisible();
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();
      await expect(storeHighlights).toBeVisible();
    },
  );
});
