import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../../..");

function normalizeEnvValue(value: string) {
  const trimmedValue = value.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return false;
  }

  const fileContent = readFileSync(filePath, "utf8");

  for (const line of fileContent.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmedLine.indexOf("=");
    if (equalsIndex <= 0) {
      continue;
    }

    const key = trimmedLine.slice(0, equalsIndex).trim();

    if (!key || process.env[key]) {
      continue;
    }

    const value = trimmedLine.slice(equalsIndex + 1);
    process.env[key] = normalizeEnvValue(value);
  }

  return true;
}

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const envCandidates = [
    path.resolve(workspaceRoot, ".env.local"),
    path.resolve(workspaceRoot, ".env"),
    path.resolve(workspaceRoot, "packages/db/.env.local"),
    path.resolve(workspaceRoot, "packages/db/.env"),
    path.resolve(workspaceRoot, "apps/admin/.env.local"),
    path.resolve(workspaceRoot, "apps/admin/.env"),
    path.resolve(workspaceRoot, "apps/web/.env.local"),
    path.resolve(workspaceRoot, "apps/web/.env"),
  ];

  for (const envFilePath of envCandidates) {
    loadEnvFile(envFilePath);

    if (process.env.DATABASE_URL) {
      return;
    }
  }
}

ensureDatabaseUrl();

declare global {
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  if (global.prisma) {
    return global.prisma;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to the shell environment or one of the shared .env files before using Prisma.",
    );
  }

  const prisma = new PrismaClient();

  global.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};
