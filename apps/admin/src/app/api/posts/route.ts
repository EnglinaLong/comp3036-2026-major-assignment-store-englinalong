import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";

type CreatePostBody = {
  title?: string;
  category?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
};

function toUrlId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validate(body: CreatePostBody) {
  if (!body.title?.trim()) return "Title is required";
  if (!body.category?.trim()) return "Category is required";
  if (!body.description?.trim()) return "Description is required";
  if (body.description.length > 200) {
    return "Description is too long. Maximum is 200 characters";
  }
  if (!body.content?.trim()) return "Content is required";
  if (!body.imageUrl?.trim()) return "Image URL is required";
  try {
    new URL(body.imageUrl);
  } catch {
    return "This is not a valid URL";
  }
  if (!body.tags?.trim()) return "At least one tag is required";

  return null;
}

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreatePostBody;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const post = await client.db.post.create({
      data: {
        urlId: toUrlId(body.title!),
        title: body.title!.trim(),
        category: body.category!.trim(),
        description: body.description!.trim(),
        content: body.content!.trim(),
        imageUrl: body.imageUrl!.trim(),
        tags: body.tags!.trim(),
        active: true,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ success: true, id: post.id });
  } catch {
    return NextResponse.json({ error: "Unable to create post" }, { status: 400 });
  }
}
