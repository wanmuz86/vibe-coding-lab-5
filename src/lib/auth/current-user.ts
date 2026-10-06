import { prisma } from "@/lib/db";
import { AppError } from "@/lib/http/errors";
import { readCookie, readSession, SESSION_COOKIE } from "@/lib/auth/session";
import type { CurrentUser } from "@/lib/auth/types";

export async function requireUser(request: Request): Promise<CurrentUser> {
  const userId = readSession(readCookie(request, SESSION_COOKIE));
  if (!userId) {
    throw new AppError(401, "UNAUTHORIZED", "Sign in to continue.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "Sign in to continue.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
