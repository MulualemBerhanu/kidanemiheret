import "server-only";
import fs from "fs";
import path from "path";
import type { ChurchEvent, EventsFile, LocalizedText, StoredEvent } from "@/data/events";

const EVENTS_FILE = path.join(process.cwd(), "data", "events.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "events", "uploads");

function emptyFile(): EventsFile {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    events: [],
  };
}

export function getEventsFilePath() {
  return EVENTS_FILE;
}

export function getEventUploadDir() {
  return UPLOAD_DIR;
}

export function readEventsFile(): EventsFile {
  try {
    if (!fs.existsSync(EVENTS_FILE)) return emptyFile();
    const raw = fs.readFileSync(EVENTS_FILE, "utf8");
    const parsed = JSON.parse(raw) as EventsFile;
    if (!parsed?.events || !Array.isArray(parsed.events)) return emptyFile();
    return parsed;
  } catch {
    return emptyFile();
  }
}

export function writeEventsFile(file: EventsFile) {
  const dir = path.dirname(EVENTS_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const next: EventsFile = {
    ...file,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export function listStoredEvents(): StoredEvent[] {
  return [...readEventsFile().events].sort((a, b) =>
    a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0
  );
}

export function getStoredEvent(id: string): StoredEvent | undefined {
  return readEventsFile().events.find((e) => e.id === id);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function createEventId(titleEn: string, startDate: string) {
  const base = slugify(titleEn) || "event";
  const datePart = startDate.replace(/-/g, "").slice(0, 8);
  let id = `${base}-${datePart}`;
  const existing = new Set(readEventsFile().events.map((e) => e.id));
  let n = 2;
  while (existing.has(id)) {
    id = `${base}-${datePart}-${n}`;
    n += 1;
  }
  return id;
}

export function upsertStoredEvent(event: StoredEvent) {
  const file = readEventsFile();
  const idx = file.events.findIndex((e) => e.id === event.id);
  if (idx >= 0) file.events[idx] = event;
  else file.events.push(event);
  writeEventsFile(file);
  return event;
}

export function deleteStoredEvent(id: string) {
  const file = readEventsFile();
  const next = file.events.filter((e) => e.id !== id);
  if (next.length === file.events.length) return false;
  writeEventsFile({ ...file, events: next });
  return true;
}

function pickLocale(text: LocalizedText, locale: string) {
  if (locale === "am" && text.am?.trim()) return text.am;
  return text.en || text.am || "";
}

export function toChurchEvent(event: StoredEvent, locale: string): ChurchEvent {
  return {
    id: event.id,
    title: pickLocale(event.title, locale),
    description: pickLocale(event.description, locale) || undefined,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    location: pickLocale(event.location, locale),
    flyerImage: event.flyerImage,
    dtStart: event.dtStart,
    dtEnd: event.dtEnd,
    timezone: event.timezone,
    categories: event.categories,
  };
}

export function getPublishedChurchEvents(locale: string): ChurchEvent[] {
  return listStoredEvents()
    .filter((e) => e.published)
    .map((e) => toChurchEvent(e, locale))
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
}

export function buildDt(date: string, timeHint?: string) {
  // Prefer ISO date + optional HH:MM if provided as 24h; else noon placeholder.
  const match = timeHint?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return `${date}T12:00:00`;
  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return `${date}T${String(hour).padStart(2, "0")}:${minute}:00`;
}
