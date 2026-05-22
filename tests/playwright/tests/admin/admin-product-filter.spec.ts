import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { productCard } from "./helpers";

test.describe("FULL STACK STORE ADMIN PRODUCT FILTERS", () => {
  test.beforeEach(async () => {
    await seedTestData();
  });

  test(
    "Admin product details filter finds products by name, summary, category, and tags",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      const detailsFilter = userPage.getByLabel("Filter by Product Details:");

      await detailsFilter.fill("Docker");
      await expect(productCard(userPage, "Docker Deployment Toolkit")).toBeVisible();
      await expect(
        productCard(userPage, "React Storefront UI Kit"),
      ).not.toBeVisible();

      await detailsFilter.fill("containerised");
      await expect(productCard(userPage, "Docker Deployment Toolkit")).toBeVisible();

      await detailsFilter.fill("DevOps");
      await expect(productCard(userPage, "Docker Deployment Toolkit")).toBeVisible();
      await expect(
        productCard(userPage, "Cloud Deployment Starter Pack"),
      ).toBeVisible();

      await detailsFilter.fill("Back-End");
      await expect(productCard(userPage, "Docker Deployment Toolkit")).toBeVisible();
      await expect(productCard(userPage, "API Security Toolkit")).toBeVisible();
    },
  );

  test(
    "Admin collection filter finds products by collection tags",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      const collectionFilter = userPage.getByLabel("Filter by Collection:");

      await collectionFilter.fill("Front-End");
      await expect(
        productCard(userPage, "React Storefront UI Kit"),
      ).toBeVisible();
      await expect(
        productCard(userPage, "Frontend Performance Toolkit"),
      ).toBeVisible();
      await expect(productCard(userPage, "Docker Deployment Toolkit")).not.toBeVisible();

      await collectionFilter.fill("API");
      await expect(productCard(userPage, "API Security Toolkit")).toBeVisible();
      await expect(productCard(userPage, "Node API Builder Pack")).toBeVisible();
      await expect(
        productCard(userPage, "React Storefront UI Kit"),
      ).not.toBeVisible();
    },
  );

  test(
    "Admin date added filter only matches full MMDDYYYY values",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      const dateFilter = userPage.getByLabel("Filter by Date Added:");

      await dateFilter.fill("05");
      await expect(userPage.locator("article")).toHaveCount(0);

      await dateFilter.fill("05142026");
      await expect(productCard(userPage, "Docker Deployment Toolkit")).toBeVisible();
      await expect(
        productCard(userPage, "Cloud Deployment Starter Pack"),
      ).not.toBeVisible();
    },
  );

  test(
    "Admin sort filter changes product order for newest and oldest views",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      const sortBy = userPage.getByLabel("Sort By:");

      await sortBy.selectOption("date-desc");
      await expect(userPage.locator("article").first()).toContainText(
        "Frontend Performance Toolkit",
      );

      await sortBy.selectOption("date-asc");
      await expect(userPage.locator("article").first()).toContainText(
        "UI Component Library Pro",
      );
    },
  );
});
