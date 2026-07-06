// Broad geographic anchors spread across every inhabited continent.
// Pure random lat/lng mostly lands in ocean or empty terrain with no
// geotagged photos, so live providers (like Wikimedia) sample a radius
// around one of these instead. This is what gives round variety while
// keeping the hit-rate for "a real, usable photo" high.
export const SEED_REGIONS = [
  // Europe
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Barcelona, Spain', lat: 41.3874, lng: 2.1686 },
  { name: 'Prague, Czechia', lat: 50.0755, lng: 14.4378 },
  { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
  { name: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426 },
  { name: 'Edinburgh, Scotland', lat: 55.9533, lng: -3.1883 },
  { name: 'Krakow, Poland', lat: 50.0647, lng: 19.945 },
  { name: 'Santorini, Greece', lat: 36.3932, lng: 25.4615 },
  { name: 'Budapest, Hungary', lat: 47.4979, lng: 19.0402 },
  { name: 'Lofoten, Norway', lat: 68.1489, lng: 13.6094 },
  { name: 'Porto, Portugal', lat: 41.1579, lng: -8.6291 },
  // Africa
  { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
  { name: 'Marrakesh, Morocco', lat: 31.6295, lng: -7.9811 },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Zanzibar, Tanzania', lat: -6.1659, lng: 39.2026 },
  { name: 'Accra, Ghana', lat: 5.6037, lng: -0.187 },
  // Asia
  { name: 'Kyoto, Japan', lat: 35.0116, lng: 135.7681 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.978 },
  { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Hanoi, Vietnam', lat: 21.0278, lng: 105.8342 },
  { name: 'Jaipur, India', lat: 26.9124, lng: 75.7873 },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lng: 85.324 },
  { name: 'Bali, Indonesia', lat: -8.3405, lng: 115.092 },
  { name: 'Taipei, Taiwan', lat: 25.033, lng: 121.5654 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Tbilisi, Georgia', lat: 41.7151, lng: 44.8271 },
  { name: 'Ulaanbaatar, Mongolia', lat: 47.8864, lng: 106.9057 },
  // Oceania
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Queenstown, New Zealand', lat: -45.0312, lng: 168.6626 },
  { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631 },
  // North America
  { name: 'New York City, USA', lat: 40.7128, lng: -74.006 },
  { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 },
  { name: 'New Orleans, USA', lat: 29.9511, lng: -90.0715 },
  { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'Banff, Canada', lat: 51.1784, lng: -115.5708 },
  { name: 'Quebec City, Canada', lat: 46.8139, lng: -71.208 },
  { name: 'Havana, Cuba', lat: 23.1136, lng: -82.3666 },
  // South America
  { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729 },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'Cusco, Peru', lat: -13.532, lng: -71.9675 },
  { name: 'Cartagena, Colombia', lat: 10.391, lng: -75.4794 },
  { name: 'Santiago, Chile', lat: -33.4489, lng: -70.6693 },
];

export function randomSeedRegion() {
  return SEED_REGIONS[Math.floor(Math.random() * SEED_REGIONS.length)];
}
