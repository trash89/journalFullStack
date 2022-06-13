const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  //  const allprofiles = await prisma.profile.findMany();
  //    console.log(allProfiles);
  const allClients = await prisma.client.findMany({
    include: {
      profile: true,
    },
  });
  console.log(allClients);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
