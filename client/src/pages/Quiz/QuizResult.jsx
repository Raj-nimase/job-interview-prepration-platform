import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const QuizResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const score = Number(searchParams.get("score") || 0);
  const total = Number(searchParams.get("total") || 0);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getFeedback = () => {
    if (percentage === 100) return "🎉 Perfect!";
    if (percentage >= 70) return "👏 Great job!";
    if (percentage >= 50) return "🙂 Not bad, keep practicing!";
    return "😅 Try again and improve!";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-gradient-to-br from-[#1e293b] to-[#111827] rounded-2xl shadow-2xl p-8 text-white text-center relative border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-4 text-white tracking-tight">
          Quiz Results
        </h1>

        {/* Score Ring */}
        <div className="relative w-36 h-36 mx-auto my-6">
          <svg className="w-full h-full transform rotate-[-90deg]">
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="#334155"
              strokeWidth="12"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={`${(percentage / 100) * 377}, 377`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-green-400">{percentage}%</span>
          </div>
        </div>

        {/* Score Summary */}
        <p className="text-lg mb-2">
          You scored <span className="font-semibold text-white">{score}</span> out of{" "}
          <span className="font-semibold text-white">{total}</span>
        </p>
        <p className="text-2xl font-semibold text-green-400 mb-6">{getFeedback()}</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/quiz")}
            className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow hover:shadow-green-500/20"
          >
            🔁 Retry Quiz
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg font-medium transition duration-200 shadow hover:shadow-gray-400/20"
          >
            📊 Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
