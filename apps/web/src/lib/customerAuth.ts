export type CustomerProfile = {
  name: string;
  email: string;
  createdAt: string;
};

export function normalizeCustomerEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getFallbackCreatedAt() {
  return new Date().toISOString();
}

export function normalizeCustomerCreatedAt(value: unknown) {
  if (typeof value !== "string") {
    return getFallbackCreatedAt();
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return getFallbackCreatedAt();
  }

  return parsedDate.toISOString();
}

export function isValidCustomerEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function toCustomerProfile(input: {
  name?: string | null;
  email?: string | null;
  createdAt?: string | null;
}): CustomerProfile | null {
  const name = input.name?.trim();
  const email = normalizeCustomerEmail(input.email ?? "");

  if (!name || !email) {
    return null;
  }

  return {
    name,
    email,
    createdAt: normalizeCustomerCreatedAt(input.createdAt),
  };
}
