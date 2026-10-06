"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TicketForm } from "@/components/TicketForm";
import { TicketList } from "@/components/TicketList";
import { ApiError, api } from "@/lib/client/api";
import type { TicketResponse } from "@/server/tickets/ticket.contract";

export function TicketWorkspace() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<{ tickets: TicketResponse[] }>("/api/tickets")
      .then((data) => {
        if (!cancelled) {
          setTickets(data.tickets);
        }
      })
      .catch((caught) => {
        if (cancelled) {
          return;
        }
        if (caught instanceof ApiError && caught.status === 401) {
          setRedirecting(true);
          router.push("/login");
          return;
        }
        setError(caught instanceof Error ? caught.message : "Could not load tickets.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="page stack">
      <div>
        <h1>Tickets</h1>
        <p className="muted">Create a ticket, then open it to resolve or delete it.</p>
      </div>
      <TicketForm
        onCreated={(ticket) => {
          setTickets((current) => [ticket, ...current]);
        }}
      />
      <section className="stack">
        <h2>All visible tickets</h2>
        {loading ? <p className="muted">Loading tickets...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {!loading && !error && !redirecting ? <TicketList tickets={tickets} /> : null}
      </section>
    </main>
  );
}
