import { PrismaClient, type TicketStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

const passwordHash = hashPassword("password123");

const users = [
  {
    id: "usr_user",
    name: "Casey User",
    email: "user@example.com",
    role: "USER" as const,
  },
  {
    id: "usr_agent",
    name: "Avery Agent",
    email: "agent@example.com",
    role: "AGENT" as const,
  },
];

const tickets: Array<{
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdById: string;
  createdAt: Date;
}> = [
  {
    id: "tkt_1001",
    title: "Password reset email never arrives",
    description:
      "I requested a reset twice and nothing reached the inbox or spam folder.",
    status: "OPEN",
    createdById: "usr_user",
    createdAt: new Date("2026-01-10T09:00:00.000Z"),
  },
  {
    id: "tkt_1002",
    title: "Laptop fan runs loudly",
    description: "The fan stays at full speed even when the machine is idle.",
    status: "OPEN",
    createdById: "usr_user",
    createdAt: new Date("2026-01-12T11:30:00.000Z"),
  },
  {
    id: "tkt_1003",
    title: "VPN disconnects after 10 minutes",
    description: "The office VPN drops and asks for the password again.",
    status: "RESOLVED",
    createdById: "usr_user",
    createdAt: new Date("2026-01-15T14:15:00.000Z"),
  },
  {
    id: "tkt_1004",
    title: "Badge reader rejects a valid badge",
    description:
      "The side door reader flashes red for a badge that works at the front desk.",
    status: "OPEN",
    createdById: "usr_user",
    createdAt: new Date("2026-02-01T08:45:00.000Z"),
  },
  {
    id: "tkt_1005",
    title: "Conference room display is blank",
    description: "Room B display stays black after the cable is connected.",
    status: "RESOLVED",
    createdById: "usr_agent",
    createdAt: new Date("2026-02-03T16:20:00.000Z"),
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
      },
      create: {
        ...user,
        passwordHash,
      },
    });
  }

  for (const ticket of tickets) {
    const existing = await prisma.ticket.findUnique({ where: { id: ticket.id } });
    if (!existing) {
      await prisma.ticket.create({ data: ticket });
    }
  }
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
