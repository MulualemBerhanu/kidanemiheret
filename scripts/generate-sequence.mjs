/**
 * Generates placeholder WebP frames for /public/sequence/.
 * Replace these with your real Begena → Kebero → Tsinatsel → Meskel → branding sequence.
 * Run: node scripts/generate-sequence.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/sequence");
const FRAME_COUNT = 21;
const W = 1920;
const H = 640;

const labels = [
  "Begena",
  "Begena",
  "Kebero",
  "Kebero",
  "Kebero",
  "Tsinatsel",
  "Tsinatsel",
  "Tsinatsel",
  "Instruments",
  "Instruments",
  "Meskel Cross",
  "Meskel Cross",
  "Meskel Cross",
  "Sacred Light",
  "Sacred Light",
  "Incense",
  "Incense",
  "Heritage",
  "Heritage",
  "Kidanemeheret",
  "Kidanemeheret",
];

fs.mkdirSync(outDir, { recursive: true });

function svgFrame(i, label) {
  const t = i / (FRAME_COUNT - 1);
  const gold = Math.round(180 + t * 40);
  const bronze = Math.round(90 + t * 30);
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d0d0d"/>
      <stop offset="50%" style="stop-color:#1a1210"/>
      <stop offset="100%" style="stop-color:#2a1818"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgba(${gold},${gold - 40},80,0.35)"/>
      <stop offset="100%" style="stop-color:rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <ellipse cx="${W / 2}" cy="${H / 2}" rx="${120 + t * 80}" ry="${40 + t * 20}" fill="none" stroke="rgb(${bronze},${bronze - 20},60)" stroke-width="2" opacity="0.6"/>
  <path d="M ${W / 2} ${H * 0.25} L ${W / 2} ${H * 0.75} M ${W / 2 - 60 - t * 20} ${H * 0.4} L ${W / 2 + 60 + t * 20} ${H * 0.4} M ${W / 2 - 40} ${H * 0.55} L ${W / 2} ${H * 0.35} L ${W / 2 + 40} ${H * 0.55}" fill="none" stroke="rgb(${gold},${gold - 30},100)" stroke-width="${2 + t * 2}" opacity="${0.4 + t * 0.5}"/>
  ${i >= 18 ? `<text x="50%" y="58%" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="rgb(${gold},${gold - 20},120)" opacity="0.9">Kidanemeheret</text>` : ""}
  <text x="50%" y="78%" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="rgba(248,245,240,0.25)" letter-spacing="6">${label}</text>
</svg>`;
}

for (let i = 1; i <= FRAME_COUNT; i++) {
  const name = `frame-${String(i).padStart(4, "0")}.webp`;
  const svg = svgFrame(i - 1, labels[i - 1]);
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(path.join(outDir, name));
  console.log("Wrote", name);
}

console.log(`Done — ${FRAME_COUNT} frames in public/sequence/`);
