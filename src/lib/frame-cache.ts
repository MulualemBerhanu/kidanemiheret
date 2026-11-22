/** Shared in-memory cache — multiple strips reuse the same decoded frames */
const cache = new Map<string, HTMLImageElement>();
const loading = new Map<string, Promise<HTMLImageElement>>();

export function loadCachedFrame(src: string): Promise<HTMLImageElement> {
  const cached = cache.get(src);
  if (cached?.complete && cached.naturalWidth) {
    return Promise.resolve(cached);
  }

  const inFlight = loading.get(src);
  if (inFlight) return inFlight;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      cache.set(src, img);
      loading.delete(src);
      resolve(img);
    };
    img.onerror = () => {
      loading.delete(src);
      reject(new Error(`Failed to load frame: ${src}`));
    };
    img.src = src;
  });

  loading.set(src, promise);
  return promise;
}

/** Warm priority frames once on first strip mount */
export function preloadFrames(sources: string[]): void {
  sources.forEach((src) => {
    loadCachedFrame(src).catch(() => {});
  });
}
