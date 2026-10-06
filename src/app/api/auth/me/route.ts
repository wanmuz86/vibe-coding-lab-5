import { requireUser } from "@/lib/auth/current-user";
import { handle } from "@/lib/http/errors";

export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    return Response.json({ user });
  });
}
