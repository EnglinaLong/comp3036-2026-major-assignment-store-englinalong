import { pathToFileURL } from "node:url";
import { client } from "./client.js";
import { products } from "./data.js";

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
