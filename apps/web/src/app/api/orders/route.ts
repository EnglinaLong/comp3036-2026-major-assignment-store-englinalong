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

function isCheckoutError(value: unknown): value is
  | "UNAVAILABLE_PRODUCT"
  | "INSUFFICIENT_STOCK" {
  return value === "UNAVAILABLE_PRODUCT" || value === "INSUFFICIENT_STOCK";
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

  if (!email) {
    return null;
  }

  const user = userId
    ? await client.db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
        },
      })
    : await client.db.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
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
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
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
    const order = await client.db.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: {
            in: requestedItems.map((item) => item.productId),
          },
        },
      });

      if (products.length !== requestedItems.length) {
        throw new Error("UNAVAILABLE_PRODUCT");
      }

      const productById = new Map(products.map((product) => [product.id, product]));

      for (const item of requestedItems) {
        const product = productById.get(item.productId);

        if (!product || !product.active || product.stockQuantity < item.quantity) {
          throw new Error(
            !product || !product.active ? "UNAVAILABLE_PRODUCT" : "INSUFFICIENT_STOCK",
          );
        }
      }

      const total = requestedItems.reduce((sum, item) => {
        const product = productById.get(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      if (total <= 0) {
        throw new Error("UNAVAILABLE_PRODUCT");
      }

      for (const item of requestedItems) {
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: item.productId,
            active: true,
            stockQuantity: {
              gte: item.quantity,
            },
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.count !== 1) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

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
  } catch (error) {
    if (error instanceof Error && isCheckoutError(error.message)) {
      return NextResponse.json(
        {
          error:
            error.message === "INSUFFICIENT_STOCK"
              ? "One or more requested quantities exceed available stock."
              : "One or more selected products are unavailable.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Unable to complete your checkout." },
      { status: 400 },
    );
  }
}
