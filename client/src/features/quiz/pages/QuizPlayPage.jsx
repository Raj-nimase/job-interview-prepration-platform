import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";

import { useQuizQuestions } from "../hook/useQuizQuestions";
import { useQuizSubmission } from "../hook/useQuizSubmission";

export default function QuizPlayPage() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const level = Number(searchParams.get("level")) || 1;
  const navigate = useNavigate();

  const { questions, loading, error } = useQuizQuestions(topic, level);
  const { submit, submitting } = useQuizSubmission(topic, level);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setTimeElapsed(0);
  }, [topic, level]);

  // Timer
  useEffect(() => {
    if (loading || error || questions.length === 0) return;
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [loading, error, questions.length]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

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
      const { score, total, passed, percentage } = res || {};
      navigate(
        `/quiz-result?score=${score}&total=${total}&topic=${encodeURIComponent(topic)}&level=${level}&passed=${passed}&percentage=${percentage}`
      );
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mb-4" />
        <p className="text-lg font-medium text-foreground">Loading questions...</p>
        <p className="text-sm text-muted-foreground mt-1">{topic} — Level {level}</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-6">
            {error || "No questions available for this level."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const progress = ((currentQuestionIndex + 1) / total) * 100;

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 pt-24 pb-12 flex justify-center items-start">
        <div className="max-w-2xl w-full">
          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
          </motion.div>

          {/* Quiz Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    {topic} — Level {level}
                  </span>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                    Question{" "}
                    <span className="text-foreground font-bold">
                      {currentQuestionIndex + 1}
                    </span>{" "}
                    of{" "}
                    <span className="text-foreground font-bold">{total}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <p className="text-sm font-bold text-emerald-500">{Math.round(progress)}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-muted/60 dark:bg-muted/40 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-emerald-500  h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="p-6 sm:p-8">
              <motion.h2
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed mb-8"
              >
                {currentQuestion.question}
              </motion.h2>

              {/* Options */}
              <motion.div
                key={`opts-${currentQuestionIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-1 gap-3"
              >
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOptionSelect(option)}
                      className={`group w-full text-left px-5 py-4 rounded-xl transition-all duration-200 border-2 flex items-center ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                          : "border-border hover:border-emerald-500/40 hover:bg-accent text-foreground"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center mr-4 text-sm font-bold transition-colors flex-shrink-0 ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-border group-hover:border-emerald-400 text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-medium">{option}</span>

                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Next / Submit Button */}
              <div className="mt-8">
                <button
                  onClick={handleNext}
                  disabled={!selectedOption || submitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 active:scale-[0.98] ${
                    selectedOption
                      ? "bg-emerald-600 text-white  hover:shadow-xl "
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {currentQuestionIndex + 1 === questions.length
                    ? submitting
                      ? "Submitting..."
                      : "Submit Quiz"
                    : "Next Question →"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
