import { ImageProvider } from './ImageProvider.js';
import { randomSeedRegion } from '../data/seedRegions.js';

/**
 * True street-level imagery via Mapillary's Graph API. Requires a free
 * client access token from https://www.mapillary.com/dashboard/developers
 * Not enabled by default since it needs a secret; wire it up by passing
 * a token into buildProviderPool() in providers/index.js.
 */
export class MapillaryProvider extends ImageProvider {
  constructor({ accessToken, boxSizeDegrees = 0.08 }) {
    super();
    if (!accessToken) throw new Error('MapillaryProvider requires an accessToken');
    this.accessToken = accessToken;
    this.boxSizeDegrees = boxSizeDegrees;
    this.name = 'mapillary';
  }

  async getLocations(count, { exclude = new Set() } = {}) {
    const results = [];
    let attempts = 0;

    while (results.length < count && attempts < count * 4) {
      attempts += 1;
      const seed = randomSeedRegion();
      const half = this.boxSizeDegrees / 2;
      const bbox = [
        seed.lng - half,
        seed.lat - half,
        seed.lng + half,
        seed.lat + half,
      ].join(',');

      const url = new URL('https://graph.mapillary.com/images');
      url.search = new URLSearchParams({
        access_token: this.accessToken,
        fields: 'id,thumb_2048_url,computed_geometry',
        bbox,
        limit: '20',
      }).toString();

      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(url.toString());
        if (!res.ok) continue;
        // eslint-disable-next-line no-await-in-loop
        const data = await res.json();
        for (const item of data?.data ?? []) {
          if (results.length >= count) break;
          const coords = item.computed_geometry?.coordinates;
          if (!coords || exclude.has(item.id)) continue;
          results.push({
            id: `mly-${item.id}`,
            imageUrl: item.thumb_2048_url,
            lat: coords[1],
            lng: coords[0],
            attribution: 'Mapillary',
            source: this.name,
            excludeKey: item.id,
          });
        }
      } catch {
        // try the next seed
      }
    }

    return results;
  }
}
