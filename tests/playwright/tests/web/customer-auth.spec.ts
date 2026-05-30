import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { resetStorefrontState } from "./helpers";

test.describe("FULL STACK STORE CUSTOMER AUTH", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Customer auth screens stay read-only while protected order history requires login",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/account");
      await expect(page.getByText("You're not logged in.")).toBeVisible();
      await expect(
        page.getByRole("main").getByRole("link", { name: "Create Account" }),
      ).toBeVisible();
      await expect(
        page.getByRole("main").getByRole("link", { name: "Login" }),
      ).toBeVisible();

      await page.goto("/account/login");
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Need an account? Create one" }),
      ).toBeVisible();

      await expect(
        page.getByText("Incorrect email or password. Please try again."),
      ).toHaveCount(0);
      await page.getByLabel("Email").fill("readonly-check@example.com");
      await page.getByLabel("Password").fill("not-a-real-password");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(
        page.getByText("Incorrect email or password. Please try again."),
      ).toBeVisible();

      await page.goto("/account/register");
      await expect(
        page.getByLabel("Full name"),
      ).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Create Account" }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Already have an account? Log in" }),
      ).toBeVisible();

      await page.goto("/account/orders");
      await expect(page).toHaveURL(/\/account\/login\?returnTo=%2Faccount%2Forders$/);
      await expect(
        page.getByLabel("Email"),
      ).toBeVisible();
      await expect(
        page.getByLabel("Password"),
      ).toBeVisible();
    },
  );
});
