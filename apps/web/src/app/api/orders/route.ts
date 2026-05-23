import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { client } from "@repo/db/client";
import { authOptions } from "@/lib/auth";
import { normalizeCustomerEmail } from "@/lib/customerAuth";
import { mapDatabaseOrder } from "@/lib/orders";

type CheckoutOrderBody = {
  items?: Array<{
    productId?: number;
    quantity?: number;
  }>;
};

function parseUserId(value: unknown) {
  const userId = Number.parseInt(String(value ?? ""), 10);
  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
}

function validateCheckoutBody(body: CheckoutOrderBody) {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return "Your cart is empty.";
  }

  for (const item of body.items) {
    if (!Number.isSafeInteger(item?.productId) || Number(item.productId) <= 0) {
      return "Invalid product selection.";
    }

    if (!Number.isSafeInteger(item?.quantity) || Number(item.quantity) < 1) {
      return "Invalid product quantity.";
    }
  }

  return null;
}

function aggregateItems(items: NonNullable<CheckoutOrderBody["items"]>) {
  const quantities = new Map<number, number>();

  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
  }

  return Array.from(quantities.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

async function getSessionUser(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret:
      typeof authOptions.secret === "string"
        ? authOptions.secret
        : process.env.NEXTAUTH_SECRET || "storefront-local-auth-secret",
  });
  const userId = parseUserId(token?.sub);
  const email = normalizeCustomerEmail(token?.email ?? "");

  if (!userId || !email) {
    return null;
  }

  const user = await client.db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user || normalizeCustomerEmail(user.email) !== email) {
    return null;
  }

  return user;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await client.db.order.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json({
    orders: orders.map(mapDatabaseOrder),
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CheckoutOrderBody;
    const error = validateCheckoutBody(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const requestedItems = aggregateItems(body.items!);
    const products = await client.db.product.findMany({
      where: {
        id: {
          in: requestedItems.map((item) => item.productId),
        },
        active: true,
      },
    });

    if (products.length !== requestedItems.length) {
      return NextResponse.json(
        { error: "One or more selected products are unavailable." },
        { status: 400 },
      );
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    const total = requestedItems.reduce((sum, item) => {
      const product = productById.get(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    if (total <= 0) {
      return NextResponse.json(
        { error: "Unable to process this order." },
        { status: 400 },
      );
    }

    const order = await client.db.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          userId: user.id,
          email: user.email,
          total,
          status: "Paid",
          items: {
            create: requestedItems.map((item) => {
              const product = productById.get(item.productId)!;

              return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      order: mapDatabaseOrder(order),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to complete your checkout." },
      { status: 400 },
    );
  }
}
