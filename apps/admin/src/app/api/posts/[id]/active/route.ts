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
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as { active?: boolean };

    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Invalid active value" }, { status: 400 });
    }

    const product = await client.db.product.update({
      where: {
        id: productId,
      },
      data: {
        active: body.active,
      },
      select: {
        id: true,
        active: true,
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
