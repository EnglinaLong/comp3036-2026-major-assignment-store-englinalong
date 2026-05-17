import { test as setup } from "@playwright/test";
import fs from "fs";

////////////////////////////////////////
// Admin authentication state for store UI tests
////////////////////////////////////////

setup(
  "Admin authentication flow",
  { tag: "@a2" },
  async () => {
    const authFile = ".auth/user.json";
    const content = {
      cookies: [
        {
          name: "auth_token",
          value: "123",
          domain: "localhost",
          secure: false,
          expires: -1,
          path: "/",
          httpOnly: false,
          sameSite: "Lax",
        },
      ],
    };
    fs.writeFileSync(authFile, JSON.stringify(content, null, 2));
  },
);

////////////////////////////////////////////////////////
// API-backed authentication state for advanced store UI tests
////////////////////////////////////////////////////////

setup(
  "Store admin API authentication flow",
  { tag: "@a3" },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";

    const apiContext = await playwright.request.newContext();

    await apiContext.post("/api/auth/login", {
      data: JSON.stringify({ password: "123" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await apiContext.storageState({ path: authFile });
    await apiContext.dispose();
  },
);
