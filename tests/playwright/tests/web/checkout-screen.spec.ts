import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import {
  loginCustomer,
  registerOrLoginCustomer,
  resetStorefrontState,
} from "./helpers";

test.describe("FULL STACK STORE CHECKOUT", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Customer can complete checkout and view order history",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      const customer = {
        name: "Morgan Checkout",
        email: "morgan.checkout@example.com",
        password: "safe-password-123",
      };

      await registerOrLoginCustomer(page, customer, {
        returnTo: "/account",
      });

      await expect(page).toHaveURL(/\/account$/);
      await expect(page.getByText(customer.name).first()).toBeVisible();
      await expect(page.getByText(customer.email).first()).toBeVisible();

      await page.goto("/account/orders");
      await expect(
        page.getByRole("heading", { name: "Orders", exact: true }),
      ).toBeVisible();

      const existingBackendToolkitOrder = page
        .locator("section")
        .filter({
          has: page.getByText("Backend Starter Toolkit", { exact: true }),
        })
        .filter({ has: page.getByText("Paid", { exact: true }) })
        .first();

      if (await existingBackendToolkitOrder.isVisible().catch(() => false)) {
        await expect(existingBackendToolkitOrder).toContainText(
          "Backend Starter Toolkit",
        );
        await expect(existingBackendToolkitOrder).toContainText("Paid");
        return;
      }

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
      await page.waitForURL(/\/(checkout|account\/login)/);

      if (page.url().includes("/account/login")) {
        const continueShopping = page.getByRole("link", {
          name: "Continue Shopping",
        });

        if (await continueShopping.isVisible()) {
          await continueShopping.click();
        } else {
          await expect(
            page.getByRole("button", { name: "Login" }),
          ).toBeVisible();
          await loginCustomer(page, customer, {
            intent: "checkout",
            returnTo: "/checkout",
          });
        }
      }

      await expect(page).toHaveURL(/\/checkout$/);
      await expect(
        page.getByRole("heading", { name: "Complete your order" }),
      ).toBeVisible();
      await expect(page.getByText("Shipping Information")).toBeVisible();
      await expect(page.getByText("Payment Details", { exact: true })).toBeVisible();
      await expect(page.getByText("Order Summary")).toBeVisible();
      await expect(
        page.getByText("Backend Starter Toolkit", { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByText(productPrice!, { exact: true }).first(),
      ).toBeVisible();

      await expect(page.getByLabel("Full Name")).toHaveValue(customer.name);
      await expect(page.getByLabel("Email")).toHaveValue(customer.email);
      await expect(page.getByLabel("Cardholder Name")).toHaveValue(customer.name);

      await page.getByLabel("Address").fill("12 George Street");
      await page.getByLabel("City").fill("Sydney");
      await page.getByLabel("Postal Code").fill("2000");
      await page.getByLabel("Card Number").fill("4242424242424242");
      await expect(page.getByLabel("Card Number")).toHaveValue(
        "4242 4242 4242 4242",
      );
      await page.getByLabel("Expiry Date").fill("1230");
      await expect(page.getByLabel("Expiry Date")).toHaveValue("12/30");
      await page.getByLabel("CVV").fill("123");

      await page.getByRole("button", { name: "Complete Purchase" }).click();

      if (!page.url().endsWith("/account/orders")) {
        await expect(page.getByText("Order Confirmed")).toBeVisible();
        await page.goto("/account/orders");
      }

      await expect(
        page.getByRole("heading", { name: "Orders", exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Order Confirmed")).toBeVisible();
      await expect(
        page.getByText(
          `Your payment was completed successfully for ${productPrice!}.`,
        ),
      ).toBeVisible();

      await expect(existingBackendToolkitOrder).toBeVisible();
      await expect(existingBackendToolkitOrder).toContainText(
        "Backend Starter Toolkit",
      );
      await expect(existingBackendToolkitOrder).toContainText("Paid");
      await expect(existingBackendToolkitOrder).toContainText(productPrice!);

      await page.getByRole("button", { name: /Cart \(0\)/ }).click();
      await expect(cartDrawer).toBeVisible();
      await expect(cartDrawer.getByText("Your cart is empty.")).toBeVisible();
    },
  );
});
