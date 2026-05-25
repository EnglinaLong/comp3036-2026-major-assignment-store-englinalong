"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearPaymentSuccessState,
  readPaymentSuccessState,
  toFallbackCustomerOrder,
  type PaymentSuccessState,
} from "@/functions/customerOrders";
import type { CustomerOrder } from "@/lib/orders";
import { useCustomerAuth } from "./CustomerAuthProvider";

function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrdersClient({
  initialOrders,
}: {
  initialOrders: CustomerOrder[];
}) {
  const { customer } = useCustomerAuth();
  const [successState, setSuccessState] = useState<PaymentSuccessState | null>(
    null,
  );

  useEffect(() => {
    setSuccessState(readPaymentSuccessState(customer?.email ?? null));
  }, [customer?.email]);

  const orders =
    successState &&
    !initialOrders.some((order) => order.id === successState.orderId)
      ? [toFallbackCustomerOrder(successState), ...initialOrders]
      : initialOrders;

  const confirmedOrderId =
    successState?.orderId ??
    orders.find((order) => order.status === "Paid")?.id ??
    null;

  return (
    <div className="space-y-5">
      {confirmedOrderId ? (
        <div className="rounded-[24px] border border-[color:var(--color-wsu)]/20 bg-[color:var(--color-wsu)]/5 px-5 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Order Confirmed
          </p>
          {successState ? (
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">
              Your payment was completed successfully for {successState.total}.
            </p>
          ) : (
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">
              Your most recent order has been recorded successfully.
            </p>
          )}
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Order reference: {confirmedOrderId}
          </p>
          {successState ? (
            <button
              type="button"
              onClick={() => {
                clearPaymentSuccessState();
                setSuccessState(null);
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-[color:var(--color-wsu)]/20 bg-white px-4 py-2 text-sm font-medium text-[color:var(--color-wsu)] transition hover:bg-[color:var(--color-wsu)]/5 dark:bg-neutral-950"
            >
              Dismiss
            </button>
          ) : null}
        </div>
      ) : null}

      {orders.length === 0 ? (
        <div className="rounded-[24px] border border-black/10 bg-neutral-50 p-6 text-center dark:border-white/10 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
            No orders yet
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            Your completed purchases will appear here.
          </p>
          <Link
            href="/#featured-products"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <section
            key={`order-${order.id}`}
            className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-950"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
                  {order.id}
                </p>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {formatOrderDate(order.date)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {order.status}
                </p>
                <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                  {order.total}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div
                  key={`order-${order.id}-item-${item.id}`}
                  className="flex items-center justify-between gap-4 rounded-[20px] border border-neutral-100 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                      {item.category} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
