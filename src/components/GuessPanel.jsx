import { useState } from 'react';
import WorldMap from './WorldMap.jsx';

export default function GuessPanel({ guess, onGuess }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`guess-panel${expanded ? ' is-expanded' : ' is-peek'}`}>
      <WorldMap
        mode="guess"
        guess={guess}
        onGuess={(lat, lng) => {
          onGuess(lat, lng);
          setExpanded(true);
        }}
        resizeKey={expanded}
      />
      {!expanded && (
        <button
          type="button"
          className="guess-panel__peek-label"
          onClick={() => setExpanded(true)}
        >
          {guess ? 'Pin placed — tap to adjust' : 'Tap to open map'}
        </button>
      )}
      {expanded && (
        <div className="guess-panel__bar">
          <span className="guess-panel__coords mono">
            {guess ? `${guess.lat.toFixed(2)}°, ${guess.lng.toFixed(2)}°` : 'Click the map to drop a pin'}
          </span>
          <button
            type="button"
            className="guess-panel__collapse"
            onClick={() => setExpanded(false)}
          >
            Minimize
          </button>
        </div>
      )}
    </div>
  );
}
