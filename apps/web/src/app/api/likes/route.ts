import { NextResponse } from "next/server";
import { getRequestIp, setPostLike } from "@/app/posts";

async function parsePostId(request: Request) {
  const body = (await request.json()) as { postId?: number };
  const postId = Number(body.postId);

  if (!Number.isInteger(postId) || postId <= 0) {
    return null;
  }

  return postId;
}

export async function POST(request: Request) {
  const postId = await parsePostId(request);

  if (!postId) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  try {
    const result = await setPostLike(postId, getRequestIp(request.headers), true);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    throw error;
  }
}

export async function DELETE(request: Request) {
  const postId = await parsePostId(request);

  if (!postId) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  try {
    const result = await setPostLike(postId, getRequestIp(request.headers), false);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    throw error;
  }
}
