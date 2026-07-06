export default function StartScreen({ onStart, isLoading, error }) {
  return (
    <div className="start-screen fade-enter">
      <div className="start-screen__eyebrow mono">FIELD RECON // GEOGRAPHY TRIAL</div>
      <h1 className="start-screen__title">
        Where in the <span>world</span>?
      </h1>
      <p className="start-screen__sub">
        Five photographs, one minute each. Drop a pin on the world map as close
        to the true location as you can — the closer the guess, the higher the score.
      </p>

      <div className="start-screen__meta">
        <div>
          <b>5</b>
          rounds
        </div>
        <div>
          <b>60s</b>
          per round
        </div>
        <div>
          <b>1000</b>
          max pts / round
        </div>
      </div>

      <button className="btn-primary" onClick={onStart} disabled={isLoading}>
        {isLoading ? 'Loading imagery…' : 'Start game'}
      </button>

      {error && <p className="loading-line" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}
