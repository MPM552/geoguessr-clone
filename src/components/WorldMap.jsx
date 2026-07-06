import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors';

const guessIcon = L.divIcon({
  className: '',
  html: '<div class="pin-reticle"><div class="pin-reticle__dot"></div></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const actualIcon = L.divIcon({
  className: '',
  html: '<div class="pin-actual"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function ClickCapture({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
  }, [map, points]);
  return null;
}

function InvalidateOnResize({ watch }) {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 240);
    return () => clearTimeout(id);
  }, [map, watch]);
  return null;
}

/**
 * A single reusable map. In "guess" mode it captures clicks to place a
 * pin. In "result" mode it's read-only and shows both the guess and the
 * true location connected by a line, auto-framed to fit both.
 */
export default function WorldMap({
  mode = 'guess',
  guess,
  actual,
  onGuess,
  resizeKey,
}) {
  const initialCenter = useMemo(() => [20, 0], []);
  const mapRef = useRef(null);

  const points = [];
  if (guess) points.push([guess.lat, guess.lng]);
  if (actual) points.push([actual.lat, actual.lng]);

  return (
    <MapContainer
      ref={mapRef}
      center={initialCenter}
      zoom={2}
      minZoom={2}
      worldCopyJump
      zoomControl={mode === 'result'}
      attributionControl={false}
      className="guess-panel__map"
      preferCanvas
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {mode === 'guess' && <ClickCapture onClick={onGuess} />}
      {guess && <Marker position={[guess.lat, guess.lng]} icon={guessIcon} />}
      {actual && <Marker position={[actual.lat, actual.lng]} icon={actualIcon} />}
      {mode === 'result' && points.length === 2 && (
        <Polyline
          positions={points}
          pathOptions={{ color: '#e8a33d', weight: 2, dashArray: '6 6' }}
        />
      )}
      {mode === 'result' && <FitBounds points={points} />}
      <InvalidateOnResize watch={resizeKey} />
    </MapContainer>
  );
}
