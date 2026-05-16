import { AccountShell } from "@/components/Store/AccountShell";
import { RegisterForm } from "@/components/Store/RegisterForm";

export default function RegisterPage() {
  return (
    <AccountShell title="Create Account">
      <RegisterForm />
    </AccountShell>
  );
}
