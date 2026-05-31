import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { client } from "@repo/db/client";
import { AccountShell } from "@/components/Store/AccountShell";
import { OrdersClient } from "@/components/Store/OrdersClient";
import { authOptions } from "@/lib/auth";
import { normalizeCustomerEmail } from "@/lib/customerAuth";
import { mapDatabaseOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseSessionUserId(value: string) {
  const userId = Number.parseInt(value, 10);
  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?.id ? parseSessionUserId(session.user.id) : null;
  const sessionEmail = normalizeCustomerEmail(session?.user?.email ?? "");

  const sessionUser = sessionUserId
    ? await client.db.user.findUnique({
        where: {
          id: sessionUserId,
        },
        select: {
          id: true,
          email: true,
        },
      })
    : sessionEmail
      ? await client.db.user.findFirst({
          where: {
            email: {
              equals: sessionEmail,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            email: true,
          },
        })
      : null;

  if (
    !sessionUser ||
    (sessionEmail &&
      normalizeCustomerEmail(sessionUser.email) !== sessionEmail)
  ) {
    redirect("/account/login?returnTo=%2Faccount%2Forders");
  }

  const orders = await client.db.order.findMany({
    where: {
      userId: sessionUser.id,
      ...(sessionEmail
        ? {
            email: {
              equals: sessionEmail,
              mode: "insensitive" as const,
            },
          }
        : {}),
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

  return (
    <AccountShell title="Orders">
      <OrdersClient initialOrders={orders.map(mapDatabaseOrder)} />
    </AccountShell>
  );
}
