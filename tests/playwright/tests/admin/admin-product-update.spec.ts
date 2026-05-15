import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";
import { productCard, waitForAdminProductList } from "./helpers";

test.describe("FULL STACK STORE ADMIN PRODUCT UPDATE", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Admin can update a product and refreshed admin and storefront views stay in sync",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      const updatedTitle = "Backend Starter Toolkit Plus";
      const updatedSummary =
        "An updated backend toolkit with stronger setup guidance for customer storefront teams.";
      const updatedDetails =
        "## Product Overview\n\nUpdated from admin with clearer deployment and API workflow notes.";
      const updatedImageUrl =
        "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80";

      await userPage.goto("/post/backend-starter-toolkit");
      await expect(
        userPage.getByRole("heading", { name: "Update Product" }),
      ).toBeVisible();
      await expect(userPage.getByLabel("Product Name")).toBeVisible();

      await userPage.getByLabel("Product Name").fill(updatedTitle);
      await userPage.getByLabel("Product Category").fill("Node");
      await userPage.getByLabel("Product Summary").fill(updatedSummary);
      await userPage.getByLabel("Product Details").fill(updatedDetails);
      await userPage.getByLabel("Product Image URL").fill(updatedImageUrl);
      await userPage.getByLabel("Price").fill("88.00");
      await userPage
        .getByLabel("Product Tags / Collections")
        .fill("Back-End, APIs, Launch");

      await userPage.getByRole("button", { name: "Save Product" }).click();
      await expect(userPage.getByText("Product updated successfully")).toBeVisible();

      await userPage.reload();
      await expect(userPage.getByLabel("Product Name")).toHaveValue(updatedTitle);
      await expect(userPage.getByLabel("Product Summary")).toHaveValue(updatedSummary);
      await expect(userPage.getByLabel("Price")).toHaveValue("88");

      await userPage.goto("/");
      await waitForAdminProductList(userPage);
      const updatedCard = productCard(userPage, updatedTitle);
      await expect(updatedCard).toBeVisible();
      await expect(updatedCard).toContainText("#Back-End, #APIs, #Launch");

      const storefrontPage = await userPage.context().newPage();
      await storefrontPage.goto("http://localhost:3001/product/backend-starter-toolkit");
      await expect(
        storefrontPage.getByRole("heading", { name: updatedTitle }).first(),
      ).toBeVisible({ timeout: 15000 });

      await expect(storefrontPage.getByText(updatedSummary)).toBeVisible();
      await expect(storefrontPage.getByText("$88.00")).toBeVisible();
      await expect(storefrontPage.getByText("Launch")).toBeVisible();

      await storefrontPage.reload();
      await expect(
        storefrontPage.getByRole("heading", { name: updatedTitle }).first(),
      ).toBeVisible({ timeout: 15000 });
      await expect(storefrontPage.getByText("$88.00")).toBeVisible();

      await storefrontPage.close();
    },
  );
});
