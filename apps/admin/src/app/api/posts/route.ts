import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";

type CreateProductBody = {
  title?: string;
  category?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  price?: string;
  tags?: string;
};

function toUrlId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validate(body: CreateProductBody) {
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
  const price = Number.parseFloat(String(body.price ?? ""));
  if (!String(body.price ?? "").trim()) return "Price is required";
  if (!Number.isFinite(price) || price <= 0) {
    return "Price must be greater than 0";
  }

  return null;
}

function getSupportingText(category: string) {
  switch (category.trim().toLowerCase()) {
    case "react":
    case "next.js":
      return "Includes complete product files and setup resources.";
    case "node":
      return "Built for modern full-stack development workflows.";
    default:
      return "Instant access included after purchase.";
  }
}

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateProductBody;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const product = await client.db.product.create({
      data: {
        urlId: toUrlId(body.title!),
        title: body.title!.trim(),
        category: body.category!.trim(),
        description: body.description!.trim(),
        content: body.content!.trim(),
        imageUrl: body.imageUrl!.trim(),
        tags: body.tags!.trim(),
        active: true,
        price: Math.round(Number.parseFloat(body.price!.trim())),
        supportingText: getSupportingText(body.category!.trim()),
        views: 0,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ success: true, id: product.id });
  } catch {
    return NextResponse.json({ error: "Unable to create product" }, { status: 400 });
  }
}
