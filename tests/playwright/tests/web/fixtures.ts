import "dotenv/config";

import { type BrowserContext } from "@playwright/test";
// Placeholder for future storefront-specific browser options.
export async function seedData(...options: any[]) {
  void options;
}

type AppOptions = {};

export function createOptions(options: Partial<AppOptions>) {
  return JSON.stringify({});
}

export async function setOptions(
  context: BrowserContext,
  options: Partial<AppOptions>,
) {
  await context.addCookies([
    {
      name: "options",
      url: process.env.VERCEL_URL,
      value: createOptions(options),
    },
  ]);
}

export * from "@playwright/test";
