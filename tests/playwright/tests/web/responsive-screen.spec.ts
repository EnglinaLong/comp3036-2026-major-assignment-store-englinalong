import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { productCard, resetStorefrontState } from "./helpers";

test.describe("FULL STACK STORE RESPONSIVE", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Dark mode toggle and mobile storefront smoke test work",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      const html = page.locator("html");
      const startingTheme = await html.getAttribute("data-theme");
      const toggle = page.getByRole("button", {
        name: startingTheme === "dark" ? "Light Mode" : "Dark Mode",
      });
      await toggle.click();
      await expect(html).toHaveAttribute(
        "data-theme",
        startingTheme === "dark" ? "light" : "dark",
      );

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await expect(page.getByText("Full Stack Store").first()).toBeVisible();
      await expect(page.getByRole("heading", { name: "Featured Products" })).toBeVisible();

      await productCard(page, 1).getByRole("link", { name: "View Product" }).click();
      await expect(page).toHaveURL(/\/product\/backend-starter-toolkit$/);
    },
  );
});
