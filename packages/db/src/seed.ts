import bcrypt from "bcryptjs";
import { pathToFileURL } from "node:url";
import { client } from "./client.js";
import { products } from "./data.js";

type SeedUser = {
  email: string;
  name: string;
  password: string;
  role: "customer";
};

type SeedOrder = {
  key: string;
  userEmail: string;
  status: "Paid" | "Processing" | "Shipped" | "Cancelled";
  createdAt: Date;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string;
  items: Array<{
    productUrlId: string;
    quantity: number;
    price: number;
  }>;
};

const seededUsers: SeedUser[] = [
  {
    email: "mia.chen@example.com",
    name: "Mia Chen",
    password: "DemoStore123!",
    role: "customer",
  },
  {
    email: "liam.parker@example.com",
    name: "Liam Parker",
    password: "DemoStore123!",
    role: "customer",
  },
  {
    email: "ava.singh@example.com",
    name: "Ava Singh",
    password: "DemoStore123!",
    role: "customer",
  },
  {
    email: "noah.romero@example.com",
    name: "Noah Romero",
    password: "DemoStore123!",
    role: "customer",
  },
  {
    email: "sophia.nguyen@example.com",
    name: "Sophia Nguyen",
    password: "DemoStore123!",
    role: "customer",
  },
  {
    email: "ethan.wright@example.com",
    name: "Ethan Wright",
    password: "DemoStore123!",
    role: "customer",
  },
];

const seededOrders: SeedOrder[] = [
  {
    key: "seed-order-mia-launch-bundle",
    userEmail: "mia.chen@example.com",
    status: "Paid",
    createdAt: new Date("2026-05-18T10:15:00.000Z"),
    stripeCheckoutSessionId: "seed-cs-mia-launch-bundle",
    stripePaymentIntentId: "seed-pi-mia-launch-bundle",
    items: [
      {
        productUrlId: "backend-starter-toolkit",
        quantity: 1,
        price: 87,
      },
      {
        productUrlId: "api-security-toolkit",
        quantity: 1,
        price: 92,
      },
    ],
  },
  {
    key: "seed-order-liam-storefront-stack",
    userEmail: "liam.parker@example.com",
    status: "Paid",
    createdAt: new Date("2026-05-21T04:45:00.000Z"),
    stripeCheckoutSessionId: "seed-cs-liam-storefront-stack",
    stripePaymentIntentId: "seed-pi-liam-storefront-stack",
    items: [
      {
        productUrlId: "react-storefront-ui-kit",
        quantity: 1,
        price: 84,
      },
      {
        productUrlId: "nextjs-ecommerce-starter",
        quantity: 1,
        price: 104,
      },
      {
        productUrlId: "react-ecommerce-components",
        quantity: 1,
        price: 74,
      },
    ],
  },
  {
    key: "seed-order-ava-dashboard-bundle",
    userEmail: "ava.singh@example.com",
    status: "Paid",
    createdAt: new Date("2026-05-25T13:30:00.000Z"),
    stripeCheckoutSessionId: "seed-cs-ava-dashboard-bundle",
    stripePaymentIntentId: "seed-pi-ava-dashboard-bundle",
    items: [
      {
        productUrlId: "saas-dashboard-kit",
        quantity: 1,
        price: 74,
      },
      {
        productUrlId: "ecommerce-analytics-dashboard",
        quantity: 1,
        price: 74,
      },
    ],
  },
  {
    key: "seed-order-noah-ops-kit",
    userEmail: "noah.romero@example.com",
    status: "Paid",
    createdAt: new Date("2026-05-27T08:00:00.000Z"),
    stripeCheckoutSessionId: "seed-cs-noah-ops-kit",
    stripePaymentIntentId: "seed-pi-noah-ops-kit",
    items: [
      {
        productUrlId: "docker-deployment-toolkit",
        quantity: 1,
        price: 72,
      },
      {
        productUrlId: "cloud-deployment-starter-pack",
        quantity: 1,
        price: 72,
      },
    ],
  },
  {
    key: "seed-order-sophia-performance-pack",
    userEmail: "sophia.nguyen@example.com",
    status: "Paid",
    createdAt: new Date("2026-05-29T17:20:00.000Z"),
    stripeCheckoutSessionId: "seed-cs-sophia-performance-pack",
    stripePaymentIntentId: "seed-pi-sophia-performance-pack",
    items: [
      {
        productUrlId: "frontend-performance-toolkit",
        quantity: 1,
        price: 74,
      },
      {
        productUrlId: "tailwind-ui-component-pack",
        quantity: 1,
        price: 72,
      },
      {
        productUrlId: "mobile-responsive-design-pack",
        quantity: 1,
        price: 67,
      },
    ],
  },
  {
    key: "seed-order-ethan-admin-stack",
    userEmail: "ethan.wright@example.com",
    status: "Paid",
    createdAt: new Date("2026-05-31T02:05:00.000Z"),
    stripeCheckoutSessionId: "seed-cs-ethan-admin-stack",
    stripePaymentIntentId: "seed-pi-ethan-admin-stack",
    items: [
      {
        productUrlId: "responsive-admin-template",
        quantity: 1,
        price: 77,
      },
      {
        productUrlId: "ui-component-library-pro",
        quantity: 1,
        price: 67,
      },
      {
        productUrlId: "node-api-builder-pack",
        quantity: 1,
        price: 92,
      },
    ],
  },
];

