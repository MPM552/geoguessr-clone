import { ImageProvider } from './ImageProvider.js';

/**
 * Combines several ImageProviders into one. Tries each provider in order
 * ("priority" providers first, e.g. live Wikimedia/Mapillary), and pads
 * any shortfall from the next one down the list — so the game always
 * gets a full round set even if a live API is slow, rate-limited, or
 * offline. This is the piece that makes "use multiple services in
 * conjunction" possible without the game logic knowing about any of them.
 */
export class MultiProvider extends ImageProvider {
  constructor(providers) {
    super();
    if (!providers?.length) throw new Error('MultiProvider needs at least one provider');
    this.providers = providers;
    this.name = 'multi';
  }

  async getLocations(count) {
    const exclude = new Set();
    const results = [];

    for (const provider of this.providers) {
      if (results.length >= count) break;
      const needed = count - results.length;
      try {
        // eslint-disable-next-line no-await-in-loop
        const batch = await provider.getLocations(needed, { exclude });
        for (const item of batch) {
          if (results.length >= count) break;
          results.push(item);
          if (item.excludeKey) exclude.add(item.excludeKey);
        }
      } catch {
        // fall through to the next provider in the chain
      }
    }

    return results;
  }
}
