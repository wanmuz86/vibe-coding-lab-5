import { describe, expect, it } from "vitest";
import { ticketRepository } from "@/server/tickets/ticket.repository";
import { createUser } from "./helpers";

describe("ticket repository", () => {
  it("persists a ticket and reads it back", async () => {
    const user = await createUser({
      id: "usr_repo",
      role: "USER",
      email: "repo@example.com",
    });

    const created = await ticketRepository.create({
      id: "tkt_repo_1",
      title: "Badge not working",
      description: "The side door will not open.",
      createdById: user.id,
    });

    const found = await ticketRepository.findById(created.id);

    expect(found).toMatchObject({
      id: "tkt_repo_1",
      title: "Badge not working",
      description: "The side door will not open.",
      status: "OPEN",
      createdById: user.id,
    });
    expect(found?.createdAt).toBeInstanceOf(Date);
    expect(found?.updatedAt).toBeInstanceOf(Date);
  });
});
