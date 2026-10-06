import { requireUser } from "@/lib/auth/current-user";
import { handle } from "@/lib/http/errors";
import { readJson } from "@/lib/http/read-json";
import { toTicketResponse } from "@/server/tickets/ticket.mapper";
import { createTicket, listTickets } from "@/server/tickets/ticket.service";

export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const tickets = await listTickets(user);
    // List response mapping. Property names must match TicketResponse.
    return Response.json({ tickets: tickets.map(toTicketResponse) });
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const ticket = await createTicket(user, await readJson(request));
    return Response.json({ ticket: toTicketResponse(ticket) }, { status: 201 });
  });
}
