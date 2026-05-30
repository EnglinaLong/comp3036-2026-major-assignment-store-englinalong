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

      const searchInput = page.getByPlaceholder("Search products");
      const featuredProducts = featuredProductsSection(page);
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
      await expect(page.getByText("Showing results for: docker")).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();
      await expect(backendToolkitCard).not.toBeVisible();

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
      await expect(reactStorefrontCard).toBeVisible();
      await expect(frontendPerformanceCard).toBeVisible();
      await expect(reactEcommerceCard).toBeVisible();
      await expect(backendToolkitCard).not.toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await searchInput.fill("toolkit");
      await expect(page).toHaveURL(/\/\?q=toolkit#featured-products$/);
      await expect(page.getByText("Showing results for: toolkit")).toBeVisible();
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();

      await searchInput.fill("docker");
      await expect(page.getByText("Showing results for: docker")).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();
      await expect(reactStorefrontCard).not.toBeVisible();

      await searchInput.fill("ecommerce");
      await expect(page.getByText("Showing results for: ecommerce")).toBeVisible();
      await expect(nextEcommerceCard).toBeVisible();
      await expect(ecommerceAnalyticsCard).toBeVisible();
      await expect(reactEcommerceCard).toBeVisible();

      await searchInput.fill("backend");
      await expect(page.getByText("Showing results for: backend")).toBeVisible();
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();

      await searchInput.fill("containerised");
      await expect(
        page.getByText("Showing results for: containerised"),
      ).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();
      await expect(backendToolkitCard).not.toBeVisible();
      await expect(storeHighlights).not.toBeVisible();

      await searchInput.fill("Back-End");
      await expect(
        page.getByText("Showing results for: Back-End"),
      ).toBeVisible();
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();

      await searchInput.fill("Node");
      await expect(page.getByText("Showing results for: Node")).toBeVisible();
      await expect(backendToolkitCard).toBeVisible();
      await expect(nodeApiBuilderCard).toBeVisible();

      await searchInput.fill("Mobile Responsive");
      await expect(
        page.getByText("Showing results for: Mobile Responsive"),
      ).toBeVisible();
      await expect(mobileResponsiveCard).toBeVisible();

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
      await expect(backendToolkitCard).toBeVisible();
      await expect(dockerToolkitCard).toBeVisible();
      await expect(storeHighlights).toBeVisible();
    },
  );
});
