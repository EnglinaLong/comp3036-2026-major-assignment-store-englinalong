type SeededProductSnapshot = {
  active: boolean;
  category: string;
  content: string;
  date: Date;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  supportingText: string;
  tags: string;
  title: string;
  urlId: string;
  views: number;
};

let seededProductSnapshots = new Map<string, SeededProductSnapshot>();

async function getDbModules() {
  const [{ client }, { products }] = await Promise.all([
    import("../../../packages/db/src/client.ts"),
    import("../../../packages/db/src/data.ts"),
  ]);

  return {
    client,
    products,
  };
}

export async function seedTestData() {
  const { client, products } = await getDbModules();
  const seededUrlIds = products.map((product) => product.urlId);

  const existingSeededProducts = await client.db.product.findMany({
    where: {
      urlId: {
        in: seededUrlIds,
      },
    },
    select: {
      active: true,
      category: true,
      content: true,
      date: true,
      description: true,
      imageUrl: true,
      price: true,
      stockQuantity: true,
      supportingText: true,
      tags: true,
      title: true,
      urlId: true,
      views: true,
    },
  });

  seededProductSnapshots = new Map(
    existingSeededProducts.map((product) => [product.urlId, product]),
  );

  const { seedForTests } = await import("../../../packages/db/src/seed.ts");

  await seedForTests();
}

export async function restoreSeededProductState() {
  if (seededProductSnapshots.size === 0) {
    return;
  }

  const { client } = await getDbModules();

  const snapshots = Array.from(seededProductSnapshots.values());
  seededProductSnapshots = new Map();

  await client.db.$transaction(
    snapshots.map((product) =>
      client.db.product.update({
        where: {
          urlId: product.urlId,
        },
        data: {
          active: product.active,
          category: product.category,
          content: product.content,
          date: product.date,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          stockQuantity: product.stockQuantity,
          supportingText: product.supportingText,
          tags: product.tags,
          title: product.title,
          views: product.views,
        },
      }),
    ),
  );
}
