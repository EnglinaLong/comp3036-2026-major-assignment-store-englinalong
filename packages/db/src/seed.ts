import { pathToFileURL } from "node:url";
import { client } from "./client.js";
import { products } from "./data.js";

function normalizeEnvValue(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function assertSafeTestDatabaseReset() {
  const activeDatabaseUrl = normalizeEnvValue(process.env.DATABASE_URL);
  const testDatabaseUrl = normalizeEnvValue(process.env.TEST_DATABASE_URL);
  const realDatabaseUrl = normalizeEnvValue(process.env.PLAYWRIGHT_REAL_DATABASE_URL);

  if (!testDatabaseUrl) {
    throw new Error(
      "Missing TEST_DATABASE_URL. Refusing to reset test data without an explicit test database.",
    );
  }

  if (!activeDatabaseUrl) {
    throw new Error(
      "Missing DATABASE_URL. Refusing to reset test data without an active Prisma datasource URL.",
    );
  }

  if (activeDatabaseUrl !== testDatabaseUrl) {
    throw new Error(
      "Refusing to reset test data because DATABASE_URL is not using TEST_DATABASE_URL.",
    );
  }

  if (realDatabaseUrl && activeDatabaseUrl === realDatabaseUrl) {
    throw new Error(
      "Refusing to reset test data because the active DATABASE_URL matches the real store database.",
    );
  }
}

async function clearProducts() {
  await client.db.like.deleteMany();
  await client.db.product.deleteMany();
}

async function clearOrders() {
  await client.db.orderItem.deleteMany();
  await client.db.order.deleteMany();
}

async function clearUsers() {
  await client.db.user.deleteMany();
}

async function syncProductIdSequence() {
  await client.db.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Product"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Product"), 1),
      true
    );
  `;
}

function getProductSeedData(product: (typeof products)[number]) {
  const likesData = Array.from({ length: product.likes }, (_, index) => ({
    userIP: `192.168.100.${index}`,
  }));

  return {
    productData: {
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
    },
    likesData,
  };
}

export async function seed() {
  console.log("Seeding store product data");

  for (const product of products) {
    const { productData, likesData } = getProductSeedData(product);

    await client.db.product.upsert({
      where: {
        id: product.id,
      },
      create: {
        id: product.id,
        ...productData,
        likes: {
          create: likesData,
        },
      },
      update: {
        ...productData,
        likes: {
          deleteMany: {},
          create: likesData,
        },
      },
    });
  }

  await syncProductIdSequence();
}

export async function seedForTests() {
  assertSafeTestDatabaseReset();
  console.log("Resetting store test data");

  await clearOrders();
  await clearUsers();
  await clearProducts();
  await seed();
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
