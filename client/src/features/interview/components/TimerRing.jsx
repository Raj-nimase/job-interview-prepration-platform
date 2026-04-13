import { useEffect, useRef } from "react";

/**
 * SVG countdown ring — shows time remaining as a circular progress indicator.
 * Props:
 *   timeRemaining: number (seconds left)
 *   timeLimit: number (total seconds)
 *   size: number (px, default 72)
 */
export function TimerRing({ timeRemaining, timeLimit, size = 72 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, timeRemaining / timeLimit);
  const strokeDashoffset = circumference * (1 - progress);

  const isAmber = timeRemaining <= 30 && timeRemaining > 10;
  const isRed = timeRemaining <= 10;

  const color = isRed
    ? "#ef4444"
    : isAmber
    ? "#f59e0b"
    : "#10b981";

  const pulseClass =
    isRed
      ? "animate-pulse"
      : isAmber
      ? "animate-pulse"
      : "";

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const label = `${mins}:${String(secs).padStart(2, "0")}`;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${pulseClass}`}
      style={{ width: size, height: size }}
      aria-label={`${label} remaining`}
      role="timer"
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          className="text-muted/40"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.5s ease" }}
        />
      </svg>
      {/* Time label */}
      <span
        className="absolute text-xs font-bold font-mono tabular-nums"
        style={{ color, fontSize: size < 60 ? "0.6rem" : "0.75rem" }}
      >
        {label}
      </span>
    </div>
  );
}
