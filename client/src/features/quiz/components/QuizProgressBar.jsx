export function QuizProgressBar({ currentIndex, total }) {
  const pct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
      <div
        className="bg-green-500 h-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

