import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";

const CUSTOMER_ACCOUNT_STORAGE_KEY = "storefront-customer-account";
const CUSTOMER_SESSION_STORAGE_KEY = "storefront-customer-session";
const CUSTOMER_ORDERS_STORAGE_KEY = "storefront-customer-orders";
const PAYMENT_SUCCESS_STORAGE_KEY = "storefront-payment-success";
const CART_STORAGE_KEY = "storefront-cart-items";

test.describe("FULL STACK STORE CHECKOUT", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();

    await page.goto("/");
    await page.evaluate(
      ({
        customerAccountStorageKey,
        customerSessionStorageKey,
        customerOrdersStorageKey,
        paymentSuccessStorageKey,
        cartStorageKey,
      }) => {
        window.localStorage.removeItem(customerAccountStorageKey);
        window.localStorage.removeItem(customerSessionStorageKey);
        window.localStorage.removeItem(customerOrdersStorageKey);
        window.localStorage.removeItem(paymentSuccessStorageKey);
        window.localStorage.removeItem(cartStorageKey);
      },
      {
        customerAccountStorageKey: CUSTOMER_ACCOUNT_STORAGE_KEY,
        customerSessionStorageKey: CUSTOMER_SESSION_STORAGE_KEY,
        customerOrdersStorageKey: CUSTOMER_ORDERS_STORAGE_KEY,
        paymentSuccessStorageKey: PAYMENT_SUCCESS_STORAGE_KEY,
        cartStorageKey: CART_STORAGE_KEY,
      },
    );
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

      await page.goto("/account/register");

      await page.getByLabel("Full name").fill(customer.name);
      await page.getByLabel("Email").fill(customer.email);
      await page.getByLabel("Password").fill(customer.password);
      await page.getByRole("button", { name: "Create Account" }).click();

      await expect(page).toHaveURL(/\/account$/);
      await expect(page.getByText(customer.name).first()).toBeVisible();
      await expect(page.getByText(customer.email).first()).toBeVisible();

      await page.getByRole("button", { name: "Logout" }).first().click();
      await expect(
        page.getByRole("navigation").getByRole("link", { name: "Login" }),
      ).toBeVisible();

      await page.goto("/product/backend-starter-toolkit");
      await page.getByRole("button", { name: "Add to Cart" }).click();

      const cartDrawer = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(cartDrawer).toBeVisible();
      await expect(cartDrawer.getByText("Backend Starter Toolkit")).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Cart \(1\)/ }),
      ).toBeVisible();

      await cartDrawer.getByRole("button", { name: "Proceed to Checkout" }).click();

      await expect(page).toHaveURL(/\/account\/login\?intent=checkout/);
      await expect(
        page.getByText("Please log in before continuing to checkout."),
      ).toBeVisible();

      await page.getByLabel("Email").fill(customer.email);
      await page.getByLabel("Password").fill(customer.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page).toHaveURL(/\/checkout$/);
      await expect(
        page.getByRole("heading", { name: "Complete your order" }),
      ).toBeVisible();
      await expect(page.getByText("Order Summary")).toBeVisible();
      await expect(
        page.getByText("Payment Details", { exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Shipping Information")).toBeVisible();
      await expect(
        page.getByText("Backend Starter Toolkit", { exact: true }).first(),
      ).toBeVisible();

      await expect(page.getByLabel("Full Name")).toHaveValue(customer.name);
      await expect(page.getByLabel("Email")).toHaveValue(customer.email);
      await page.getByLabel("Address").fill("12 George Street");
      await page.getByLabel("City").fill("Sydney");
      await page.getByLabel("Postal Code").fill("2000");
      await expect(page.getByLabel("Cardholder Name")).toHaveValue(customer.name);
      await page.getByLabel("Card Number").fill("4242424242424242");
      await expect(page.getByLabel("Card Number")).toHaveValue(
        "4242 4242 4242 4242",
      );
      await page.getByLabel("Expiry Date").fill("1230");
      await expect(page.getByLabel("Expiry Date")).toHaveValue("12/30");
      await page.getByLabel("CVV").fill("123");

      await page.getByRole("button", { name: "Complete Purchase" }).click();

      await expect(page).toHaveURL(/\/account\/orders$/);
      await expect(page.getByText("Order Confirmed")).toBeVisible();
      await expect(
        page.getByText("Your payment was completed successfully for $87.00."),
      ).toBeVisible();
      await expect(page.getByText("Paid")).toBeVisible();
      await expect(page.getByText("Backend Starter Toolkit")).toBeVisible();

      await page.getByRole("button", { name: /Cart \(0\)/ }).click();
      const clearedCartDrawer = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(clearedCartDrawer).toBeVisible();
      await expect(clearedCartDrawer.getByText("Your cart is empty.")).toBeVisible();

      const storedState = await page.evaluate(
        ({
          cartStorageKey,
          customerOrdersStorageKey,
          paymentSuccessStorageKey,
        }) => ({
          cart: window.localStorage.getItem(cartStorageKey),
          orders: window.localStorage.getItem(customerOrdersStorageKey),
          paymentSuccess: window.localStorage.getItem(paymentSuccessStorageKey),
        }),
        {
          cartStorageKey: CART_STORAGE_KEY,
          customerOrdersStorageKey: CUSTOMER_ORDERS_STORAGE_KEY,
          paymentSuccessStorageKey: PAYMENT_SUCCESS_STORAGE_KEY,
        },
      );

      expect(storedState.cart).toBe("[]");
      expect(storedState.paymentSuccess).toContain("$87.00");
      expect(storedState.orders).toContain("Backend Starter Toolkit");
      expect(storedState.orders).toContain('"status":"Paid"');

      await page.reload();
      await expect(
        page.getByRole("heading", { name: "Orders", exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Backend Starter Toolkit")).toBeVisible();
      await expect(page.getByText("Paid")).toBeVisible();
    },
  );
});
