/**
 * Generates placeholder JPG assets under public/images/editorial/
 * Replace with real photography — see public/images/ASSETS.md
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../public/images");
const editorial = path.join(root, "editorial");

function svg(w, h, label, dark = true) {
  const bg = dark ? "#0d0d0d" : "#f8f5f0";
  const text = dark ? "#c9a227" : "#8b6914";
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bg}"/>
    <defs>
      <radialGradient id="g" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="rgba(201,162,39,0.2)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" font-family="Georgia" font-size="${Math.min(w, h) / 14}" fill="${text}" opacity="0.5">${label}</text>
  </svg>`;
}

async function writeJpg(out, w, h, label, dark = true) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg(w, h, label, dark)))
    .jpeg({ quality: 85 })
    .toFile(out);
  console.log("Wrote", path.relative(root, out));
}

const editorialAssets = [
  { name: "hero.jpg", w: 2400, h: 1600, label: "Hero" },
  { name: "welcome.jpg", w: 900, h: 1125, label: "Welcome" },
  { name: "live-worship.jpg", w: 1200, h: 675, label: "Live Worship" },
  { name: "give.jpg", w: 1920, h: 1080, label: "Give" },
  { name: "contact.jpg", w: 1200, h: 750, label: "Contact" },
  { name: "about.jpg", w: 1200, h: 900, label: "About" },
  { name: "page-about.jpg", w: 1920, h: 720, label: "About Page" },
  { name: "page-ministries.jpg", w: 1920, h: 720, label: "Ministries Page" },
  { name: "page-events.jpg", w: 1920, h: 720, label: "Events Page" },
  { name: "page-media.jpg", w: 1920, h: 720, label: "Media Page" },
  { name: "page-gallery.jpg", w: 1920, h: 720, label: "Gallery Page" },
  { name: "page-give.jpg", w: 1920, h: 720, label: "Give Page" },
  { name: "page-contact.jpg", w: 1920, h: 720, label: "Contact Page" },
  ...["sunday-school", "choir", "youth", "prayer", "outreach", "women", "men"].map((id) => ({
    name: `ministries/${id}.jpg`,
    w: 1200,
    h: 750,
    label: id.replace("-", " "),
  })),
  ...["meskel", "timket", "youth-retreat", "community-meal"].map((id) => ({
    name: `events/${id}.jpg`,
    w: 1200,
    h: 675,
    label: id.replace("-", " "),
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    name: `gallery/${i + 1}.jpg`,
    w: 800 + (i % 3) * 200,
    h: 900 + (i % 2) * 200,
    label: `Gallery ${i + 1}`,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    name: `media/sermon-${i + 1}.jpg`,
    w: 1280,
    h: 720,
    label: `Sermon ${i + 1}`,
  })),
];

for (const a of editorialAssets) {
  await writeJpg(path.join(editorial, a.name), a.w, a.h, a.label);
}

await writeJpg(path.join(root, "sequence-fallback.jpg"), 1920, 640, "Sacred Sequence");

console.log("Editorial placeholder images ready.");
