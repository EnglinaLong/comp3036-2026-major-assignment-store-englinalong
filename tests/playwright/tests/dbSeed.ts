export async function seedTestData() {
  const { seedForTests } = await import("@repo/db/seed");

  await seedForTests();
}
