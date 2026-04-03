import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, LayoutDashboard, ArrowRight, Lock, Unlock } from "lucide-react";

export default function QuizResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const score = Number(searchParams.get("score") || 0);
  const total = Number(searchParams.get("total") || 0);
  const topic = searchParams.get("topic") || "";
  const level = Number(searchParams.get("level") || 1);
  const passed = searchParams.get("passed") === "true";
  const percentage = Number(searchParams.get("percentage") || 0);

  const getFeedback = () => {
    if (percentage === 100) return { emoji: "🎉", text: "Perfect Score!", sub: "You aced it! Incredible work." };
    if (percentage >= 80) return { emoji: "🌟", text: "Excellent!", sub: "Outstanding performance. Keep shining!" };
    if (percentage >= 60) return { emoji: "👏", text: "Well Done!", sub: "You passed! Next level is unlocked." };
    if (percentage >= 40) return { emoji: "💪", text: "Keep Trying!", sub: "You're close! A little more practice." };
    return { emoji: "📚", text: "Study More", sub: "Review the material and try again." };
  };

  const feedback = getFeedback();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SVG score ring parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen ">
      <div className="absolute inset-0 -z-10  blur-3xl" />

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`py-6 px-8 text-center ${passed
            ? "bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/5 dark:to-green-500/5"
            : "bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5"
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {topic} — Level {level}
            </span>
            <h1 className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">
              Quiz Results
            </h1>
          </div>

          <div className="p-8 text-center">
            {/* Score Ring */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform rotate-[-90deg]">
                <circle
                  cx="80" cy="80" r={radius}
                  fill="none"
                  className="stroke-muted/40"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="80" cy="80" r={radius}
                  fill="none"
                  className={passed ? "stroke-emerald-500" : "stroke-amber-500"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${passed ? "text-emerald-500" : "text-amber-500"}`}>
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Feedback */}
            <div className="text-5xl mb-3">{feedback.emoji}</div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{feedback.text}</h2>
            <p className="text-muted-foreground text-sm mb-2">{feedback.sub}</p>
            <p className="text-foreground font-medium">
              You scored <span className="text-emerald-500 font-bold">{score}</span> out of{" "}
              <span className="font-bold">{total}</span>
            </p>

            {/* Level unlock status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                passed
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {passed ? (
                <>
                  <Unlock className="h-4 w-4" />
                  {level < 5 ? `Level ${level + 1} Unlocked!` : "All levels completed! 🏆"}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Score 60% or more to unlock Level {level + 1}
                </>
              )}
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => navigate(`/quiz/play?topic=${encodeURIComponent(topic)}&level=${level}`)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-muted hover:bg-accent text-foreground font-medium transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Retry Level
              </button>

              {passed && level < 5 ? (
                <button
                  onClick={() => navigate(`/quiz/play?topic=${encodeURIComponent(topic)}&level=${level + 1}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl  bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  Next Level
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/quizcourse?topic=${encodeURIComponent(topic)}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-emerald-600 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  View Levels
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
