import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as authApi from "../../features/auth/services/auth.api";

export default function QuizPlay() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // our backend will read token from cookie; no need to send header
        const res = await axios.get(
          `http://localhost:4000/api/quiz/questions/${topic}`,
          { withCredentials: true },
        );
        setQuestions(res.data);
        setError(null);
      } catch (err) {
        console.error("[QuizPlay] Error fetching questions:", err);
        setError(err.response?.data?.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      fetchQuestions();
    } else {
      setLoading(false);
      setError("No topic selected. Please go back and select a topic.");
    }
  }, [topic]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    const newAnswers = [
      ...answers,
      { questionId: currentQuestion._id, selectedOption },
    ];
    setAnswers(newAnswers);

    setSelectedOption(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Last question reached, submit to backend
      try {
        setLoading(true);
        // ask server for user id (cookie auth)
        const me = await authApi.getMe();
        const res = await axios.post(
          "http://localhost:4000/api/quiz/submit",
          {
            userId: me.user.id,
            topic,
            answers: newAnswers,
          },
          { withCredentials: true },
        );

        const { score, total } = res.data;
        navigate(`/quiz-result?score=${score}&total=${total}`);
      } catch (err) {
        console.error("Error submitting quiz:", err);
        setError("Failed to submit quiz.");
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center text-black dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-xl font-medium">Loading questions...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className=" min-h-screen flex flex-col justify-center items-center text-black dark:text-white px-4">
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className=" min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="max-w-2xl w-full bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700 mt-10">
          {/* Progress Header */}
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
                  {questions.length}
                </span>
              </p>
            </div>
            {/* Score calculation moved to after submission */}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Question Body */}
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`group w-full text-left px-6 py-4 rounded-xl transition-all duration-200 border-2 flex items-center justify-between ${
                  selectedOption === option
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-2 ring-green-500/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-white dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold transition-colors ${
                      selectedOption === option
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 dark:border-gray-600 group-hover:border-green-400"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium text-lg">{option}</span>
                </div>
                {selectedOption === option && (
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
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform active:scale-[0.98] ${
                selectedOption
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentQuestionIndex + 1 === questions.length
                ? "Submit Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
