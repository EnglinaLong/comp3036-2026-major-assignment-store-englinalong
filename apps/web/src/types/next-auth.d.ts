import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      createdAt: string;
    };
  }

  interface User extends DefaultUser {
    role: string;
    createdAt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    createdAt?: string;
  }
}
