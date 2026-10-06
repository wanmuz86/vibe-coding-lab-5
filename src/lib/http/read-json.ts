import { AppError } from "@/lib/http/errors";

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AppError(400, "VALIDATION_ERROR", "Request body must be JSON.");
  }
}
