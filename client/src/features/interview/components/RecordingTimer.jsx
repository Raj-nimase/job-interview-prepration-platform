import { useState, useEffect, useRef } from "react";

export function RecordingTimer({ isRecording }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      setSeconds(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  if (!isRecording) return null;

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <span className="text-red-400 font-mono text-sm font-semibold animate-pulse">
      ● {mins}:{secs}
    </span>
  );
}
