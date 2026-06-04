import { expect, test } from "./fixtures";
import {
  featuredProductCard,
  featuredProductsSection,
  resetStorefrontState,
} from "./helpers";

function availableProductsStat(page: Parameters<typeof featuredProductsSection>[0]) {
  return page
    .locator("#store-top div")
    .filter({
      has: page.getByText("Available products", { exact: true }),
    })
    .filter({
      has: page.getByText("Categories", { exact: true }),
    })
    .filter({
      has: page.getByText("Collections", { exact: true }),
    })
    .first();
}

test.describe("FULL STACK STORE HOME", () => {
  test.beforeEach(async ({ page }) => {
    await resetStorefrontState(page);
  });

  test(
    "Homepage loads with branding, hero actions, navbar anchors, and stats",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(page.getByText("Full Stack Store").first()).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "Build your next project faster",
        }),
      ).toBeVisible();

      const shopProducts = page.getByRole("link", {
        name: "Shop Products",
        exact: true,
      });
      await expect(shopProducts).toBeVisible();
      await shopProducts.click();
      await expect(page).toHaveURL(/#featured-products$/);
      await expect(
        page.getByRole("heading", { name: "Featured Products" }),
      ).toBeVisible();

      const browseCategories = page.getByRole("link", {
        name: "Browse Categories",
        exact: true,
      });
      await expect(browseCategories).toBeVisible();
      await browseCategories.click();
      await expect(page).toHaveURL(/#shop-by-category$/);
      await expect(
        page.getByRole("heading", { name: "Shop by Category" }),
      ).toBeVisible();

      await page.getByRole("link", { name: "Products", exact: true }).click();
      await expect(page).toHaveURL(/#featured-products$/);
      await page.getByRole("link", { name: "Categories", exact: true }).click();
      await expect(page).toHaveURL(/#shop-by-category$/);
      await page.getByRole("link", { name: "Collections", exact: true }).click();
      await expect(page).toHaveURL(/#collections$/);

      await expect(availableProductsStat(page)).toBeVisible();
      await expect(
        availableProductsStat(page).getByText("Available products", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.locator("#store-top").getByText("Categories", { exact: true }),
      ).toBeVisible();
      await expect(
        page.locator("#store-top").getByText("Collections", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Homepage renders all active storefront products",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      const featuredProducts = featuredProductsSection(page);
      const backendToolkitCard = featuredProductCard(
        page,
        "Backend Starter Toolkit",
      );
      const reactStorefrontCard = featuredProductCard(
        page,
        "React Storefront UI Kit",
      );
      const mobileResponsiveCard = featuredProductCard(
        page,
        "Mobile Responsive Design Pack",
      );

      await expect(availableProductsStat(page)).toBeVisible();
      await expect(
        availableProductsStat(page).getByText("Available products", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Featured Products" }),
      ).toBeVisible();
      await expect(featuredProducts).toBeVisible();
      await expect(backendToolkitCard).toBeVisible();
      await expect(
        backendToolkitCard.getByText("Backend Starter Toolkit", { exact: true }),
      ).toBeVisible();
      await expect(reactStorefrontCard).toBeVisible();
      await expect(
        reactStorefrontCard.getByText("React Storefront UI Kit", { exact: true }),
      ).toBeVisible();
      await expect(mobileResponsiveCard).toBeVisible();
      await expect(
        mobileResponsiveCard.getByText("Mobile Responsive Design Pack", {
          exact: true,
        }),
      ).toBeVisible();
    },
  );
});
