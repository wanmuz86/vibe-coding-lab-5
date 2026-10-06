import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      title: true,
      status: true,
      createdById: true,
    },
  });

  console.log("id\tstatus\tcreatedById\ttitle");
  for (const ticket of tickets) {
    console.log(
      `${ticket.id}\t${ticket.status}\t${ticket.createdById}\t${ticket.title}`,
    );
  }
  console.log(`\n${tickets.length} ticket(s)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
