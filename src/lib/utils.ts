import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFrameIndex(index: number, pad = 4): string {
  return String(index).padStart(pad, "0");
}

/** Replace `{frame}` in pattern with zero-padded index, e.g. `/sequence/frame-{frame}.webp` */
export function resolveFramePath(
  pattern: string,
  index: number,
  pad = 4
): string {
  return pattern.replace("{frame}", formatFrameIndex(index, pad));
}
