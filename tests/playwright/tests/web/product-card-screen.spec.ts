import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import {
  featuredProductCard,
  resetStorefrontState,
} from "./helpers";

test.describe("FULL STACK STORE PRODUCT CARDS", () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData();
    await resetStorefrontState(page);
  });

  test(
    "Featured product cards render store content and open product detail",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      const firstCard = featuredProductCard(page, "Backend Starter Toolkit");
      await expect(firstCard).toBeVisible();
      await expect(firstCard.locator("img")).toBeVisible();
      await expect(
        firstCard.getByText("Backend Starter Toolkit", { exact: true }),
      ).toBeVisible();
      await expect(
        firstCard.getByRole("link", { name: "Node", exact: true }),
      ).toBeVisible();
      await expect(firstCard.getByText("Available now")).toBeVisible();
      await expect(firstCard.getByText("Back-End")).toBeVisible();
      await expect(firstCard.getByText("product views")).toBeVisible();
      await expect(
        firstCard.getByText(
          "A backend-focused starter toolkit with API structure, auth patterns, database wiring, and deployment notes for modern full-stack teams.",
        ),
      ).toBeVisible();
      await expect(
        firstCard.getByRole("link", { name: "View Product" }),
      ).toBeVisible();

      await firstCard.getByRole("link", { name: "View Product" }).click();
      await expect(page).toHaveURL(/\/product\/backend-starter-toolkit$/);
    },
  );
});
