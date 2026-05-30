import type { Page } from "@playwright/test";

export function featuredProductsSection(page: Page) {
  return page.locator("#featured-products");
}

export function featuredProductCard(page: Page, title: string) {
  return featuredProductsSection(page)
    .locator("article")
    .filter({ has: page.getByText(title, { exact: true }) })
    .first();
}

type CustomerCredentials = {
  name: string;
  email: string;
  password: string;
};

function getAlreadySignedInMessage(page: Page) {
  return page.getByText("You're already signed in as", { exact: false });
}

function getLoginErrorMessage(page: Page) {
  return page.getByText("Incorrect email or password. Please try again.");
}

export async function resetStorefrontState(page: Page) {
  await page.context().clearCookies();
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}

export function productCard(page: Page, id: number) {
  return page.getByTestId(`product-card-${id}`);
}

export function productDetail(page: Page, id: number) {
  return page.getByTestId(`product-detail-${id}`);
}

export async function loginCustomer(
  page: Page,
  customer: CustomerCredentials,
  options?: {
    returnTo?: string;
    intent?: "checkout";
  },
) {
  const shouldReuseCurrentLoginPage = page.url().includes("/account/login");

  if (!shouldReuseCurrentLoginPage) {
    const params = new URLSearchParams();

    if (options?.intent) {
      params.set("intent", options.intent);
    }

    if (options?.returnTo) {
      params.set("returnTo", options.returnTo);
    }

    const loginPath = params.size
      ? `/account/login?${params.toString()}`
      : "/account/login";

    await page.goto(loginPath);
  }

  if (await getAlreadySignedInMessage(page).isVisible().catch(() => false)) {
    const signedInDestination =
      options?.returnTo && options.returnTo !== "/account"
        ? page.getByRole("link", { name: "Continue Shopping" })
        : page.getByRole("link", { name: "View Account" });

    await signedInDestination.click();
    return true;
  }

  await page.getByLabel("Email").fill(customer.email);
  await page.getByLabel("Password").fill(customer.password);
  await page.getByRole("button", { name: "Login" }).click();

  try {
    await page.waitForURL(/\/(account|checkout)(\?|$)/, { timeout: 5000 });
    return true;
  } catch {
    return !(await getLoginErrorMessage(page).isVisible().catch(() => false));
  }
}

export async function registerOrLoginCustomer(
  page: Page,
  customer: CustomerCredentials,
  options?: {
    returnTo?: string;
    intent?: "checkout";
  },
) {
  // This helper can hit the live register endpoint and create a real user.
  // Keep it out of read-only Playwright coverage that runs against shared Neon.
  const loginSucceeded = await loginCustomer(page, customer, {
    returnTo: options?.intent === "checkout" ? options.returnTo : "/account",
    intent: options?.intent,
  });

  if (loginSucceeded) {
    return;
  }

  const params = new URLSearchParams();

  if (options?.intent) {
    params.set("intent", options.intent);
  }

  if (options?.returnTo) {
    params.set("returnTo", options.returnTo);
  }

  const registerPath = params.size
    ? `/account/register?${params.toString()}`
    : "/account/register";

  await page.goto(registerPath);
  await page.getByLabel("Full name").fill(customer.name);
  await page.getByLabel("Email").fill(customer.email);
  await page.getByLabel("Password").fill(customer.password);
  await page.getByRole("button", { name: "Create Account" }).click();

  try {
    await page.waitForURL(/\/account$/, { timeout: 5000 });
    return;
  } catch {
    await page
      .getByText("account with this email already exists", { exact: false })
      .waitFor({ state: "visible", timeout: 5000 });
  }

  await loginCustomer(page, customer, {
    returnTo: options?.intent === "checkout" ? options.returnTo : "/account",
    intent: options?.intent,
  });
}
