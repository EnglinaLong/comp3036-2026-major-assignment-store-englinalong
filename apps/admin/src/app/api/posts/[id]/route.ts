import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../../utils/auth";

type UpdatePostBody = {
  title?: string;
  category?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
};

function validate(body: UpdatePostBody) {
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as UpdatePostBody;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const post = await client.db.post.update({
      where: { id: postId },
      data: {
        title: body.title!.trim(),
        category: body.category!.trim(),
        description: body.description!.trim(),
        content: body.content!.trim(),
        imageUrl: body.imageUrl!.trim(),
        tags: body.tags!.trim(),
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ success: true, id: post.id });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
