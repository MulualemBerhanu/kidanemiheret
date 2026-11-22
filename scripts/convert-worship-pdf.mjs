/**
 * Convert a PDF from uploads/ into full-bleed worship slide images (1920×1080).
 *
 * Usage:
 *   npm run worship:convert -- "uploads/my-file.pdf"
 *   npm run worship:convert -- "uploads/my-file.pdf" --title "Sunday Prayer"
 *   npm run worship:convert -- "uploads/my-file.pdf" --replace
 */
import fs from "fs";
import path from "path";
import { convertUploadFile, isSupportedUpload, slidesDir } from "./worship-lib.mjs";

const args = process.argv.slice(2).filter((a) => a !== "--");
const titleFlag = args.indexOf("--title");
const replaceFlag = args.includes("--replace");
const customTitle = titleFlag >= 0 ? args[titleFlag + 1] : null;
const fileArg = args.find((a) => !a.startsWith("--") && a !== customTitle);

if (!fileArg) {
  console.error(`
Usage: npm run worship:convert -- "uploads/your-file.pdf" [--title "Name"] [--replace]

Supports: PDF, PPT, PPTX (PowerPoint needs LibreOffice installed)
`);
  process.exit(1);
}

const filePath = path.isAbsolute(fileArg)
  ? fileArg
  : path.join(slidesDir, fileArg.replace(/^uploads\//, "uploads/"));

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

if (!isSupportedUpload(filePath)) {
  console.error("Unsupported file type. Use PDF, PPT, or PPTX.");
  process.exit(1);
}

console.log(`Converting: ${path.basename(filePath)}`);

const result = await convertUploadFile(filePath, {
  replace: replaceFlag,
  title: customTitle,
});

console.log(`\nDone — ${result.slideCount} full-bleed slide(s).`);
console.log(`Open: http://localhost:3000/worship-screen`);
