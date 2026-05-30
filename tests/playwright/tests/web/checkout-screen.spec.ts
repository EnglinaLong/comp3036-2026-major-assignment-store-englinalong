import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { resetStorefrontState } from "./helpers";

const readonlyCheckoutCustomer = {
  name: "Read Only Customer",
  email: "readonly.customer@example.com",
  createdAt: "2026-03-01T00:00:00.000Z",
};
const customerAccountStorageKey = "storefront-customer-account";

test.describe("FULL STACK STORE CHECKOUT", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Checkout flow stays read-only locally while still validating cart and form behaviour",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/backend-starter-toolkit");
      await expect(
        page.getByRole("heading", { name: "Backend Starter Toolkit" }).first(),
      ).toBeVisible();
      const productPrice = (
        await page.getByText(/^\$\d+\.\d{2}$/).first().textContent()
      )?.trim();
      expect(productPrice).toMatch(/^\$\d+\.\d{2}$/);
      await page.getByRole("button", { name: "Add to Cart" }).click();

      const cartDrawer = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(cartDrawer).toBeVisible();
      await expect(cartDrawer.getByText("Backend Starter Toolkit")).toBeVisible();
      await expect(
        cartDrawer.getByText(productPrice!, { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: /Cart \(1\)/ })).toBeVisible();

      await cartDrawer.getByRole("button", { name: "Proceed to Checkout" }).click();
      await expect(page).toHaveURL(/\/account\/login\?intent=checkout&returnTo=%2Fcheckout$/);
      await expect(
        page.getByText("Please log in before continuing to checkout."),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Need an account? Create one" }),
      ).toBeVisible();

      await page.evaluate(
        ({ storageKey, account }) => {
          window.localStorage.setItem(storageKey, JSON.stringify(account));
        },
        {
          storageKey: customerAccountStorageKey,
          account: readonlyCheckoutCustomer,
        },
      );

      await page.goto("/checkout");

      await expect(page).toHaveURL(/\/checkout$/);
      await expect(
        page.getByRole("heading", { name: "Complete your order" }),
      ).toBeVisible();
      await expect(page.getByText("Shipping Information")).toBeVisible();
      await expect(page.getByText("Payment Details", { exact: true })).toBeVisible();
      await expect(page.getByText("Order Summary")).toBeVisible();
      await expect(page.getByText("Order Total")).toBeVisible();
      await expect(
        page.getByText("Backend Starter Toolkit", { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByText(productPrice!, { exact: true }).first(),
      ).toBeVisible();

      await expect(page.getByLabel("Full Name")).toHaveValue(
        readonlyCheckoutCustomer.name,
      );
      await expect(page.getByLabel("Email")).toHaveValue(
        readonlyCheckoutCustomer.email,
      );
      await expect(
        page.getByLabel("Cardholder Name"),
      ).toHaveValue(readonlyCheckoutCustomer.name);
      await page.getByLabel("Card Number").fill("4242424242424242");
      await expect(page.getByLabel("Card Number")).toHaveValue(
        "4242 4242 4242 4242",
      );
      await page.getByLabel("Expiry Date").fill("1230");
      await expect(page.getByLabel("Expiry Date")).toHaveValue("12/30");
      await page.getByLabel("CVV").fill("12");

      let orderWriteAttempted = false;
      await page.route("**/api/orders", async (route) => {
        orderWriteAttempted = true;
        await route.abort();
      });

      // This checkout spec stays read-only on local/shared Neon. We verify the
      // cart flow and frontend validation, but we do not allow the order POST
      // to run because that would create Order and OrderItem records.
      await page.getByRole("button", { name: "Complete Purchase" }).click();

      await expect(
        page.getByText("Please review your checkout details and try again."),
      ).toBeVisible();
      await expect(page.getByText("Enter your address.")).toBeVisible();
      await expect(page.getByText("Enter your city.")).toBeVisible();
      await expect(page.getByText("Enter your postal code.")).toBeVisible();
      await expect(page.getByText("Enter a valid security code.")).toBeVisible();
      expect(orderWriteAttempted).toBe(false);

      await page.getByRole("button", { name: /Cart \(1\)/ }).click();
      await expect(cartDrawer).toBeVisible();
      await expect(cartDrawer.getByText("Backend Starter Toolkit")).toBeVisible();
      await expect(
        cartDrawer.getByText(productPrice!, { exact: true }),
      ).toBeVisible();
    },
  );
});
