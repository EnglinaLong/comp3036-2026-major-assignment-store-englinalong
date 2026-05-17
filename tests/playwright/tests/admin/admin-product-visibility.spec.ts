import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";
import { productCard, waitForAdminProductList } from "./helpers";

test.describe("FULL STACK STORE ADMIN PRODUCT VISIBILITY", () => {
  test.beforeEach(async () => {
    await seed();
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
      ).toBeVisible();

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
      await expect(
        reloadedDockerCard.getByRole("button", { name: "Active", exact: true }),
      ).toBeVisible();

      await storefrontPage.goto("http://localhost:3001/");
      await expect(
        storefrontPage.getByText("Docker Deployment Toolkit"),
      ).toBeVisible();

      await storefrontPage.close();
    },
  );
});
