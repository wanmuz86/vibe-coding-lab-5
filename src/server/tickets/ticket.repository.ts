import { prisma } from "@/lib/db";
import type { TicketStatus } from "@/server/tickets/ticket.contract";

export type TicketRecord = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTicketData = {
  id: string;
  title: string;
  description: string;
  createdById: string;
};

const ticketSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
} as const;

function toRecord(ticket: {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}): TicketRecord {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    createdById: ticket.createdById,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

export const ticketRepository = {
  async create(data: CreateTicketData): Promise<TicketRecord> {
    const ticket = await prisma.ticket.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        createdById: data.createdById,
      },
      select: ticketSelect,
    });
    return toRecord(ticket);
  },

  async findById(id: string): Promise<TicketRecord | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: ticketSelect,
    });
    return ticket ? toRecord(ticket) : null;
  },

  async listByCreator(createdById: string): Promise<TicketRecord[]> {
    const tickets = await prisma.ticket.findMany({
      where: { createdById },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: ticketSelect,
    });
    return tickets.map(toRecord);
  },

  async listAll(): Promise<TicketRecord[]> {
    const tickets = await prisma.ticket.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: ticketSelect,
    });
    return tickets.map(toRecord);
  },

  async updateStatus(id: string, status: TicketStatus): Promise<TicketRecord> {
    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status },
      select: ticketSelect,
    });
    return toRecord(ticket);
  },

  async deleteById(id: string): Promise<void> {
    await prisma.ticket.delete({ where: { id } });
  },
};
