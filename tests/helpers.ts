import { hashPassword } from "@/lib/auth/password";
import { signSession } from "@/lib/auth/session";
import type { CurrentUser, UserRole } from "@/lib/auth/types";
import { prisma } from "@/lib/db";

export async function createUser(options: {
  id: string;
  role: UserRole;
  email: string;
  name?: string;
}): Promise<CurrentUser> {
  const user = await prisma.user.create({
    data: {
      id: options.id,
      name: options.name ?? options.role,
      email: options.email,
      passwordHash: hashPassword("password123"),
      role: options.role,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function authedRequest(
  url: string,
  userId: string,
  init?: RequestInit,
): Request {
  const headers = new Headers(init?.headers);
  headers.set("cookie", `session=${signSession(userId)}`);
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return new Request(url, { ...init, headers });
}
