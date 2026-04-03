export function QuizScoreRing({ percentage }) {
  const pct = Number.isFinite(percentage) ? percentage : 0;
  return (
    <div className="relative w-36 h-36 mx-auto my-6">
      <svg className="w-full h-full transform rotate-[-90deg]">
        <circle
          cx="72"
          cy="72"
          r="60"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
        />
        <circle
          cx="72"
          cy="72"
          r="60"
          fill="none"
          stroke="#10b981"
          strokeWidth="12"
          strokeDasharray={`${(pct / 100) * 377}, 377`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-green-600 dark:text-green-400">
          {pct}%
        </span>
      </div>
    </div>
  );
}

