# Image & asset guide — Kidanemeheret

Replace placeholder files with your real photography. The site works with placeholders until you upload.

## Tier A — Cinematic scroll sequence (do not reuse elsewhere)

**Folder:** `public/sequence/`  
**Format:** PNG or WebP, **1920×540px** (or 1920×600), same color grade on all frames  
**Files:** `frame-0001.png` … `frame-0015.png` (add up to 60–90 later)

**Story order (recommended):** Begena → Kebero → Tsinatsel → Meskel cross → church name/branding

Used only in scroll canvas strips — not in cards or gallery.

---

## Tier B — Editorial photos (sections & pages)

**Folder:** `public/images/editorial/`

| File | Used for | Suggested shot |
|------|----------|----------------|
| `hero.jpg` | Homepage hero background | Wide sanctuary, incense, candlelight, 2400×1600+ |
| `welcome.jpg` | Welcome section | Congregation, warm fellowship |
| `give.jpg` | Give section background | Subtle, reverent |
| `contact.jpg` | Contact page / teaser | Church exterior or welcome desk |
| `about.jpg` | About page body | Clergy, community, or church history |
| `page-about.jpg` | About page hero banner | Wide cinematic still |
| `page-ministries.jpg` | Ministries page hero | Ministry in action |
| `page-events.jpg` | Events page hero | Feast or procession |
| `page-gallery.jpg` | Gallery page hero | Best single worship photo |
| `page-give.jpg` | Give page hero | Generous, sacred mood |
| `page-contact.jpg` | Contact page hero | Exterior or map area |

### Ministries (`public/images/editorial/ministries/`)

One photo per ministry — **1200×750px** (16:10):

`sunday-school.jpg`, `choir.jpg`, `youth.jpg`, `prayer.jpg`, `outreach.jpg`, `women.jpg`, `men.jpg`

### Events (`public/images/editorial/events/`)

`meskel.jpg`, `timket.jpg`, `youth-retreat.jpg`, `community-meal.jpg` — **1200×675px**

### Gallery (`public/images/editorial/gallery/`)

`1.jpg` … `15.jpg` — min **1200px** wide

---

## Tier C — Optional polish

- **Favicon:** `public/favicon.ico`
- **Open Graph:** `public/images/og.jpg` — 1200×630

---

## After uploading

1. Run `npm run dev` and hard-refresh (`Cmd+Shift+R`)
2. No code changes needed if filenames match this guide

## Regenerate placeholders

```bash
npm run assets
```
