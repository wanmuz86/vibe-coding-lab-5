import { NextResponse } from "next/server";
import { SESSION_COOKIE, signSession } from "@/lib/auth/session";
import { handle } from "@/lib/http/errors";
import { readJson } from "@/lib/http/read-json";
import { login } from "@/server/auth/login";

export async function POST(request: Request) {
  return handle(async () => {
    const user = await login(await readJson(request));
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, signSession(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  });
}
