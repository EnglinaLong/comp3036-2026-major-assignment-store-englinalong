import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { productCard, waitForAdminProductList } from "./helpers";

test.describe("FULL STACK STORE ADMIN PRODUCT VISIBILITY", () => {
  test.setTimeout(60000);

  test.beforeEach(async () => {
    await seedTestData();
  });

  test(
    "Admin visibility filter separates active and inactive products",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");
      await waitForAdminProductList(userPage);

      const visibilityFilter = userPage.getByLabel("Filter by Visibility:");

      await visibilityFilter.selectOption("active");
      await expect(visibilityFilter).toHaveValue("active");
      await expect(productCard(userPage, "Docker Deployment Toolkit")).toBeVisible();
      await expect(
        productCard(userPage, "Mobile Responsive Design Pack"),
      ).toBeVisible();

      const dockerCard = productCard(userPage, "Docker Deployment Toolkit");
      await dockerCard
        .getByRole("button", { name: "Active", exact: true })
        .click();
      await expect(productCard(userPage, "Docker Deployment Toolkit")).toHaveCount(0);

      await visibilityFilter.selectOption("inactive");
      await expect(visibilityFilter).toHaveValue("inactive");
      const inactiveDockerCard = productCard(userPage, "Docker Deployment Toolkit");
      await expect(inactiveDockerCard).toBeVisible();
      await expect(
        inactiveDockerCard.getByRole("button", { name: "Inactive", exact: true }),
      ).toBeVisible();
      await expect(
        productCard(userPage, "Mobile Responsive Design Pack"),
      ).toHaveCount(0);
    },
  );

  test(
    "Admin active toggles behave correctly on the storefront",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");
      await waitForAdminProductList(userPage);

      const storefrontPage = await userPage.context().newPage();
      await storefrontPage.goto("http://localhost:3001/");

      await expect(
        storefrontPage.getByText("Mobile Responsive Design Pack"),
      ).toBeVisible();

      await userPage.goto("/");
      await waitForAdminProductList(userPage);
      const dockerCard = productCard(userPage, "Docker Deployment Toolkit");
      const statusButton = dockerCard.getByRole("button", {
        name: "Active",
        exact: true,
      });

      await statusButton.click();
      await expect(
        dockerCard.getByRole("button", { name: "Inactive", exact: true }),
      ).toBeVisible();

      await storefrontPage.goto("http://localhost:3001/");
      await expect(
        storefrontPage.getByText("Docker Deployment Toolkit"),
      ).not.toBeVisible();

      await storefrontPage.goto(
        "http://localhost:3001/product/docker-deployment-toolkit",
      );
      await expect(
        storefrontPage.getByRole("heading", {
          name: "This product is currently unavailable.",
        }),
      ).toBeVisible({ timeout: 15000 });

      await storefrontPage.reload();
      await expect(
        storefrontPage.getByRole("heading", {
          name: "This product is currently unavailable.",
        }),
      ).toBeVisible({ timeout: 15000 });

      await userPage.reload();
      const reloadedDockerCard = productCard(userPage, "Docker Deployment Toolkit");
      await expect(
        reloadedDockerCard.getByRole("button", {
          name: "Inactive",
          exact: true,
        }),
      ).toBeVisible();

      await reloadedDockerCard
        .getByRole("button", { name: "Inactive", exact: true })
        .click();
      await userPage.waitForResponse(
        (response) =>
          response.url().includes("/api/posts/") &&
          response.url().includes("/active") &&
          response.request().method() === "PATCH" &&
          response.ok(),
      );

      await userPage.reload();
      await waitForAdminProductList(userPage);
      const reactivatedDockerCard = productCard(
        userPage,
        "Docker Deployment Toolkit",
      );
      await expect(
        reactivatedDockerCard.getByRole("button", {
          name: "Active",
          exact: true,
        }),
      ).toBeVisible();

      await storefrontPage.goto("http://localhost:3001/");
      const featuredDockerCard = storefrontPage
        .locator("#featured-products article")
        .filter({
          has: storefrontPage.getByText("Docker Deployment Toolkit", {
            exact: true,
          }),
        })
        .first();
      await expect(
        featuredDockerCard,
      ).toBeVisible({ timeout: 15000 });

      await storefrontPage.close();
    },
  );
});
