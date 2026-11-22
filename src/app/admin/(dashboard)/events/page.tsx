import Image from "next/image";
import Link from "next/link";
import { listStoredEvents } from "@/lib/events-store";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  const events = listStoredEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Events</p>
          <h1 className="mt-2 font-display text-4xl text-charcoal">Manage events</h1>
          <p className="mt-2 text-sm text-charcoal/55">
            Banners, dates, and places for the public site.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-[2px] bg-gradient-to-r from-[#8b6914] via-gold to-amber px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal shadow-[0_2px_20px_rgba(212,175,55,0.25)] transition hover:brightness-110"
        >
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="admin-card px-5 py-14 text-center">
          <p className="text-sm text-charcoal/50">No events yet. Create the first one.</p>
          <Link
            href="/admin/events/new"
            className="mt-5 inline-flex text-[11px] uppercase tracking-[0.18em] text-gold hover:underline"
          >
            Add event →
          </Link>
        </div>
      ) : (
        <ul className="admin-card divide-y divide-gold/15 overflow-hidden">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/admin/events/${event.id}`}
                className="flex items-center gap-4 px-4 py-4 transition hover:bg-gold/[0.06] md:px-5"
              >
                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-[2px] border border-gold/20 bg-charcoal/5">
                  {event.flyerImage ? (
                    <Image
                      src={event.flyerImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-wider text-charcoal/30">
                      No banner
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xl text-charcoal">{event.title.en}</p>
                  <p className="mt-1 text-xs text-charcoal/50">
                    {event.startDate}
                    {event.endDate ? ` → ${event.endDate}` : ""}
                    {" · "}
                    {event.location.en || "No place set"}
                  </p>
                </div>
                <span
                  className={
                    event.published
                      ? "shrink-0 rounded-[2px] bg-gold/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#8b6914]"
                      : "shrink-0 rounded-[2px] bg-charcoal/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-charcoal/35"
                  }
                >
                  {event.published ? "Live" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
