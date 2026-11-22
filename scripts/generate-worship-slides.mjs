/**
 * Generates placeholder worship slide images for the TV/projector display.
 * Replace with real slides exported from PDF/PPT — see public/worship-slides/ADMIN.md
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slidesDir = path.join(__dirname, "../public/worship-slides");
const uploadsDir = path.join(slidesDir, "uploads");

const W = 1920;
const H = 1080;

const slides = [
  {
    file: "slide-001.webp",
    label: "ክዳነመሀረት",
    sub: "Opening Prayer",
    geEz: "ጸሎት",
  },
  {
    file: "slide-002.webp",
    label: "መዝሙር",
    sub: "Hymn / Mezmur",
    geEz: "♪",
  },
  {
    file: "slide-003.webp",
    label: "ቅዱስ ቁርባን",
    sub: "Divine Liturgy",
    geEz: "ቅዳሴ",
  },
];

function slideSvg(label, sub, geEz) {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#000000"/>
    <defs>
      <radialGradient id="g" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="rgba(212,175,55,0.12)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="42%" text-anchor="middle" font-family="Georgia, serif" font-size="72" fill="#d4af37" opacity="0.9">${geEz}</text>
    <text x="50%" y="52%" text-anchor="middle" font-family="Georgia, serif" font-size="96" fill="#f7f4ef">${label}</text>
    <text x="50%" y="62%" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="#c9a227" opacity="0.7">${sub}</text>
    <rect x="760" y="920" width="400" height="2" fill="#d4af37" opacity="0.4"/>
    <text x="50%" y="960" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#666" opacity="0.5">Kidanemeheret — Worship Display</text>
  </svg>`;
}

fs.mkdirSync(slidesDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

for (const s of slides) {
  const out = path.join(slidesDir, s.file);
  await sharp(Buffer.from(slideSvg(s.label, s.sub, s.geEz)))
    .resize(W, H, { fit: "cover" })
    .webp({ quality: 90 })
    .toFile(out);
  console.log("Wrote", s.file);
}

const manifest = {
  version: 1,
  updatedAt: new Date().toISOString().slice(0, 10),
  settings: {
    showCounter: true,
    autoPlay: {
      enabled: false,
      intervalSeconds: 10,
    },
    controlsHideDelayMs: 3500,
  },
  slides: slides.map((s, i) => ({
    id: s.file.replace(".webp", ""),
    file: s.file,
    title: s.sub,
    titleAm: s.label,
    order: i + 1,
  })),
  sources: [
    {
      id: "example-set",
      note: "Placeholder slides — replace after converting PDF/PPT",
      originalFile: null,
      convertedAt: new Date().toISOString().slice(0, 10),
      slideIds: slides.map((s) => s.file.replace(".webp", "")),
    },
  ],
};

fs.writeFileSync(
  path.join(slidesDir, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);
console.log("Wrote manifest.json");
