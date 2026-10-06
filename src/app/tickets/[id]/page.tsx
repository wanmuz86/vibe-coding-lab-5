import { TicketDetail } from "@/components/TicketDetail";

export default async function TicketDetailPage({ params }: PageProps<"/tickets/[id]">) {
  const { id } = await params;
  return <TicketDetail id={id} />;
}
