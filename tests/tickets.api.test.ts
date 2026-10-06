import { describe, expect, it } from "vitest";
import { DELETE, GET as getOne } from "@/app/api/tickets/[id]/route";
import { POST as resolve } from "@/app/api/tickets/[id]/resolve/route";
import { GET, POST } from "@/app/api/tickets/route";
import { authedRequest, createUser } from "./helpers";

describe("ticket API", () => {
  it("returns the validation error shape for invalid input", async () => {
    const user = await createUser({
      id: "usr_api_invalid",
      role: "USER",
      email: "api-invalid@example.com",
    });

    const response = await POST(
      authedRequest("http://localhost/api/tickets", user.id, {
        method: "POST",
        body: JSON.stringify({ description: "Missing the title." }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "VALIDATION_ERROR",
      message: "Title is required.",
    });
  });

  it("creates a ticket and returns the response contract", async () => {
    const user = await createUser({
      id: "usr_api_create",
      role: "USER",
      email: "api-create@example.com",
    });

    const response = await POST(
      authedRequest("http://localhost/api/tickets", user.id, {
        method: "POST",
        body: JSON.stringify({
          title: "Printer jam",
          description: "The tray is stuck.",
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.ticket).toMatchObject({
      title: "Printer jam",
      description: "The tray is stuck.",
      status: "OPEN",
      createdById: user.id,
    });
    expect(body.ticket.id).toEqual(expect.any(String));
    expect(body.ticket.createdAt).toEqual(expect.any(String));
    expect(body.ticket.updatedAt).toEqual(expect.any(String));
  });

  it("lists only the caller's tickets unless the caller is an agent", async () => {
    const user = await createUser({
      id: "usr_api_list",
      role: "USER",
      email: "api-list@example.com",
    });
    const agent = await createUser({
      id: "usr_api_agent",
      role: "AGENT",
      email: "api-agent@example.com",
    });

    await POST(
      authedRequest("http://localhost/api/tickets", user.id, {
        method: "POST",
        body: JSON.stringify({ title: "Mine", description: "User ticket." }),
      }),
    );
    await POST(
      authedRequest("http://localhost/api/tickets", agent.id, {
        method: "POST",
        body: JSON.stringify({ title: "Queue item", description: "Agent ticket." }),
      }),
    );

    const userResponse = await GET(
      authedRequest("http://localhost/api/tickets", user.id),
    );
    const agentResponse = await GET(
      authedRequest("http://localhost/api/tickets", agent.id),
    );
    const userBody = await userResponse.json();
    const agentBody = await agentResponse.json();

    expect(userResponse.status).toBe(200);
    expect(userBody.tickets.map((ticket: { title: string }) => ticket.title)).toEqual([
      "Mine",
    ]);
    expect(
      agentBody.tickets.map((ticket: { title: string }) => ticket.title).sort(),
    ).toEqual(["Mine", "Queue item"]);
  });

  it("resolves a ticket", async () => {
    const user = await createUser({
      id: "usr_api_resolve",
      role: "USER",
      email: "api-resolve@example.com",
    });
    const created = await POST(
      authedRequest("http://localhost/api/tickets", user.id, {
        method: "POST",
        body: JSON.stringify({
          title: "Need access",
          description: "Account is locked.",
        }),
      }),
    );
    const { ticket } = await created.json();

    const response = await resolve(
      authedRequest(`http://localhost/api/tickets/${ticket.id}/resolve`, user.id, {
        method: "POST",
      }),
      { params: Promise.resolve({ id: ticket.id }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ticket.status).toBe("RESOLVED");
  });

  it("deletes a ticket", async () => {
    const user = await createUser({
      id: "usr_api_delete",
      role: "USER",
      email: "api-delete@example.com",
    });
    const created = await POST(
      authedRequest("http://localhost/api/tickets", user.id, {
        method: "POST",
        body: JSON.stringify({ title: "Duplicate", description: "Please remove." }),
      }),
    );
    const { ticket } = await created.json();

    const response = await DELETE(
      authedRequest(`http://localhost/api/tickets/${ticket.id}`, user.id, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: ticket.id }) },
    );
    const missing = await getOne(
      authedRequest(`http://localhost/api/tickets/${ticket.id}`, user.id),
      { params: Promise.resolve({ id: ticket.id }) },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({
      error: "NOT_FOUND",
      message: "Ticket not found.",
    });
  });
});
