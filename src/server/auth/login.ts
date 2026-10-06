import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import type { CurrentUser } from "@/lib/auth/types";
import { AppError } from "@/lib/http/errors";

function requiredString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(400, "VALIDATION_ERROR", `${label} is required.`);
  }
  return value.trim();
}

export async function login(body: unknown): Promise<CurrentUser> {
  if (body === null || typeof body !== "object") {
    throw new AppError(400, "VALIDATION_ERROR", "Request body must be a JSON object.");
  }

  const record = body as Record<string, unknown>;
  const email = requiredString(record.email, "Email").toLowerCase();
  if (typeof record.password !== "string" || record.password.length === 0) {
    throw new AppError(400, "VALIDATION_ERROR", "Password is required.");
  }
  const password = record.password;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
