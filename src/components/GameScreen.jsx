import { useCallback, useRef, useState } from 'react';
import ImageStage from './ImageStage.jsx';
import Timer from './Timer.jsx';
import GuessPanel from './GuessPanel.jsx';

const ROUND_SECONDS = 60;
const TOTAL_ROUNDS = 5;

export default function GameScreen({ location, roundIndex, totalScore, onSubmit }) {
  const [guess, setGuess] = useState(null);
  const submittedRef = useRef(false);

  // Reset local guess state whenever a new round's location arrives.
  const locationId = location.id;
  const prevIdRef = useRef(locationId);
  if (prevIdRef.current !== locationId) {
    prevIdRef.current = locationId;
    submittedRef.current = false;
  }

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(guess);
  }, [guess, onSubmit]);

  return (
    <div className="game-screen fade-enter">
      <ImageStage location={location} />

      <div className="hud">
        <div className="hud__round mono">
          ROUND <b>{roundIndex + 1}</b> / {TOTAL_ROUNDS}
        </div>
        <div className="hud__score">
          <b>{totalScore.toLocaleString()}</b>
          TOTAL PTS
        </div>
      </div>

      <Timer key={locationId} duration={ROUND_SECONDS} onExpire={handleSubmit} />

      <GuessPanel guess={guess} onGuess={(lat, lng) => setGuess({ lat, lng })} />

      <button
        type="button"
        className="btn-primary guess-btn"
        disabled={!guess}
        onClick={handleSubmit}
      >
        Lock in guess
      </button>
    </div>
  );
}
