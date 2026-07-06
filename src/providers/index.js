import { WikimediaProvider } from './WikimediaProvider.js';
import { LandmarkProvider } from './LandmarkProvider.js';
import { MapillaryProvider } from './MapillaryProvider.js';
import { MultiProvider } from './MultiProvider.js';

/**
 * This is the ONE place to reconfigure where round images come from.
 * The rest of the app only ever calls provider.getLocations(count) —
 * swap, reorder, add, or remove sources here and nothing else changes.
 *
 * Order matters: MultiProvider tries each in sequence and only asks
 * the next one for whatever shortfall remains, so put your preferred /
 * highest-quality source first.
 *
 * To enable Mapillary (true street-level, non-pannable stills), get a
 * free client token at https://www.mapillary.com/dashboard/developers
 * and uncomment the block below.
 */
export function buildDefaultProvider({ mapillaryToken } = {}) {
  const providers = [
    new WikimediaProvider(), // large, live, free — no key needed
  ];

  if (mapillaryToken) {
    providers.unshift(new MapillaryProvider({ accessToken: mapillaryToken }));
  }

  // Always keep this last: hand-picked landmarks that are essentially
  // guaranteed to load, so a game session never comes up short.
  providers.push(new LandmarkProvider());

  return new MultiProvider(providers);
}

export { ImageProvider } from './ImageProvider.js';
export { WikimediaProvider } from './WikimediaProvider.js';
export { LandmarkProvider } from './LandmarkProvider.js';
export { MapillaryProvider } from './MapillaryProvider.js';
export { MultiProvider } from './MultiProvider.js';
