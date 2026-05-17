import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("FULL STACK STORE CUSTOMER AUTH", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Customer can create an account, log in, check out, and view order history",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/account/register");

      await page.getByLabel("Full name").fill("Taylor Shopper");
      await page.getByLabel("Email").fill("taylor@example.com");
      await page.getByLabel("Password").fill("super-secret");
      await page.getByRole("button", { name: "Create Account" }).click();

      await expect(page).toHaveURL(/\/account$/);
      await expect(page.getByText("Taylor Shopper").first()).toBeVisible();
      await expect(page.getByText("taylor@example.com").first()).toBeVisible();
      await expect(page.getByText(/^Member since [A-Za-z]+ \d{4}$/)).toBeVisible();

      const storedAccount = await page.evaluate(() =>
        window.localStorage.getItem("storefront-customer-account"),
      );
      expect(storedAccount).toContain('"createdAt"');

      await page.getByRole("button", { name: "Logout" }).first().click();
      await expect(page.getByText("You're not logged in.")).toBeVisible();

      await page.goto("/product/backend-starter-toolkit");
      await page.getByRole("button", { name: "Add to Cart" }).click();
      await page.getByRole("button", { name: "Proceed to Checkout" }).click();

      await expect(page).toHaveURL(/\/account\/login\?intent=checkout/);
      await expect(
        page.getByText("Please log in before continuing to checkout."),
      ).toBeVisible();

      await page.getByLabel("Email").fill("taylor@example.com");
      await page.getByLabel("Password").fill("super-secret");
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page).toHaveURL(/\/checkout$/);
      await expect(
        page.getByRole("heading", { name: "Complete your order" }),
      ).toBeVisible();
      await page.getByLabel("Address").fill("12 George Street");
      await page.getByLabel("City").fill("Sydney");
      await page.getByLabel("Postal Code").fill("2000");
      await page.getByLabel("Card Number").fill("4242 4242 4242 4242");
      await page.getByLabel("Expiry Date").fill("12/30");
      await page.getByLabel("CVV").fill("123");
      await page.getByRole("button", { name: "Complete Purchase" }).click();

      await expect(page).toHaveURL(/\/account\/orders$/);
      await expect(page.getByText("Order Confirmed")).toBeVisible();
      await expect(page.getByText("Paid")).toBeVisible();
      await expect(page.getByText("Backend Starter Toolkit")).toBeVisible();
      await expect(
        page.getByText("Your payment was completed successfully for $87.00."),
      ).toBeVisible();
    },
  );
});
