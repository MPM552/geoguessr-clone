// A tiny cache so an image already decoded once (e.g. preloaded during
// the previous round) is instant when the <img> tag actually needs it.
const cache = new Map();

export function preloadImage(url) {
  if (!url || cache.has(url)) return cache.get(url) ?? Promise.resolve();
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
  cache.set(url, promise);
  return promise;
}

export function isPreloaded(url) {
  return cache.has(url);
}
