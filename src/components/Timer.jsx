import { useEffect, useRef, useState } from 'react';

export default function Timer({ duration = 60, onExpire, isPaused = false }) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSecondsLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return undefined;
    if (secondsLeft <= 0) {
      onExpireRef.current?.();
      return undefined;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, isPaused]);

  const pct = Math.max(0, (secondsLeft / duration) * 100);
  const isLow = secondsLeft <= 10;

  return (
    <div className={`timer${isLow ? ' is-low' : ''}`}>
      <div className="timer__value mono">
        00:{String(Math.max(0, secondsLeft)).padStart(2, '0')}
      </div>
      <div className="timer__track">
        <div className="timer__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
