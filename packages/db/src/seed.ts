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

export async function seed() {
  console.log("Seeding store product data");

  for (const product of products) {
    const productData = getProductSeedData(product);

    await client.db.product.upsert({
      where: {
        urlId: productData.urlId,
      },
      create: productData,
      update: {
        ...productData,
      },
    });
  }
}

export async function seedForTests() {
  console.log("Seeding safe store test data");
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
