import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import {
  loginCustomer,
  registerOrLoginCustomer,
  resetStorefrontState,
} from "./helpers";

const customer = {
  name: "Taylor Shopper",
  email: "taylor@example.com",
  password: "super-secret",
};

test.describe("FULL STACK STORE CUSTOMER AUTH", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Customer can log in and view their order history",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      const signedInPanel = page
        .locator("div")
        .filter({ has: page.getByText("Signed In", { exact: true }) })
        .first();

      await registerOrLoginCustomer(page, customer, {
        returnTo: "/account",
      });

      if (page.url().includes("/account/login")) {
        await loginCustomer(page, customer, {
          returnTo: "/account",
        });
      }

      await expect(page).toHaveURL(/\/account$/);
      await expect(signedInPanel).toBeVisible();
      await expect(
        signedInPanel.getByRole("heading", { name: customer.name }),
      ).toBeVisible();
      await expect(
        signedInPanel
          .locator("p")
          .filter({ hasText: customer.email })
          .first(),
      ).toBeVisible();
      await expect(page.getByText(/^Member since [A-Za-z]+ \d{4}$/)).toBeVisible();

      await page.goto("/account/orders");
      await expect(page).toHaveURL(/\/account\/orders$/);
      await expect(
        page.getByRole("heading", { name: "Orders", exact: true }),
      ).toBeVisible();

      const emptyState = page.getByRole("heading", { name: "No orders yet" });

      if (await emptyState.isVisible()) {
        await expect(
          page.getByText("Your completed purchases will appear here."),
        ).toBeVisible();
      } else {
        const orderCards = page.locator("section");
        await expect(orderCards.first()).toBeVisible();
        await expect(page.getByText(/^\$\d+\.\d{2}$/).first()).toBeVisible();
        await expect(
          page.locator("section p").filter({ hasText: "Qty" }).first(),
        ).toBeVisible();
      }

      await page.getByRole("button", { name: "Logout" }).first().click();
      await expect(
        page.getByRole("navigation").getByRole("link", { name: "Login" }),
      ).toBeVisible();
      await expect(
        page.getByRole("navigation").getByRole("link", { name: "Create Account" }),
      ).toBeVisible();
    },
  );
});
