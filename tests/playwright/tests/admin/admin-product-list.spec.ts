import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { productCard, waitForAdminProductList } from "./helpers";

test.describe("FULL STACK STORE ADMIN PRODUCT LIST", () => {
  test.beforeEach(async () => {
    await seedTestData();
  });

  test(
    "Admin product list shows store metadata for active and inactive products",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");
      await waitForAdminProductList(userPage);

      const activeCard = productCard(userPage, "Docker Deployment Toolkit");
      await expect(activeCard).toBeVisible();
      await expect(
        activeCard.getByRole("img", { name: "Docker Deployment Toolkit" }),
      ).toBeVisible();
      await expect(activeCard).toContainText("#Docker, #Deployment, #Back-End");
      await expect(activeCard).toContainText("Added on May 14, 2026");
      await expect(activeCard).toContainText("DevOps");
      await expect(
        activeCard.getByRole("button", { name: "Active", exact: true }),
      ).toBeVisible();

      const activeResponsiveCard = productCard(
        userPage,
        "Mobile Responsive Design Pack",
      );
      await expect(activeResponsiveCard).toBeVisible();
      await expect(
        activeResponsiveCard.getByRole("button", { name: "Active", exact: true }),
      ).toBeVisible();
    },
  );
});
