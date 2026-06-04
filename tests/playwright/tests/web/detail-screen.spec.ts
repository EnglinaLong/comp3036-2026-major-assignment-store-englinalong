import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import {
  featuredProductCard,
  productDetail,
  resetStorefrontState,
} from "./helpers";

test.describe("FULL STACK STORE PRODUCT DETAILS", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Product detail page shows store content, pricing, and collections",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/backend-starter-toolkit");

      await expect(
        page.getByRole("heading", { name: "Backend Starter Toolkit" }).first(),
      ).toBeVisible();
      await expect(page.getByRole("img", { name: "Backend Starter Toolkit" })).toBeVisible();
      await expect(page.getByText("Node", { exact: true }).first()).toBeVisible();
      await expect(page.getByText("Price").first()).toBeVisible();
      await expect(page.getByText(/^\$\d+\.\d{2}$/).first()).toBeVisible();
      await expect(
        page.getByText("A backend-focused starter toolkit", { exact: false }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();

      await expect(productDetail(page, 1).getByText("Collections")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "You may also like" }),
      ).toHaveCount(0);
      await expect(page.getByText("More to explore")).toHaveCount(0);

      await page.getByRole("link", { name: "Back to Products" }).click();
      await expect(page).toHaveURL(/#featured-products$/);
    },
  );

  test(
    "Mobile responsive products stay visible in the storefront and product detail pages",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");
      await expect(
        featuredProductCard(page, "Mobile Responsive Design Pack"),
      ).toBeVisible();

      const searchInput = page.locator(
        'input[placeholder="Search products"]:visible',
      );
      await searchInput.fill("Mobile Responsive");
      await expect(page.getByTestId("product-card-15")).toBeVisible();

      await page.goto("/product/mobile-responsive-design-pack");
      await expect(
        page.getByRole("heading", {
          name: "Mobile Responsive Design Pack",
        }).first(),
      ).toBeVisible();
      await expect(page.getByRole("link", { name: "Back to Products" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();
    },
  );
});
