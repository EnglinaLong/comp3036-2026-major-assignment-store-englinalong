export async function seedTestData() {
  const { seedForTests } = await import("../../../packages/db/src/seed.ts");

  await seedForTests();
}
