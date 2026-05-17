import { AccountShell } from "@/components/Store/AccountShell";
import { OrdersClient } from "@/components/Store/OrdersClient";

export default function OrdersPage() {
  return (
    <AccountShell title="Orders">
      <OrdersClient />
    </AccountShell>
  );
}
