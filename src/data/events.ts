/** Localized string pair for admin-managed content */
export type LocalizedText = {
  en: string;
  am: string;
};

/** Stored event record (admin + JSON file) */
export interface StoredEvent {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  location: LocalizedText;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  dtStart: string;
  dtEnd?: string;
  timezone: string;
  categories: string[];
  flyerImage?: string;
  published: boolean;
  updatedAt: string;
}

/** Public site event shape (locale already resolved) */
export interface ChurchEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: string;
  locationUrl?: string;
  flyerImage?: string;
  dtStart: string;
  dtEnd?: string;
  timezone?: string;
  categories?: string[];
}

export interface EventsFile {
  version: 1;
  updatedAt: string;
  events: StoredEvent[];
}
