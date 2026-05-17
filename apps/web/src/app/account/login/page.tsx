import { AccountShell } from "@/components/Store/AccountShell";
import { LoginForm } from "@/components/Store/LoginForm";

export default function LoginPage() {
  return (
    <AccountShell title="Login">
      <LoginForm />
    </AccountShell>
  );
}
