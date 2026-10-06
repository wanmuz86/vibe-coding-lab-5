export type TicketStatus = "OPEN" | "RESOLVED";

/**
 * JSON contract for a ticket.
 * Each property is listed on purpose. Add a field here when the API starts returning it.
 */
export type TicketResponse = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};
