"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/components/format-date";
import { ApiError, api } from "@/lib/client/api";
import type { TicketResponse } from "@/server/tickets/ticket.contract";

type TicketDetailProps = {
  id: string;
};

export function TicketDetail({ id }: TicketDetailProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<{ ticket: TicketResponse }>(`/api/tickets/${id}`)
      .then((data) => {
        if (!cancelled) {
          setTicket(data.ticket);
        }
      })
      .catch((caught) => {
        if (cancelled) {
          return;
        }
        if (caught instanceof ApiError && caught.status === 401) {
          router.push("/login");
          return;
        }
        setError(
          caught instanceof Error ? caught.message : "Could not load the ticket.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function resolve() {
    setPending(true);
    setError(null);
    try {
      const data = await api<{ ticket: TicketResponse }>(`/api/tickets/${id}/resolve`, {
        method: "POST",
      });
      setTicket(data.ticket);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not resolve the ticket.",
      );
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    setPending(true);
    setError(null);
    try {
      await api(`/api/tickets/${id}`, { method: "DELETE" });
      router.push("/tickets");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not delete the ticket.",
      );
      setPending(false);
    }
  }

  if (error && !ticket) {
    return (
      <main className="page stack">
        <p className="form-error">{error}</p>
        <Link href="/tickets">Back to tickets</Link>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="page">
        <p className="muted">Loading ticket...</p>
      </main>
    );
  }

  return (
    <main className="page stack">
      <Link href="/tickets">Back to tickets</Link>
      <article className="card stack">
        <div className="detail-heading">
          <div>
            <p className="ticket-id">{ticket.id}</p>
            <h1>{ticket.title}</h1>
          </div>
          <span className={`badge badge-${ticket.status.toLowerCase()}`}>
            {ticket.status}
          </span>
        </div>
        <p className="description">{ticket.description}</p>
        <dl className="meta">
          <div>
            <dt>Created</dt>
            <dd>
              <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
            </dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>
              <time dateTime={ticket.updatedAt}>{formatDate(ticket.updatedAt)}</time>
            </dd>
          </div>
          <div>
            <dt>Created by</dt>
            <dd>{ticket.createdById}</dd>
          </div>
        </dl>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="actions">
          {ticket.status === "OPEN" ? (
            <button
              type="button"
              className="button"
              onClick={resolve}
              disabled={pending}
            >
              Mark resolved
            </button>
          ) : (
            <p className="muted">This ticket is resolved.</p>
          )}
          {confirmingDelete ? (
            <>
              <button
                type="button"
                className="button button-danger"
                onClick={remove}
                disabled={pending}
              >
                Confirm delete
              </button>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setConfirmingDelete(false)}
                disabled={pending}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="button button-danger"
              onClick={() => setConfirmingDelete(true)}
              disabled={pending}
            >
              Delete ticket
            </button>
          )}
        </div>
      </article>
    </main>
  );
}
