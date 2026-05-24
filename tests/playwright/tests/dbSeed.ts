import fs from "fs";
import path from "path";

function resolveDatabaseEnvPath() {
  const candidates = [
    path.resolve(process.cwd(), "packages/db/.env"),
    path.resolve(process.cwd(), "../../packages/db/.env"),
    path.resolve(__dirname, "../../../packages/db/.env"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

const databaseEnvPath = resolveDatabaseEnvPath();

function parseEnvFile(filePath: string) {
  const values: Record<string, string> = {};

  if (!fs.existsSync(filePath)) {
    return values;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    values[key] = value.replace(/^['"]|['"]$/g, "");
  }

  return values;
}

const fileEnv = parseEnvFile(databaseEnvPath);

if (fs.existsSync(databaseEnvPath)) {
  process.loadEnvFile(databaseEnvPath);
}

function normalizeEnvValue(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

export async function seedTestData() {
  const realDatabaseUrl =
    normalizeEnvValue(fileEnv.DATABASE_URL) ||
    normalizeEnvValue(process.env.PLAYWRIGHT_REAL_DATABASE_URL);
  const testDatabaseUrl =
    normalizeEnvValue(fileEnv.TEST_DATABASE_URL) ||
    normalizeEnvValue(process.env.TEST_DATABASE_URL);

  if (!testDatabaseUrl) {
    throw new Error(
      `Missing TEST_DATABASE_URL. Test seeding is disabled without ${databaseEnvPath}.`,
    );
  }

  if (realDatabaseUrl && realDatabaseUrl === testDatabaseUrl) {
    throw new Error(
      "Refusing to seed tests because TEST_DATABASE_URL matches the real DATABASE_URL.",
    );
  }

  process.env.PLAYWRIGHT_TEST = "true";
  process.env.DATABASE_URL = testDatabaseUrl;
  process.env.TEST_DATABASE_URL = testDatabaseUrl;

  const { seedForTests } = await import("@repo/db/seed");

  await seedForTests();
}
