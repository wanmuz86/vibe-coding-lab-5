import { afterAll, beforeEach } from "vitest";
import { prisma } from "../src/lib/db";

beforeEach(async () => {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
