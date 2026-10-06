import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

export type ErrorCode =
  "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT";

export class AppError extends Error {
  readonly status: number;
  readonly code: ErrorCode;

  constructor(status: number, code: ErrorCode, message: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export function errorBody(error: AppError): { error: ErrorCode; message: string } {
  return { error: error.code, message: error.message };
}

export function errorResponse(error: unknown): Response {
  if (error instanceof AppError) {
    const response = NextResponse.json(errorBody(error), { status: error.status });
    if (error.code === "UNAUTHORIZED") {
      response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
    return response;
  }

  console.error(error);
  return Response.json(
    { error: "INTERNAL", message: "Something went wrong." },
    { status: 500 },
  );
}

export async function handle(action: () => Promise<Response>): Promise<Response> {
  try {
    return await action();
  } catch (error) {
    return errorResponse(error);
  }
}
