import { beforeEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { RegisterForm } from "./RegisterForm";

const mockRefresh = vi.fn();
const mockRegister = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("./CustomerAuthProvider", () => ({
  useCustomerAuth: () => ({
    customer: null,
    hasHydrated: true,
    register: mockRegister,
  }),
}));

vi.mock("./AuthBrandCard", () => ({
  AuthBrandCard: () => <div>Brand Card</div>,
}));

function updateInputValue(id: string, value: string) {
  const input = document.getElementById(id) as HTMLInputElement | null;

  if (!input) {
    throw new Error(`Missing input: ${id}`);
  }

  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

beforeEach(() => {
  mockRefresh.mockReset();
  mockRegister.mockReset();
});

test("clears a previous auth error and shows a submitting state on resubmit", async () => {
  mockRegister.mockResolvedValueOnce({
    ok: false,
    error: "Incorrect email or password. Please try again.",
  });

  let resolvePendingRegister:
    | ((value: { ok: false; error: string }) => void)
    | undefined;

  mockRegister.mockImplementationOnce(
    () =>
      new Promise<{ ok: false; error: string }>((resolve) => {
        resolvePendingRegister = resolve;
      }),
  );

  const screen = render(<RegisterForm />);

  updateInputValue("register-name", "Casey Customer");
  updateInputValue("register-email", "casey@example.com");
  updateInputValue("register-password", "hunter22");

  (screen.getByText("Create Account").element() as HTMLButtonElement).click();

  await expect
    .element(screen.getByText("Incorrect email or password. Please try again."))
    .toBeInTheDocument();

  (screen.getByText("Create Account").element() as HTMLButtonElement).click();

  await expect.element(screen.getByText("Creating Account...")).toBeInTheDocument();
  expect(document.body.textContent).not.toContain(
    "Incorrect email or password. Please try again.",
  );

  resolvePendingRegister?.({
    ok: false,
    error: "Unable to create your account right now. Please try again.",
  });
});