function getProductSeedData(product: (typeof products)[number]) {
  return {
    title: product.title,
    content: product.content,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl,
    tags: product.tags
      .split(",")
      .map((p) => p.trim())
      .join(","),
    urlId: product.urlId,
    active: product.active,
    date: product.date,
    views: product.views,
    price: product.price,
    stockQuantity: product.stockQuantity,
    supportingText: product.supportingText,
  };
}

function getOrderTotal(order: SeedOrder) {
  return order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

async function seedProducts(options?: {
  overwriteExisting?: boolean;
  overwriteProtectedFields?: boolean;
}) {
  const overwriteExisting = options?.overwriteExisting ?? false;
  const overwriteProtectedFields =
    options?.overwriteProtectedFields ?? overwriteExisting;

  console.log(
    overwriteExisting
      ? "Seeding store product data for tests"
      : "Seeding missing store products without overwriting live catalog data",
  );

  for (const product of products) {
    const productData = getProductSeedData(product);
    const productUpdateData = overwriteProtectedFields
      ? productData
      : (({
          active: _active,
          price: _price,
          stockQuantity: _stockQuantity,
          ...rest
        }) => rest)(productData);

    if (overwriteExisting) {
      await client.db.product.upsert({
        where: {
          urlId: productData.urlId,
        },
        create: productData,
        update: {
          ...productUpdateData,
        },
      });

      continue;
    }

    const existingProduct = await client.db.product.findUnique({
      where: {
        urlId: productData.urlId,
      },
      select: {
        id: true,
      },
    });

    if (existingProduct) {
      continue;
    }

    await client.db.product.create({
      data: productData,
    });
  }
}

async function seedUsers() {
  console.log("Seeding demo store users");

  for (const user of seededUsers) {
    await client.db.user.upsert({
      where: {
        email: user.email,
      },
      create: {
        email: user.email,
        name: user.name,
        passwordHash: await bcrypt.hash(user.password, 10),
        role: user.role,
      },
      update: {
        name: user.name,
        passwordHash: await bcrypt.hash(user.password, 10),
        role: user.role,
      },
    });
  }
}

async function seedOrders() {
  console.log("Seeding demo store orders");

  const users = await client.db.user.findMany({
    where: {
      email: {
        in: seededOrders.map((order) => order.userEmail),
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const productsInOrders = await client.db.product.findMany({
    where: {
      urlId: {
        in: seededOrders.flatMap((order) =>
          order.items.map((item) => item.productUrlId),
        ),
      },
    },
    select: {
      id: true,
      urlId: true,
    },
  });

  const userByEmail = new Map(users.map((user) => [user.email, user]));
  const productByUrlId = new Map(
    productsInOrders.map((product) => [product.urlId, product]),
  );

  for (const order of seededOrders) {
    const user = userByEmail.get(order.userEmail);

    if (!user) {
      throw new Error(`Unable to seed order ${order.key}: user not found.`);
    }

    const missingProducts = order.items
      .filter((item) => !productByUrlId.has(item.productUrlId))
      .map((item) => item.productUrlId);

    if (missingProducts.length > 0) {
      throw new Error(
        `Unable to seed order ${order.key}: missing products ${missingProducts.join(", ")}.`,
      );
    }

    const total = getOrderTotal(order);
    const existingOrder = await client.db.order.findFirst({
      where: {
        stripeCheckoutSessionId: order.stripeCheckoutSessionId,
      },
      include: {
        items: true,
      },
    });

    const persistedOrder = existingOrder
      ? await client.db.order.update({
          where: {
            id: existingOrder.id,
          },
          data: {
            userId: user.id,
            email: user.email,
            total,
            status: order.status,
            stripeCheckoutSessionId: order.stripeCheckoutSessionId,
            stripePaymentIntentId: order.stripePaymentIntentId,
            createdAt: order.createdAt,
          },
          include: {
            items: true,
          },
        })
      : await client.db.order.create({
          data: {
            userId: user.id,
            email: user.email,
            total,
            status: order.status,
            stripeCheckoutSessionId: order.stripeCheckoutSessionId,
            stripePaymentIntentId: order.stripePaymentIntentId,
            createdAt: order.createdAt,
          },
          include: {
            items: true,
          },
        });

    const existingItemsByProductId = new Map(
      persistedOrder.items.map((item) => [item.productId, item]),
    );

    for (const item of order.items) {
      const product = productByUrlId.get(item.productUrlId);

      if (!product) {
        continue;
      }

      const existingItem = existingItemsByProductId.get(product.id);

      if (existingItem) {
        await client.db.orderItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: item.quantity,
            price: item.price,
          },
        });

        continue;
      }

      await client.db.orderItem.create({
        data: {
          orderId: persistedOrder.id,
          productId: product.id,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }
  }
}

export async function seed() {
  await seedProducts({
    overwriteExisting: false,
    overwriteProtectedFields: false,
  });
  await seedUsers();
  await seedOrders();
}

export async function seedForTests() {
  // Keep Playwright seeding product-only so tests do not recreate customer
  // accounts, orders, or order items, while still resetting seeded products
  // back to deterministic values for each run.
  await seedProducts({
    overwriteExisting: true,
    overwriteProtectedFields: true,
  });
}

const isDirectExecution = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectExecution) {
  seed()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await client.db.$disconnect();
    });
}
