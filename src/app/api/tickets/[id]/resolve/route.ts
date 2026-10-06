import { requireUser } from "@/lib/auth/current-user";
import { handle } from "@/lib/http/errors";
import { toTicketResponse } from "@/server/tickets/ticket.mapper";
import { resolveTicket } from "@/server/tickets/ticket.service";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  return handle(async () => {
    const user = await requireUser(request);
    const { id } = await context.params;
    const ticket = await resolveTicket(user, id);
    return Response.json({ ticket: toTicketResponse(ticket) });
  });
}
