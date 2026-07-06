import { useEffect, useState } from 'react';
import { isPreloaded } from '../utils/preload.js';

export default function ImageStage({ location }) {
  const [loaded, setLoaded] = useState(() => isPreloaded(location.imageUrl));

  useEffect(() => {
    setLoaded(isPreloaded(location.imageUrl));
  }, [location.imageUrl]);

  return (
    <div className="stage">
      {!loaded && <div className="stage__placeholder">Loading imagery…</div>}
      <img
        key={location.id}
        className={`stage__img${loaded ? ' is-loaded' : ''}`}
        src={location.imageUrl}
        alt="Guess the location"
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
      {location.attribution && (
        <div className="stage__attribution">{location.attribution}</div>
      )}
    </div>
  );
}
