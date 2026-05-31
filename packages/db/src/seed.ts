import { pathToFileURL } from "node:url";
import { client } from "./client.js";
import { products } from "./data.js";

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

export async function seed() {
  await seedProducts({
    overwriteExisting: false,
    overwriteProtectedFields: false,
  });
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
