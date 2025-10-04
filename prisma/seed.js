const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.clear();

  console.log("------------------------------------");

  console.log("✅ SEEDING COMPLETED SUCCESSFULLY.");

  console.log("------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
