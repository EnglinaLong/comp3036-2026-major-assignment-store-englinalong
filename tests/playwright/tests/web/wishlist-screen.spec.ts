import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { resetStorefrontState } from "./helpers";

const CUSTOMER_WISHLIST_STORAGE_KEY = "storefront-customer-wishlist";
const PRODUCT_URL_ID = "backend-starter-toolkit";

test.describe("FULL STACK STORE WISHLIST", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Wishlist button toggles between saved and unsaved storefront states",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto(`/product/${PRODUCT_URL_ID}`);

      const wishlistButton = page.getByTestId("save-product-button");
      await expect(wishlistButton).toBeVisible();
      await expect(wishlistButton).toHaveAttribute("data-wishlist-ready", "true");
      await expect(wishlistButton).toHaveAttribute("aria-pressed", "false");

      await wishlistButton.click();
      await expect(wishlistButton).toContainText("Saved to Wishlist");
      await expect(wishlistButton).toHaveAttribute("aria-pressed", "true");
      await expect
        .poll(() =>
          page.evaluate(
            (storageKey) => window.localStorage.getItem(storageKey),
            CUSTOMER_WISHLIST_STORAGE_KEY,
          ),
        )
        .toBe(JSON.stringify([PRODUCT_URL_ID]));

      await wishlistButton.click();
      await expect(wishlistButton).toContainText("Save to Wishlist");
      await expect(wishlistButton).toHaveAttribute("aria-pressed", "false");
      await expect
        .poll(() =>
          page.evaluate(
            (storageKey) => window.localStorage.getItem(storageKey),
            CUSTOMER_WISHLIST_STORAGE_KEY,
          ),
        )
        .toBe(JSON.stringify([]));
    },
  );
});
