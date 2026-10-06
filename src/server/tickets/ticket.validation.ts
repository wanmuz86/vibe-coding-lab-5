import { AppError } from "@/lib/http/errors";

export type CreateTicketInput = {
  title: string;
  description: string;
};

function requiredText(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string") {
    throw new AppError(400, "VALIDATION_ERROR", `${label} is required.`);
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new AppError(400, "VALIDATION_ERROR", `${label} is required.`);
  }

  if (trimmed.length > maxLength) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      `${label} must be ${maxLength} characters or fewer.`,
    );
  }

  return trimmed;
}

/**
 * Validates a create-ticket body.
 * New ticket fields belong in this function so every caller shares one error shape:
 * { error: "VALIDATION_ERROR", message: "..." }.
 */
export function validateCreateTicketInput(body: unknown): CreateTicketInput {
  if (body === null || typeof body !== "object") {
    throw new AppError(400, "VALIDATION_ERROR", "Request body must be a JSON object.");
  }

  const record = body as Record<string, unknown>;
  return {
    title: requiredText(record.title, "Title", 120),
    description: requiredText(record.description, "Description", 5000),
  };
}
