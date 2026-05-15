import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  console.log("🌱 Seeding data");

  await client.db.$transaction(async (tx) => {
    await tx.like.deleteMany();
    await tx.post.deleteMany();

    for (const post of posts) {
      await tx.post.create({
        data: {
          title: post.title,
          content: post.content,
          category: post.category,
          description: post.description,
          imageUrl: post.imageUrl,
          tags: post.tags
            .split(",")
            .map((p) => p.trim())
            .join(","),
          urlId: post.urlId,
          active: post.active,
          date: post.date,
          id: post.id,
          views: post.views,
          Likes: {
            create: Array.from({ length: post.likes }, (_, index) => ({
              userIP: `192.168.100.${index}`,
            })),
          },
        },
      });
    }
  });
}
