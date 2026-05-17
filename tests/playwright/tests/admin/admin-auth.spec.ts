import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("FULL STACK STORE ADMIN AUTH", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Admin login and logout work for the Full Stack Store dashboard",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("heading", { name: "Admin Access" }),
      ).toBeVisible();
      await expect(page.getByText("Sign in to your account")).toBeVisible();

      await page.getByLabel("Password", { exact: true }).fill("123");
      await page.getByRole("button", { name: "Sign In" }).click();

      await expect(
        page.getByRole("heading", { name: "Admin of Full Stack Store" }),
      ).toBeVisible();
      await expect(
        page.getByText("Manage your store products from one simple dashboard."),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

      const cookies = await page.context().cookies();
      expect(cookies.find((cookie) => cookie.name === "auth_token")).toBeDefined();

      const logoutResponse = page.waitForResponse(
        (response) =>
          response.url().includes("/api/auth") &&
          response.request().method() === "DELETE" &&
          response.ok(),
      );
      await page.getByRole("button", { name: "Logout" }).click();
      await logoutResponse;
      await page.waitForLoadState("domcontentloaded");

      const loggedOutPage = await page.context().newPage();
      await loggedOutPage.goto("/");
      await expect(
        loggedOutPage.getByRole("heading", { name: "Admin Access" }),
      ).toBeVisible({
        timeout: 10000,
      });
      await expect(
        loggedOutPage.getByText("Sign in to your account"),
      ).toBeVisible();
      await loggedOutPage.close();
    },
  );
});
