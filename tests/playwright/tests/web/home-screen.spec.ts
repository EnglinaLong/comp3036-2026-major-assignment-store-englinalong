import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";

test.describe("FULL STACK STORE HOME", () => {
  test.beforeEach(async () => {
    await seedTestData();
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

      await expect(page.getByText("Available products")).toBeVisible();
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

      const featuredProducts = page.locator("#featured-products");

      await expect(page.getByText("Available products")).toBeVisible();
      await expect(page.getByText("Showing all 15 products")).toBeVisible();
      await expect(featuredProducts.getByTestId("product-card-15")).toBeVisible();
      await expect(page.getByText("Mobile Responsive Design Pack")).toBeVisible();
    },
  );
});
