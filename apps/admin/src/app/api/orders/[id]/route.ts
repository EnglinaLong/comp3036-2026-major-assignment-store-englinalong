import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../../utils/auth";

const ORDER_STATUSES = ["Paid", "Processing", "Shipped", "Cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

function isOrderStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as { status?: string };

    if (!isOrderStatus(body.status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const order = await client.db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: body.status,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
