"use client";

import Link from "next/link";
import { formatDate } from "@/components/format-date";
import type { TicketResponse } from "@/server/tickets/ticket.contract";

type TicketListProps = {
  tickets: TicketResponse[];
};

export function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return <p className="empty">No tickets yet.</p>;
  }

  return (
    <div className="ticket-list">
      <div className="ticket-row ticket-row-header">
        <span>ID</span>
        <span>Title</span>
        <span>Status</span>
        <span>Created</span>
      </div>
      {tickets.map((ticket) => (
        <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="ticket-row">
          <span className="ticket-id">{ticket.id}</span>
          <span className="ticket-title">{ticket.title}</span>
          <span className={`badge badge-${ticket.status.toLowerCase()}`}>
            {ticket.status}
          </span>
          <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
        </Link>
      ))}
    </div>
  );
}
