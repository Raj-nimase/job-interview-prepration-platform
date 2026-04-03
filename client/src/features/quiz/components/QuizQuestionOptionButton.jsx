export function QuizQuestionOptionButton({
  option,
  idx,
  selectedOption,
  onSelect,
}) {
  const selected = selectedOption === option;

  return (
    <button
      onClick={() => onSelect(option)}
      className={`group w-full text-left px-6 py-4 rounded-xl transition-all duration-200 border-2 flex items-center justify-between ${
        selected
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-2 ring-green-500/20"
          : "border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-white dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200"
      }`}
    >
      <div className="flex items-center">
        <span
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold transition-colors ${
            selected
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 dark:border-gray-600 group-hover:border-green-400"
          }`}
        >
          {String.fromCharCode(65 + idx)}
        </span>
        <span className="font-medium text-lg">{option}</span>
      </div>

      {selected && (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}

