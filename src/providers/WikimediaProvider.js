import { ImageProvider } from './ImageProvider.js';
import { randomSeedRegion } from '../data/seedRegions.js';

const BAD_FILENAME_PATTERN =
  /\.(svg|pdf|ogv|webm|gif)$|logo|flag[_ ]of|coat[_ ]of[_ ]arms|icon|map[_ ]of|locator|emblem/i;

/**
 * Samples real geotagged photographs from Wikimedia Commons. This is a
 * genuinely large, constantly-growing pool (millions of geotagged files)
 * rather than a hand-curated list, which is what the brief asks for.
 * No API key needed — Commons' API is open and CORS-enabled.
 *
 * Strategy: pick a random seed region (see data/seedRegions.js) so we
 * land near places that actually have photo coverage, then geosearch a
 * radius around it and filter out maps/flags/logos/icons.
 */
export class WikimediaProvider extends ImageProvider {
  constructor({ radiusMeters = 15000, thumbWidth = 1600 } = {}) {
    super();
    this.radiusMeters = radiusMeters;
    this.thumbWidth = thumbWidth;
    this.name = 'wikimedia-commons';
  }

  async getLocations(count, { exclude = new Set() } = {}) {
    const results = [];
    const seenTitles = new Set(exclude);
    let attempts = 0;

    // Each seed region only yields a handful of usable images, so keep
    // sampling new seeds until we have enough or give up gracefully.
    while (results.length < count && attempts < count * 4) {
      attempts += 1;
      const seed = randomSeedRegion();
      try {
        // eslint-disable-next-line no-await-in-loop
        const batch = await this._fetchNear(seed, seenTitles);
        for (const item of batch) {
          if (results.length >= count) break;
          if (seenTitles.has(item.excludeKey)) continue;
          seenTitles.add(item.excludeKey);
          results.push(item);
        }
      } catch {
        // A single seed failing shouldn't break the whole batch; the
        // caller (MultiProvider) pads any shortfall from another source.
      }
    }

    return results;
  }

  async _fetchNear(seed, seenTitles) {
    const url = new URL('https://commons.wikimedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      generator: 'geosearch',
      ggscoord: `${seed.lat}|${seed.lng}`,
      ggsradius: String(this.radiusMeters),
      ggslimit: '30',
      ggsnamespace: '6',
      prop: 'imageinfo|coordinates',
      iiprop: 'url|mime',
      iiurlwidth: String(this.thumbWidth),
      format: 'json',
      origin: '*',
    }).toString();

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Commons API error ${res.status}`);
    const data = await res.json();
    const pages = Object.values(data?.query?.pages ?? {});

    return pages
      .filter((p) => {
        const info = p.imageinfo?.[0];
        const coord = p.coordinates?.[0];
        if (!info || !coord) return false;
        if (seenTitles.has(p.title)) return false;
        if (BAD_FILENAME_PATTERN.test(p.title)) return false;
        if (info.mime && !/^image\/(jpeg|png)$/.test(info.mime)) return false;
        return true;
      })
      .map((p) => {
        const info = p.imageinfo[0];
        const coord = p.coordinates[0];
        return {
          id: `wm-${p.pageid}`,
          imageUrl: info.thumburl || info.url,
          lat: coord.lat,
          lng: coord.lon,
          attribution: 'Wikimedia Commons',
          source: this.name,
          excludeKey: p.title,
        };
      });
  }
}
