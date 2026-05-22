import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@repo/db/client";
import {
  getFallbackCreatedAt,
  normalizeCustomerCreatedAt,
  normalizeCustomerEmail,
} from "./customerAuth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "storefront-local-auth-secret",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = normalizeCustomerEmail(credentials?.email ?? "");
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const user = await client.db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await compare(password, user.passwordHash);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name?.trim() || user.email,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.createdAt = normalizeCustomerCreatedAt(user.createdAt);
      }

      if (!token.createdAt) {
        token.createdAt = getFallbackCreatedAt();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub ?? "");
        session.user.name = token.name ?? session.user.email ?? "";
        session.user.email = token.email ?? session.user.email ?? "";
        session.user.role =
          typeof token.role === "string" ? token.role : "customer";
        session.user.createdAt =
          typeof token.createdAt === "string"
            ? token.createdAt
            : getFallbackCreatedAt();
      }

      return session;
    },
  },
};
