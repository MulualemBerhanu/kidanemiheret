import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Events</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal">New event</h1>
        <p className="mt-2 text-sm text-charcoal/55">
          Add title, date, place, and upload a banner for the Events page.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
