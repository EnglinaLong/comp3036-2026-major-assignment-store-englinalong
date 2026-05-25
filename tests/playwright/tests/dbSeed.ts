export async function seedTestData() {
  const { seed } = await import("@repo/db/seed");

  await seed();
}
