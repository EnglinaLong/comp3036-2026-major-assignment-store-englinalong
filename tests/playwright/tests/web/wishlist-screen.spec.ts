import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("FULL STACK STORE WISHLIST", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Wishlist button toggles between saved and unsaved storefront states",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/backend-starter-toolkit");

      const wishlistButton = page.getByTestId("save-product-button");
      await expect(wishlistButton).toBeVisible();
      await wishlistButton.click();
      await expect(wishlistButton).toContainText("Saved to Wishlist");
      await wishlistButton.click();
      await expect(wishlistButton).toContainText("Save to Wishlist");
    },
  );
});
