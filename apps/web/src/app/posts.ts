import { getSeededPostDate, type Post } from "@repo/db/data";
import { client } from "@repo/db/client";
import type { Prisma } from "@prisma/client";
import { slugifyTitle } from "@/functions/productHref";

function mapPost(
  post: Prisma.PostGetPayload<{
    include: {
      _count: {
        select: {
          Likes: true;
        };
      };
    };
  }>,
): Post {
  const seededDate = getSeededPostDate(post);

  return {
    ...post,
    date: seededDate ?? post.date,
    likes: post._count.Likes,
  };
}

export function getRequestIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  }

  return requestHeaders.get("x-real-ip")?.trim() || "127.0.0.1";
}

export async function getPosts(where?: Prisma.PostWhereInput) {
  const posts = await client.db.post.findMany({
    where,
    orderBy: {
      id: "asc",
    },
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
  });

  return posts.map(mapPost);
}

export async function incrementPostViews(urlId: string) {
  const existingPost = await client.db.post.findFirst({
    where: {
      active: true,
      urlId,
    },
    select: {
      id: true,
    },
  });

  let targetPostId = existingPost?.id ?? null;

  if (!targetPostId) {
    const activePosts = await client.db.post.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        title: true,
        urlId: true,
      },
    });

    const fallbackPost = activePosts.find(
      (post) => post.urlId === urlId || slugifyTitle(post.title) === urlId,
    );

    if (!fallbackPost) {
      return null;
    }
    targetPostId = fallbackPost.id;
  }

  const updatedPost = await client.db.post.update({
    where: {
      id: targetPostId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
  });

  return mapPost(updatedPost);
}

export async function hasLikedPost(postId: number, userIP: string) {
  const like = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId,
        userIP,
      },
    },
  });

  return like !== null;
}

export async function setPostLike(postId: number, userIP: string, liked: boolean) {
  await client.db.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      throw new Error("POST_NOT_FOUND");
    }

    const existingLike = await tx.like.findUnique({
      where: {
        postId_userIP: {
          postId,
          userIP,
        },
      },
    });

    if (liked && !existingLike) {
      await tx.like.create({
        data: {
          postId,
          userIP,
        },
      });
    }

    if (!liked && existingLike) {
      await tx.like.delete({
        where: {
          postId_userIP: {
            postId,
            userIP,
          },
        },
      });
    }
  });

  const likes = await client.db.like.count({
    where: {
      postId,
    },
  });

  return {
    liked,
    likes,
  };
}
