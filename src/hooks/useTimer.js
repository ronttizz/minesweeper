import { useState, useEffect, useRef } from "react";

/**
 * Counts elapsed seconds while `running` is true.
 * Returns [elapsed, resetTimer].
 */
export function useTimer(running) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const resetTimer = () => setElapsed(0);

  return [elapsed, resetTimer];
}
