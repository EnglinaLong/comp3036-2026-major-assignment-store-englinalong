import "dotenv/config";

import { test as base, type BrowserContext, type Page } from "@playwright/test";
import { restoreSeededProductState } from "../dbSeed";

export const e2epassword = "superpassword";
const sharedProductStateKeys = [
  "admin-created-posts",
  "admin-post-overrides",
];
const sharedProductStateCookieKeys = [
  "shared-admin-created-posts",
  "shared-admin-post-overrides",
  "shared-product-state-session",
];

// TODO: Implement seed
export async function seedData(...options: any[]) {}

// Declare the types of your fixtures.
type MyFixtures = {
  dbSeedCleanup: void;
  // adminPage: Page;
  userPage: Page;
};

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
export const test = base.extend<MyFixtures>({
  dbSeedCleanup: [
    async ({}, use) => {
      await use();
      await restoreSeededProductState();
    },
    { auto: true },
  ],
  // adminPage: async ({ browser }, use) => {
  //   const context = await browser.newContext({
  //     storageState: ".auth/admin.json",
  //   });
  //   const adminPage = await context.newPage(); //  new AdminPage(await context.newPage());
  //   await use(adminPage);
  //   await context.close();
  // },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });
    const userPage = await context.newPage(); //  new UserPage(await context.newPage());
    await userPage.goto("/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await userPage.evaluate(
      ({ storageKeys, cookieKeys }) => {
        for (const key of storageKeys) {
          window.localStorage.removeItem(key);
        }

        for (const key of cookieKeys) {
          document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
        }
      },
      {
        storageKeys: sharedProductStateKeys,
        cookieKeys: sharedProductStateCookieKeys,
      },
    );
    const storefrontPage = await context.newPage();
    await storefrontPage.goto("http://localhost:3001/");
    await storefrontPage.evaluate(
      ({ storageKeys }) => {
        for (const key of storageKeys) {
          window.localStorage.removeItem(key);
        }
      },
      {
        storageKeys: sharedProductStateKeys,
      },
    );
    await storefrontPage.close();
    await use(userPage);
    await context.close();
  },
});
