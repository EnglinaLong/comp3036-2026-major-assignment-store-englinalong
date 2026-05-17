import { AccountShell } from "@/components/Store/AccountShell";
import { AccountSummary } from "@/components/Store/AccountSummary";

export default function AccountPage() {
  return (
    <AccountShell title="My Account">
      <AccountSummary />
    </AccountShell>
  );
}
