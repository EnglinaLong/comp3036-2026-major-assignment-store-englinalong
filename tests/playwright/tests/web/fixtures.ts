import "dotenv/config";

import { test as base, type BrowserContext } from "@playwright/test";
import { restoreSeededProductState } from "../dbSeed";
// Placeholder for future storefront-specific browser options.
export async function seedData(...options: any[]) {
  void options;
}

type AppOptions = {};
type MyFixtures = {
  dbSeedCleanup: void;
};

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
export const test = base.extend<MyFixtures>({
  dbSeedCleanup: [
    async ({}, use) => {
      await use();
      await restoreSeededProductState();
    },
    { auto: true },
  ],
});
