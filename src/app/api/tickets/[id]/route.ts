import { requireUser } from "@/lib/auth/current-user";
import { handle } from "@/lib/http/errors";
import { toTicketResponse } from "@/server/tickets/ticket.mapper";
import { deleteTicket, getTicket } from "@/server/tickets/ticket.service";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  return handle(async () => {
    const user = await requireUser(request);
    const { id } = await context.params;
    const ticket = await getTicket(user, id);
    return Response.json({ ticket: toTicketResponse(ticket) });
  });
}

export async function DELETE(request: Request, context: Context) {
  return handle(async () => {
    const user = await requireUser(request);
    const { id } = await context.params;
    await deleteTicket(user, id);
    return Response.json({ ok: true });
  });
}
