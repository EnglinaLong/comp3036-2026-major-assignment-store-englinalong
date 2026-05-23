import type { Order, OrderItem, Product, User } from "@prisma/client";
import { getProductHref } from "@/functions/productHref";

export const ORDER_STATUSES = [
  "Paid",
  "Processing",
  "Shipped",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type CustomerOrderItem = {
  id: number;
  urlId: string;
  title: string;
  category: string;
  price: string;
  quantity: number;
  href: string;
};

export type CustomerOrder = {
  databaseId: number;
  id: string;
  date: string;
  status: OrderStatus;
  total: string;
  itemCount: number;
  items: CustomerOrderItem[];
  shipping: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment: {
    cardholderName: string;
    last4: string;
  };
};

type OrderWithProducts = Order & {
  items: Array<OrderItem & { product: Product }>;
};

export type OrderWithProductsAndUser = Order & {
  user: Pick<User, "id" | "email"> | null;
  items: Array<OrderItem & { product: Product }>;
};

export function formatOrderReference(orderId: number) {
  return `ORD-${orderId}`;
}

export function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function normalizeOrderStatus(status: string): OrderStatus {
  switch (status.trim().toLowerCase()) {
    case "paid":
      return "Paid";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "cancelled":
      return "Cancelled";
    default:
      return "Paid";
  }
}

export function mapDatabaseOrder(order: OrderWithProducts): CustomerOrder {
  return {
    databaseId: order.id,
    id: formatOrderReference(order.id),
    date: order.createdAt.toISOString(),
    status: normalizeOrderStatus(order.status),
    total: formatCurrency(order.total),
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    items: order.items.map((item) => ({
      id: item.id,
      urlId: item.product.urlId,
      title: item.product.title,
      category: item.product.category,
      price: formatCurrency(item.price),
      quantity: item.quantity,
      href: getProductHref(item.product),
    })),
    shipping: {
      fullName: "",
      email: order.email,
      address: "",
      city: "",
      postalCode: "",
    },
    payment: {
      cardholderName: "",
      last4: "",
    },
  };
}
