import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";
import { productCard, waitForAdminProductList } from "./helpers";

test.describe("FULL STACK STORE ADMIN PRODUCT CREATE", () => {
  test.beforeEach(async () => {
    await seedTestData();
  });

  test(
    "Admin can create a product and it appears on the customer storefront",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      test.setTimeout(60000);

      const productName = "Playwright Admin Test Product";
      const productUrlId = "playwright-admin-test-product";
      const imageUrl =
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

      await userPage.goto("/");
      await userPage.getByRole("link", { name: "Create Product" }).click();
      await expect(userPage).toHaveURL("/posts/create");
      await expect(
        userPage.getByRole("heading", { name: "Create Product" }),
      ).toBeVisible();
      await expect(userPage.getByLabel("Product Name")).toBeVisible();
      await expect(userPage.getByRole("button", { name: "Save Product" })).toBeVisible();

      await userPage.getByLabel("Product Name").fill(productName);
      await userPage.getByLabel("Product Category").fill("React");
      await userPage
        .getByLabel("Product Summary")
        .fill("A storefront-ready admin test product for Playwright coverage.");
      await userPage
        .getByPlaceholder(
          "Outline the product overview, what is included, setup notes, and ideal use cases for your storefront resource.",
        )
        .fill(
          "## Product Overview\n\nA realistic admin-created product used to verify storefront rendering and cart flows.",
        );
      await expect(
        userPage.getByPlaceholder(
          "Outline the product overview, what is included, setup notes, and ideal use cases for your storefront resource.",
        ),
      ).toHaveValue(
        "## Product Overview\n\nA realistic admin-created product used to verify storefront rendering and cart flows.",
      );
      await userPage
        .getByPlaceholder("https://images.unsplash.com/example-product-image")
        .fill(imageUrl);
      await expect(
        userPage.getByPlaceholder(
          "https://images.unsplash.com/example-product-image",
        ),
      ).toHaveValue(imageUrl);
      await userPage.getByLabel("Price").fill("72.00");
      await userPage
        .getByLabel("Product Tags / Collections")
        .fill("Front-End, Testing, Storefront");

      await userPage.getByRole("button", { name: "Save Product" }).click();
      await expect(userPage.getByText("Product created successfully")).toBeVisible();

      await userPage.goto("/");
      await waitForAdminProductList(userPage);
      await expect(productCard(userPage, productName)).toBeVisible();

      await userPage.reload();
      await expect(productCard(userPage, productName)).toBeVisible();

      const storefrontPage = await userPage.context().newPage();
      await storefrontPage.goto("http://localhost:3001/");

      const storefrontCard = storefrontPage
        .locator("article")
        .filter({
          has: storefrontPage.getByText(productName, { exact: true }),
        })
        .first();

      await expect(storefrontCard).toBeVisible();
      await storefrontCard.getByRole("link", { name: "View Product" }).click();
      await expect(storefrontPage).toHaveURL(
        new RegExp(`/product/${productUrlId}$`),
      );

      await expect(
        storefrontPage.getByRole("heading", { name: productName }).first(),
      ).toBeVisible();
      await expect(
        storefrontPage.getByRole("img", { name: productName }),
      ).toBeVisible();
      await expect(storefrontPage.getByText("$72.00")).toBeVisible();
      await expect(
        storefrontPage.getByRole("link", { name: "Front-End", exact: true }),
      ).toBeVisible();
      await expect(
        storefrontPage.getByRole("link", { name: "Testing", exact: true }),
      ).toBeVisible();
      await expect(
        storefrontPage.getByRole("link", { name: "Storefront", exact: true }),
      ).toBeVisible();

      await storefrontPage.reload();
      await expect(
        storefrontPage.getByRole("heading", { name: productName }).first(),
      ).toBeVisible();
      await expect(storefrontPage.getByText("$72.00")).toBeVisible();

      await storefrontPage.close();
    },
  );
});
