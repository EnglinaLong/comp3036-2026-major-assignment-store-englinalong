import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";

test.describe("FULL STACK STORE ADMIN PRODUCT CREATE", () => {
  test.beforeEach(async () => {
    await seedTestData();
  });

  test(
    "Admin create product form loads, validates, and previews product content safely",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      test.setTimeout(60000);

      const productName = "Admin Product Form Coverage";
      const imageUrl =
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
      const productDetails =
        "## Product Overview\n\nA realistic admin product draft used to verify form validation, preview, and field behaviour.";

      await userPage.goto("/");
      await userPage.getByRole("link", { name: "Create Product" }).click();
      await expect(userPage).toHaveURL("/posts/create");
      await expect(
        userPage.getByRole("heading", { name: "Create Product" }),
      ).toBeVisible();
      await expect(userPage.getByLabel("Product Name")).toBeVisible();
      await expect(userPage.getByRole("button", { name: "Save Product" })).toBeVisible();
      await userPage.getByRole("button", { name: "Save Product" }).click();
      await expect(
        userPage.getByText("Please fix the product details before saving"),
      ).toBeVisible();
      await expect(userPage.getByText("Product name is required")).toBeVisible();
      await expect(
        userPage.getByText("Product category is required"),
      ).toBeVisible();
      await expect(
        userPage.getByText("Product summary is required"),
      ).toBeVisible();
      await expect(
        userPage.getByText("Product details are required"),
      ).toBeVisible();
      await expect(
        userPage.getByText("Product image URL is required"),
      ).toBeVisible();
      await expect(userPage.getByText("Price is required")).toBeVisible();
      await expect(
        userPage.getByText("At least one product tag or collection is required"),
      ).toBeVisible();

      await userPage.getByLabel("Product Name").fill(productName);
      await userPage.getByLabel("Product Category").fill("React");
      await userPage
        .getByLabel("Product Summary")
        .fill("A reusable admin form draft used to validate product creation fields safely.");
      await userPage
        .getByPlaceholder(
          "Outline the product overview, what is included, setup notes, and ideal use cases for your storefront resource.",
        )
        .fill(productDetails);
      await expect(
        userPage.getByPlaceholder(
          "Outline the product overview, what is included, setup notes, and ideal use cases for your storefront resource.",
        ),
      ).toHaveValue(productDetails);
      await userPage
        .getByPlaceholder("https://images.unsplash.com/example-product-image")
        .fill(imageUrl);
      await expect(
        userPage.getByPlaceholder(
          "https://images.unsplash.com/example-product-image",
        ),
      ).toHaveValue(imageUrl);
      await userPage.getByLabel("Price").fill("72.00");
      await userPage.getByLabel("Stock Quantity").fill("12");
      await userPage
        .getByLabel("Product Tags / Collections")
        .fill("Front-End, Testing, Storefront");
      await userPage.getByRole("button", { name: "Preview" }).click();
      await expect(userPage.getByTestId("content-preview")).toContainText(
        "Product Overview",
      );
      await expect(userPage.getByTestId("content-preview")).toContainText(
        "verify form validation, preview, and field behaviour",
      );
      await expect(userPage.getByTestId("image-preview")).toBeVisible();
      await userPage.getByRole("button", { name: "Close Preview" }).click();

      await expect(userPage.getByLabel("Product Name")).toHaveValue(productName);
      await expect(userPage.getByLabel("Product Category")).toHaveValue("React");
      await expect(userPage.getByLabel("Price")).toHaveValue("72.00");
      await expect(userPage.getByLabel("Stock Quantity")).toHaveValue("12");
      await expect(
        userPage.getByLabel("Product Tags / Collections"),
      ).toHaveValue("Front-End, Testing, Storefront");
    },
  );
});
