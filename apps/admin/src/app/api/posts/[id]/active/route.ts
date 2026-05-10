import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../../../utils/auth";

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
    const body = (await request.json()) as { active?: boolean };

    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Invalid active value" }, { status: 400 });
    }

    const post = await client.db.post.update({
      where: {
        id: postId,
      },
      data: {
        active: body.active,
      },
      select: {
        id: true,
        active: true,
      },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
