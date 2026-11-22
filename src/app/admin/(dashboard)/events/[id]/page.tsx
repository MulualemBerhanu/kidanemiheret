import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { getStoredEvent } from "@/lib/events-store";

export const dynamic = "force-dynamic";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = getStoredEvent(id);
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Events</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal">Edit event</h1>
        <p className="mt-2 text-sm text-charcoal/55">{event.title.en}</p>
      </div>
      <EventForm initial={event} />
    </div>
  );
}
