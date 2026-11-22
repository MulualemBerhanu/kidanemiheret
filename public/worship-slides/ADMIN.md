# Worship Display — Admin Guide

Two surfaces on the same site:

| Surface | URL | Who |
|---------|-----|-----|
| **TV / projector** | `/worship-screen/present/[sourceId]` | Hall display — bookmark this |
| **Operator console** | `/worship-screen` | Laptop — upload, sync, pick decks |
| **Website bylaws** | About page | Members — **Download PDF** to read |

Do **not** use the worship screen for everyday bylaws reading. Use **Present on screen** only when projecting in the hall.

---

## TV quick start

1. Open Chrome (or Edge) on the TV / computer attached to the projector
2. Go to a present URL, for example:
   - `/worship-screen/present/bylaws-english`
   - `/worship-screen/present/bylaws-amharic`
3. Bookmark that URL
4. Press **F** or use the browser’s fullscreen (F11)
5. **→** / **Space** = next page · **←** = previous · **Esc** shows controls briefly

No native TV app is required.

---

## Operator console (laptop)

1. Open `/worship-screen`
2. Enter the worship admin password when prompted (server env: `WORSHIP_ADMIN_SECRET`)
3. Upload PDF / PPT / PPTX, or pick a deck and click **Present**
4. Use **TV link** next to a deck to copy/open the clean present URL for the hall screen

---

## Bylaws on the website

- **Download PDF** — reading and sharing (`/documents/...`)
- **Present on screen** — opens the TV present URL in a new tab for meetings

---

## Supported file types

| Format | Notes |
|--------|--------|
| **PDF** | Live page rendering (documents like bylaws) |
| **PPT / PPTX** | Converted to slides for presentation mode |

---

## Folder structure

```
public/worship-slides/
├── manifest.json
├── slide-001.webp         ← example slides
├── uploads/               ← original PDF / PPT / PPTX
│   ├── bylaws-amharic.pdf
│   └── bylaws-english.pdf
└── ADMIN.md
```

CLI (optional):

```bash
npm run worship:convert -- "uploads/your-file.pdf" --replace
npm run worship:convert -- "uploads/your-slides.pptx" --replace
```

PowerPoint needs LibreOffice, or export as PDF first:

```bash
export LIBREOFFICE_PATH="/Applications/LibreOffice.app/Contents/MacOS/soffice"
```

---

## Troubleshooting

- **Unauthorized / 401** on upload/sync — set `WORSHIP_ADMIN_SECRET` and enter it on the console
- **TV shows operator chrome** — use `/worship-screen/present/...`, not `/worship-screen`
- **PowerPoint fails** — install LibreOffice or upload a PDF instead
