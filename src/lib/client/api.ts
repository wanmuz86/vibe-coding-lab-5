export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "same-origin",
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: unknown;
  };

  if (!response.ok) {
    const message = typeof data.message === "string" ? data.message : "Request failed.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}
