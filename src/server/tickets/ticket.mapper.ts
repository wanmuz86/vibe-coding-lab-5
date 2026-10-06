import type { TicketResponse } from "@/server/tickets/ticket.contract";
import type { TicketRecord } from "@/server/tickets/ticket.repository";

export function toTicketResponse(ticket: TicketRecord): TicketResponse {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    createdById: ticket.createdById,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}
