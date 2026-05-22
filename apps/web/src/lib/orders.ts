import type { Order, OrderItem, Product } from "@prisma/client";
import { getProductHref } from "@/functions/productHref";

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
  id: string;
  date: string;
  status: "Paid";
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

export function formatOrderReference(orderId: number) {
  return `ORD-${orderId}`;
}

export function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function mapDatabaseOrder(order: OrderWithProducts): CustomerOrder {
  return {
    id: formatOrderReference(order.id),
    date: order.createdAt.toISOString(),
    status: "Paid",
    total: formatCurrency(order.total),
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    items: order.items.map((item) => ({
      id: item.product.id,
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
