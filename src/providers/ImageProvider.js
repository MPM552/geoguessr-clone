/**
 * ImageProvider is the contract every image source must implement.
 * The game only ever talks to this shape, so swapping Mapillary for
 * Wikimedia, a static pool, or a brand-new API later means writing
 * one new class — nothing in the game logic or UI changes.
 *
 * A "Location" object looks like:
 * {
 *   id: string,            // unique key, used for React lists + preloading cache
 *   imageUrl: string,      // direct URL to a viewable image
 *   lat: number,
 *   lng: number,
 *   attribution?: string,  // optional credit line shown small in a corner
 *   source: string,        // provider name, useful for debugging/mixed pools
 * }
 */
export class ImageProvider {
  /**
   * @param {number} count how many unique locations to return
   * @returns {Promise<Array<Location>>}
   */
  // eslint-disable-next-line no-unused-vars
  async getLocations(count) {
    throw new Error('getLocations() must be implemented by subclass');
  }
}
