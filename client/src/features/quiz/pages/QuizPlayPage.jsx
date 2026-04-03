import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useQuizQuestions } from "../hook/useQuizQuestions";
import { useQuizSubmission } from "../hook/useQuizSubmission";
import { QuizQuestionOptionButton } from "../components/QuizQuestionOptionButton";
import { QuizProgressBar } from "../components/QuizProgressBar";

export default function QuizPlayPage() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const navigate = useNavigate();

  const { questions, loading, error } = useQuizQuestions(topic);
  const { submit, submitting } = useQuizSubmission(topic);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Reset quiz state when topic changes
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
  }, [topic]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    const newAnswers = [
      ...answers,
      { questionId: currentQuestion._id, selectedOption },
    ];

    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    try {
      const res = await submit(newAnswers);
      const { score, total } = res || {};
      navigate(`/quiz-result?score=${score}&total=${total}`);
    } catch (err) {
      // Keep UI consistent with previous version: show message via error box
      console.error("Error submitting quiz:", err);
      // error state is owned by hook; we keep it minimal here.
      // For now, just rethrow and let hook/higher UI handle.
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center text-black dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4" />
        <p className="text-xl font-medium">Loading questions...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-black dark:text-white px-4">
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
          <p className="text-lg mb-6">
            {error || "No questions available for this level."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const total = questions.length;

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="max-w-2xl w-full bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700 mt-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">
                {topic}
              </span>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Question{" "}
                <span className="text-black dark:text-white font-bold">
                  {currentQuestionIndex + 1}
                </span>{" "}
                of{" "}
                <span className="text-black dark:text-white font-bold">
                  {total}
                </span>
              </p>
            </div>
          </div>

          <QuizProgressBar
            currentIndex={currentQuestionIndex}
            total={total}
          />

          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <QuizQuestionOptionButton
                key={idx}
                option={option}
                idx={idx}
                selectedOption={selectedOption}
                onSelect={handleOptionSelect}
              />
            ))}
          </div>

          <div className="mt-10">
            <button
              onClick={handleNext}
              disabled={!selectedOption || submitting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform active:scale-[0.98] ${
                selectedOption
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentQuestionIndex + 1 === questions.length
                ? submitting
                  ? "Submitting..."
                  : "Submit Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

