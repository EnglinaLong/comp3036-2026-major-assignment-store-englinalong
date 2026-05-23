import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../components/LoginForm";
import { ListScreen, type AdminOrderSummary } from "../components/ListScreen";
import { LogoutButton } from "../components/LogoutButton";
import styles from "./page.module.css";
import { client } from "@repo/db/client";
import { getSeededPostDate, type Post } from "@repo/db/data";

// Disable caching for this page to ensure auth state is always checked
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAdminPosts(): Promise<Post[]> {
  const dbPosts = await client.db.product.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  return dbPosts.map((post) => ({
    ...post,
    date: getSeededPostDate(post) ?? post.date,
    likes: post._count.likes,
  }));
}

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function normalizeOrderStatus(status: string): AdminOrderSummary["status"] {
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

async function getAdminOrders(): Promise<AdminOrderSummary[]> {
  const orders = await client.db.order.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    include: {
      user: {
        select: {
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              title: true,
              urlId: true,
            },
          },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    customerEmail: order.user?.email ?? order.email,
    total: formatCurrency(order.total),
    status: normalizeOrderStatus(order.status),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      title: item.product.title,
      quantity: item.quantity,
      price: formatCurrency(item.price),
      urlId: item.product.urlId,
    })),
  }));
}

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();
  const adminPosts = loggedIn ? await getAdminPosts() : [];
  const adminOrders = loggedIn ? await getAdminOrders() : [];

  if (!loggedIn) {
    return (
      <main className={styles.page}>
        <div className={styles.loginShell}>
          <LoginForm />
        </div>
      </main>
    );
  } else {
    return (
      <main className={styles.page}>
        <section className={styles.dashboard}>
          <div className={styles.topBar}>
            <div className={styles.titleBlock}>
              <h1 className={styles.pageTitle}>Admin of Full Stack Store</h1>
              <p className={styles.pageDescription}>
                Manage your store products from one simple dashboard.
              </p>
            </div>
            <LogoutButton />
          </div>
          <div className={styles.contentCard}>
            <ListScreen initialPosts={adminPosts} initialOrders={adminOrders} />
          </div>
        </section>
      </main>
    );
  }
}
