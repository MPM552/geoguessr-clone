import { useCallback, useMemo, useState } from 'react';
import { buildDefaultProvider } from './providers/index.js';
import { haversineDistanceKm, calculateScore } from './utils/geo.js';
import { preloadImage } from './utils/preload.js';
import StartScreen from './components/StartScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import FinalScreen from './components/FinalScreen.jsx';

const TOTAL_ROUNDS = 5;

// Swap/add providers in src/providers/index.js — nothing here needs to
// change to point the game at a different image source (or several).
// Pass a Mapillary token here if you have one: buildDefaultProvider({ mapillaryToken: '...' })
const provider = buildDefaultProvider();

export default function App() {
  const [phase, setPhase] = useState('start'); // start | preparing | playing | round-result | final
  const [locations, setLocations] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [error, setError] = useState(null);

  const totalScore = useMemo(() => rounds.reduce((s, r) => s + r.score, 0), [rounds]);

  const beginGame = useCallback(async () => {
    setPhase('preparing');
    setError(null);
    try {
      const picks = await provider.getLocations(TOTAL_ROUNDS);
      if (picks.length < TOTAL_ROUNDS) {
        throw new Error('Not enough imagery came back — check your connection and try again.');
      }
      // Block on the first image only, so round 1 never shows a spinner
      // mid-game; the rest preload silently in the background.
      await preloadImage(picks[0].imageUrl);
      picks.slice(1).forEach((loc) => preloadImage(loc.imageUrl));

      setLocations(picks);
      setRounds([]);
      setRoundIndex(0);
      setPhase('playing');
    } catch (err) {
      setError(err.message || 'Something went wrong loading the round.');
      setPhase('start');
    }
  }, []);

  const handleRoundSubmit = useCallback(
    (guess) => {
      const location = locations[roundIndex];
      const distanceKm = guess
        ? haversineDistanceKm(guess.lat, guess.lng, location.lat, location.lng)
        : Infinity;
      const score = guess ? calculateScore(distanceKm) : 0;

      setRounds((prev) => [...prev, { location, guess, distanceKm, score }]);
      setPhase('round-result');
    },
    [locations, roundIndex]
  );

  const handleContinue = useCallback(() => {
    if (roundIndex + 1 < TOTAL_ROUNDS) {
      setRoundIndex((i) => i + 1);
      setPhase('playing');
    } else {
      setPhase('final');
    }
  }, [roundIndex]);

  return (
    <div className="app-shell">
      {phase === 'start' && (
        <StartScreen onStart={beginGame} isLoading={false} error={error} />
      )}

      {phase === 'preparing' && (
        <StartScreen onStart={beginGame} isLoading error={error} />
      )}

      {phase === 'playing' && locations[roundIndex] && (
        <GameScreen
          location={locations[roundIndex]}
          roundIndex={roundIndex}
          totalScore={totalScore}
          onSubmit={handleRoundSubmit}
        />
      )}

      {phase === 'round-result' && rounds[roundIndex] && (
        <ResultScreen
          round={rounds[roundIndex]}
          roundIndex={roundIndex}
          isLastRound={roundIndex + 1 >= TOTAL_ROUNDS}
          onContinue={handleContinue}
        />
      )}

      {phase === 'final' && <FinalScreen rounds={rounds} onPlayAgain={beginGame} />}
    </div>
  );
}
