# Kidanemeheret Ethiopian Orthodox Church

Premium cinematic Next.js website — sacred, modern, and Vercel-ready.

## Stack

- Next.js App Router · TypeScript · Tailwind CSS v4
- Framer Motion · GSAP ScrollTrigger · Lenis smooth scroll
- React Three Fiber (hero accent only)
- Canvas scroll image sequence (`ScrollImageSequence`)

## Getting started

```bash
npm install
npm run assets    # generate placeholder images + sequence frames
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scroll image sequence

Place frames in `public/sequence/`:

```
frame-0001.webp
frame-0002.webp
…
frame-0021.webp
```

To add more frames, add files and update `frameCount` in `SacredInstrumentDivider.tsx` (or pass a new count to `ScrollImageSequence`).

Pattern default: `/sequence/frame-{frame}.webp`

Regenerate placeholders: `npm run assets`

## Deploy

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) — no extra configuration required.

## Customize

- Church info: `src/data/site.ts`
- Ministries, events, gallery: `src/data/`
- Colors & fonts: `src/app/globals.css`, `src/app/layout.tsx`
