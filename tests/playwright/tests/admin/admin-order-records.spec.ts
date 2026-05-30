import { seedTestData } from "../dbSeed";
import { expect, test } from "./fixtures";

test.describe("FULL STACK STORE ADMIN ORDER RECORDS", () => {
  test.setTimeout(60000);

  test.beforeEach(async () => {
    await seedTestData();
  });

  test(
    "Admin dashboard shows customer order records or a safe empty state",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      const orderHeading = userPage.getByRole("heading", {
        name: "Customer Orders",
      });
      const orderSection = orderHeading.locator("xpath=ancestor::section[1]");

      await expect(
        userPage.getByRole("heading", { name: "Admin of Full Stack Store" }),
      ).toBeVisible();
      await expect(orderHeading).toBeVisible();
      await expect(
        orderSection.getByText(
          "Review recent purchase records and their current status.",
        ),
      ).toBeVisible();

      const emptyState = orderSection.getByText("No orders have been placed yet.");
      const orderCards = orderSection.locator("article");

      if ((await orderCards.count()) === 0) {
        await expect(emptyState).toBeVisible();
        return;
      }

      await expect(emptyState).toHaveCount(0);

      const firstOrderCard = orderCards.first();
      await expect(firstOrderCard.getByText(/^Order #\d+$/)).toBeVisible();
      await expect(firstOrderCard.getByText(/^\$\d+\.\d{2}$/).first()).toBeVisible();
      await expect(
        firstOrderCard.getByText(/^(Paid|Processing|Shipped|Cancelled)$/),
      ).toBeVisible();
      await expect(firstOrderCard.getByText(/Qty \d+/).first()).toBeVisible();
    },
  );
});
