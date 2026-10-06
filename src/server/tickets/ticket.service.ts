import { randomBytes } from "node:crypto";
import { AppError } from "@/lib/http/errors";
import type { CurrentUser } from "@/lib/auth/types";
import {
  ticketRepository,
  type TicketRecord,
} from "@/server/tickets/ticket.repository";
import { validateCreateTicketInput } from "@/server/tickets/ticket.validation";

function createTicketId(): string {
  return `tkt_${randomBytes(4).toString("hex")}`;
}

/**
 * The ticket creator or any AGENT may view, resolve, and delete a ticket.
 */
function assertCanAccess(user: CurrentUser, ticket: TicketRecord): void {
  if (user.role === "AGENT" || user.id === ticket.createdById) {
    return;
  }

  throw new AppError(403, "FORBIDDEN", "You cannot access this ticket.");
}

async function loadAuthorizedTicket(
  user: CurrentUser,
  id: string,
): Promise<TicketRecord> {
  const ticket = await ticketRepository.findById(id);
  if (!ticket) {
    throw new AppError(404, "NOT_FOUND", "Ticket not found.");
  }

  assertCanAccess(user, ticket);
  return ticket;
}

export async function createTicket(
  user: CurrentUser,
  body: unknown,
): Promise<TicketRecord> {
  const input = validateCreateTicketInput(body);
  return ticketRepository.create({
    id: createTicketId(),
    title: input.title,
    description: input.description,
    createdById: user.id,
  });
}

export async function listTickets(user: CurrentUser): Promise<TicketRecord[]> {
  if (user.role === "AGENT") {
    return ticketRepository.listAll();
  }

  return ticketRepository.listByCreator(user.id);
}

export async function getTicket(user: CurrentUser, id: string): Promise<TicketRecord> {
  return loadAuthorizedTicket(user, id);
}

export async function resolveTicket(
  user: CurrentUser,
  id: string,
): Promise<TicketRecord> {
  const ticket = await loadAuthorizedTicket(user, id);
  if (ticket.status === "RESOLVED") {
    throw new AppError(409, "CONFLICT", "Ticket is already resolved.");
  }

  return ticketRepository.updateStatus(ticket.id, "RESOLVED");
}

export async function deleteTicket(user: CurrentUser, id: string): Promise<void> {
  const ticket = await loadAuthorizedTicket(user, id);
  await ticketRepository.deleteById(ticket.id);
}
