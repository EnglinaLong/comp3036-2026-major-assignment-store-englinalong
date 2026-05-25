import { getSeededPostDate, type Post } from "@repo/db/data";
import { client } from "@repo/db/client";
import type { Prisma } from "@prisma/client";
import { slugifyTitle } from "@/functions/productHref";

function mapProduct(
  product: Prisma.ProductGetPayload<Prisma.ProductDefaultArgs>,
): Post {
  const seededDate = getSeededPostDate(product);

  return {
    ...product,
    date: seededDate ?? product.date,
  };
}

export async function getProducts(where?: Prisma.ProductWhereInput) {
  const products = await client.db.product.findMany({
    where,
    orderBy: {
      id: "asc",
    },
  });

  return products.map(mapProduct);
}

export async function getPosts(where?: Prisma.ProductWhereInput) {
  return getProducts(where);
}

export async function getProductByUrlId(
  urlId: string,
  where?: Prisma.ProductWhereInput,
) {
  const directMatch = await client.db.product.findFirst({
    where: {
      ...where,
      urlId,
    },
  });

  if (directMatch) {
    return mapProduct(directMatch);
  }

  const candidateProducts = await client.db.product.findMany({
    where,
  });

  const slugMatch = candidateProducts.find(
    (product) => slugifyTitle(product.title) === urlId,
  );

  return slugMatch ? mapProduct(slugMatch) : null;
}

export async function getPostByUrlId(
  urlId: string,
  where?: Prisma.ProductWhereInput,
) {
  return getProductByUrlId(urlId, where);
}

export async function incrementProductViews(urlId: string) {
  const existingProduct = await client.db.product.findFirst({
    where: {
      active: true,
      urlId,
    },
    select: {
      id: true,
    },
  });

  let targetProductId = existingProduct?.id ?? null;

  if (!targetProductId) {
    const activeProducts = await client.db.product.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        title: true,
        urlId: true,
      },
    });

    const fallbackProduct = activeProducts.find(
      (product) =>
        product.urlId === urlId || slugifyTitle(product.title) === urlId,
    );

    if (!fallbackProduct) {
      return null;
    }
    targetProductId = fallbackProduct.id;
  }

  const updatedProduct = await client.db.product.update({
    where: {
      id: targetProductId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return mapProduct(updatedProduct);
}

export async function incrementPostViews(urlId: string) {
  return incrementProductViews(urlId);
}
