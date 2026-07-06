import { ImageProvider } from './ImageProvider.js';
import { LANDMARK_TITLES } from '../data/landmarks.js';

/**
 * Fetches landmark photos + coordinates from Wikipedia's public API.
 * No API key required, CORS-enabled (origin=*). Titles are hand-picked
 * for pages that reliably have both a page image and coordinates, so
 * this provider is the "always works" safety net for the game.
 */
export class LandmarkProvider extends ImageProvider {
  constructor({ thumbSize = 1600 } = {}) {
    super();
    this.thumbSize = thumbSize;
    this.name = 'wikipedia-landmark';
  }

  async getLocations(count, { exclude = new Set() } = {}) {
    const pool = LANDMARK_TITLES.filter((t) => !exclude.has(t));
    const picks = shuffle(pool).slice(0, count);
    if (picks.length === 0) return [];

    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      titles: picks.join('|'),
      prop: 'pageimages|coordinates',
      pithumbsize: String(this.thumbSize),
      format: 'json',
      origin: '*',
    }).toString();

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Wikipedia API error ${res.status}`);
    const data = await res.json();
    const pages = Object.values(data?.query?.pages ?? {});

    return pages
      .filter((p) => p.thumbnail?.source && p.coordinates?.[0])
      .map((p) => ({
        id: `landmark-${p.pageid}`,
        imageUrl: p.thumbnail.source,
        lat: p.coordinates[0].lat,
        lng: p.coordinates[0].lon,
        attribution: `${p.title.replace(/_/g, ' ')} · Wikipedia`,
        source: this.name,
        excludeKey: p.title,
      }));
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
