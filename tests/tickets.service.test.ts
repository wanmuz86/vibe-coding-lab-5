import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import {
  createTicket,
  deleteTicket,
  listTickets,
  resolveTicket,
} from "@/server/tickets/ticket.service";
import { createUser } from "./helpers";

describe("ticket service", () => {
  it("creates a ticket from a valid title and description", async () => {
    const user = await createUser({
      id: "usr_create",
      role: "USER",
      email: "create@example.com",
    });

    const ticket = await createTicket(user, {
      title: "  Printer jam  ",
      description: "  The tray is stuck.  ",
    });

    expect(ticket).toMatchObject({
      title: "Printer jam",
      description: "The tray is stuck.",
      status: "OPEN",
      createdById: user.id,
    });
    expect(ticket.id).toMatch(/^tkt_/);
  });

  it("rejects a missing title and does not write a row", async () => {
    const user = await createUser({
      id: "usr_invalid",
      role: "USER",
      email: "invalid@example.com",
    });

    await expect(
      createTicket(user, { title: "   ", description: "Details" }),
    ).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Title is required.",
    });
    expect(await prisma.ticket.count()).toBe(0);
  });

  it("shows a user only their tickets and an agent every ticket", async () => {
    const user = await createUser({
      id: "usr_list",
      role: "USER",
      email: "list@example.com",
    });
    const agent = await createUser({
      id: "usr_list_agent",
      role: "AGENT",
      email: "list-agent@example.com",
    });

    await createTicket(user, { title: "Mine", description: "Owned by the user." });
    await createTicket(agent, {
      title: "Agent ticket",
      description: "Owned by the agent.",
    });

    const own = await listTickets(user);
    const all = await listTickets(agent);

    expect(own.map((ticket) => ticket.title)).toEqual(["Mine"]);
    expect(all.map((ticket) => ticket.title).sort()).toEqual(["Agent ticket", "Mine"]);
  });

  it("marks an open ticket resolved", async () => {
    const user = await createUser({
      id: "usr_resolve",
      role: "USER",
      email: "resolve@example.com",
    });
    const ticket = await createTicket(user, {
      title: "VPN drop",
      description: "It disconnects.",
    });

    const resolved = await resolveTicket(user, ticket.id);

    expect(resolved.status).toBe("RESOLVED");
    expect((await prisma.ticket.findUnique({ where: { id: ticket.id } }))?.status).toBe(
      "RESOLVED",
    );
  });

  it("deletes a ticket", async () => {
    const user = await createUser({
      id: "usr_delete",
      role: "USER",
      email: "delete@example.com",
    });
    const ticket = await createTicket(user, {
      title: "Old request",
      description: "No longer needed.",
    });

    await deleteTicket(user, ticket.id);

    expect(await prisma.ticket.findUnique({ where: { id: ticket.id } })).toBeNull();
  });
});
