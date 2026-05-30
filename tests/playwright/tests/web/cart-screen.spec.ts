import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { resetStorefrontState } from "./helpers";

test.describe("FULL STACK STORE CART", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Cart drawer supports add, quantity updates, remove, and empty state",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/backend-starter-toolkit");

      await page.getByRole("button", { name: "Add to Cart" }).click();
      const cartDrawer = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(cartDrawer).toBeVisible();
      await expect(cartDrawer.getByText("Backend Starter Toolkit")).toBeVisible();
      await expect(cartDrawer.getByText("Subtotal")).toBeVisible();
      await expect(page.getByRole("button", { name: /Cart \(1\)/ })).toBeVisible();

      await page.reload();
      await page.getByRole("button", { name: /Cart \(1\)/ }).click();
      await expect(cartDrawer).toBeVisible();
      await expect(cartDrawer.getByText("Backend Starter Toolkit")).toBeVisible();

      await cartDrawer
        .getByRole("button", { name: /Increase quantity of Backend Starter Toolkit/ })
        .click();
      await expect(page.getByRole("button", { name: /Cart \(2\)/ })).toBeVisible();

      await cartDrawer
        .getByRole("button", { name: /Decrease quantity of Backend Starter Toolkit/ })
        .click();
      await expect(page.getByRole("button", { name: /Cart \(1\)/ })).toBeVisible();

      await cartDrawer.getByRole("button", { name: "Remove" }).click();
      await expect(cartDrawer.getByText("Your cart is empty.")).toBeVisible();
      await expect(
        cartDrawer.getByRole("link", { name: "Continue Shopping" }),
      ).toBeVisible();
    },
  );
});
