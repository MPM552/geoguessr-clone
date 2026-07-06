import WorldMap from './WorldMap.jsx';

export default function ResultScreen({ round, roundIndex, isLastRound, onContinue }) {
  const { location, guess, distanceKm, score } = round;
  const hasGuess = !!guess;

  return (
    <div className="result-screen fade-enter">
      <div className="result-card">
        <div className="result-card__score">
          <div>
            <span className="result-card__score-value">{score}</span>
            <span className="result-card__score-max mono"> / 1000</span>
          </div>
          <div className="loading-line mono">ROUND {roundIndex + 1} / 5</div>
        </div>

        <div className="result-card__distance mono">
          {hasGuess ? (
            <>
              Off by <b>{formatDistance(distanceKm)}</b>
            </>
          ) : (
            <>No guess submitted — time expired</>
          )}
        </div>

        <div className="result-map">
          <WorldMap mode="result" guess={guess} actual={location} resizeKey={roundIndex} />
        </div>

        <button className="btn-primary" onClick={onContinue}>
          {isLastRound ? 'See final results' : 'Next round'}
        </button>
      </div>
    </div>
  );
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}
