export default function FinalScreen({ rounds, onPlayAgain }) {
  const total = rounds.reduce((sum, r) => sum + r.score, 0);
  const max = rounds.length * 1000;

  return (
    <div className="final-screen fade-enter">
      <div className="final-card">
        <div className="final-card__total">
          <div className="final-card__total-value">{total.toLocaleString()}</div>
          <div className="final-card__total-label mono">of {max.toLocaleString()} points</div>
        </div>

        <div className="final-card__rounds">
          {rounds.map((r, i) => (
            <div className="final-card__round-row" key={r.location.id}>
              <span>ROUND {i + 1}</span>
              <b>{r.guess ? formatDistance(r.distanceKm) : 'no guess'}</b>
              <span className={r.score >= 700 ? 'good' : ''}>{r.score} pts</span>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={onPlayAgain}>
          Play again
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
