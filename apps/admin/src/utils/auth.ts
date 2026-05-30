import jwt from "jsonwebtoken";
import {env} from "@repo/env/admin";
import { cookies } from "next/headers";

export async function isLoggedIn() {
  const userCookies = await cookies();
  const token = userCookies.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  // Keep the legacy fake-cookie bypass available for local Playwright runs only.
  if (
    process.env.NODE_ENV !== "production" &&
    (token === "123" || token === "authenticated")
  ) {
    return true;
  }

  try {
    jwt.verify(token, env.JWT_SECRET || "");
    return true;
  } catch {
    return false;
  }
}
