"use client";

import { FormEvent, useState } from "react";
import { ApiError, api } from "@/lib/client/api";
import type { TicketResponse } from "@/server/tickets/ticket.contract";

type TicketFormProps = {
  onCreated: (ticket: TicketResponse) => void;
};

export function TicketForm({ onCreated }: TicketFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const data = await api<{ ticket: TicketResponse }>("/api/tickets", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      onCreated(data.ticket);
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Could not create the ticket.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h2>New ticket</h2>
      <label>
        Title
        <input
          name="title"
          value={title}
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={description}
          maxLength={5000}
          rows={4}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Creating..." : "Create ticket"}
      </button>
    </form>
  );
}
