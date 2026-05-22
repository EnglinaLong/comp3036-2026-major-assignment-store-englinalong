import { getSeededPostDate, type Post } from "@repo/db/data";
import { client } from "@repo/db/client";
import type { Prisma } from "@prisma/client";
import { slugifyTitle } from "@/functions/productHref";

const productWithLikes = {
  include: {
    _count: {
      select: {
        Likes: true,
      },
    },
  },
} satisfies Prisma.ProductDefaultArgs;

function mapPost(
  product: Prisma.ProductGetPayload<typeof productWithLikes>,
): Post {
  const seededDate = getSeededPostDate(product);

  return {
    ...product,
    date: seededDate ?? product.date,
    likes: product._count.Likes,
  };
}

export function getRequestIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  }

  return requestHeaders.get("x-real-ip")?.trim() || "127.0.0.1";
}

export async function getProducts(where?: Prisma.ProductWhereInput) {
  const products = await client.db.product.findMany({
    where,
    orderBy: {
      id: "asc",
    },
    ...productWithLikes,
  });

  return products.map(mapPost);
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
    ...productWithLikes,
  });

  if (directMatch) {
    return mapPost(directMatch);
  }

  const candidateProducts = await client.db.product.findMany({
    where,
    ...productWithLikes,
  });

  const slugMatch = candidateProducts.find(
    (product) => slugifyTitle(product.title) === urlId,
  );

  return slugMatch ? mapPost(slugMatch) : null;
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
    ...productWithLikes,
  });

  return mapPost(updatedProduct);
}

export async function incrementPostViews(urlId: string) {
  return incrementProductViews(urlId);
}

export async function hasLikedProduct(productId: number, userIP: string) {
  const like = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId: productId,
        userIP,
      },
    },
  });

  return like !== null;
}

export async function hasLikedPost(postId: number, userIP: string) {
  return hasLikedProduct(postId, userIP);
}

export async function setProductLike(
  productId: number,
  userIP: string,
  liked: boolean,
) {
  await client.db.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error("POST_NOT_FOUND");
    }

    const existingLike = await tx.like.findUnique({
      where: {
        postId_userIP: {
          postId: productId,
          userIP,
        },
      },
    });

    if (liked && !existingLike) {
      await tx.like.create({
        data: {
          postId: productId,
          userIP,
        },
      });
    }

    if (!liked && existingLike) {
      await tx.like.delete({
        where: {
          postId_userIP: {
            postId: productId,
            userIP,
          },
        },
      });
    }
  });

  const likes = await client.db.like.count({
    where: {
      postId: productId,
    },
  });

  return {
    liked,
    likes,
  };
}

export async function setPostLike(postId: number, userIP: string, liked: boolean) {
  return setProductLike(postId, userIP, liked);
}
