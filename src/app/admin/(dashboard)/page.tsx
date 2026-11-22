import Link from "next/link";
import { listStoredEvents } from "@/lib/events-store";
import { listStoredGalleryImages } from "@/lib/gallery-store";
import { loadWorshipManifest } from "@/lib/worship-manifest";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  const events = listStoredEvents();
  const gallery = listStoredGalleryImages();
  const worship = loadWorshipManifest();
  const publishedEvents = events.filter((e) => e.published).length;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.startDate >= today).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal">Parish admin</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal/55">
          Manage events, gallery photos, and worship display decks from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Events", value: events.length },
          { label: "Upcoming", value: upcoming },
          { label: "Gallery", value: gallery.length },
          { label: "Worship decks", value: worship.sources?.length ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="admin-card p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">{stat.label}</p>
            <p className="mt-2 font-display text-4xl text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="admin-card flex flex-col gap-3 p-6">
          <p className="font-display text-xl text-charcoal">Events</p>
          <p className="text-sm text-charcoal/50">{publishedEvents} published on the site</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            <Link
              href="/admin/events/new"
              className="rounded-[2px] bg-gradient-to-r from-[#8b6914] via-gold to-amber px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal"
            >
              New event
            </Link>
            <Link
              href="/admin/events"
              className="rounded-[2px] border border-gold/35 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal/70"
            >
              Manage
            </Link>
          </div>
        </div>

        <div className="admin-card flex flex-col gap-3 p-6">
          <p className="font-display text-xl text-charcoal">Gallery</p>
          <p className="text-sm text-charcoal/50">Upload and publish parish photos</p>
          <div className="mt-auto pt-2">
            <Link
              href="/admin/gallery"
              className="inline-flex rounded-[2px] border border-gold/35 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal/70"
            >
              Manage gallery
            </Link>
          </div>
        </div>

        <div className="admin-card flex flex-col gap-3 p-6">
          <p className="font-display text-xl text-charcoal">Worship</p>
          <p className="text-sm text-charcoal/50">
            {worship.slides.length} slides · upload PDF/PPT for the TV
          </p>
          <div className="mt-auto pt-2">
            <Link
              href="/admin/worship"
              className="inline-flex rounded-[2px] border border-gold/35 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal/70"
            >
              Manage worship
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
