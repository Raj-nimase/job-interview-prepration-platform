import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Trophy, ChevronRight, ArrowLeft, Sparkles, Star } from "lucide-react";
import { useQuizCourseProgress } from "../hook/useQuizCourseProgress";
import { useAuth } from "@/features/auth/hook/useAuth";

const levelMeta = [
  {
    level: 1,
    title: "Beginner",
    subtitle: "Build your foundation",
    icon: "🌱",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
  },
  {
    level: 2,
    title: "Intermediate",
    subtitle: "Strengthen your knowledge",
    icon: "📘",
    gradient: "from-blue-500 to-cyan-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
  },
  {
    level: 3,
    title: "Advanced",
    subtitle: "Challenge yourself",
    icon: "🔥",
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
  },
  {
    level: 4,
    title: "Expert",
    subtitle: "Push your limits",
    icon: "⚡",
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20",
  },
  {
    level: 5,
    title: "Master",
    subtitle: "Prove your mastery",
    icon: "👑",
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    glow: "shadow-rose-500/20",
  },
];

export default function QuizCoursePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") || "Aptitude";
  const { user } = useAuth();
  const userId = user?.id;

  const { unlockedLevel, loading } = useQuizCourseProgress(userId, topic);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLevelClick = (lvl) => {
    if (lvl.level <= unlockedLevel) {
      setSelectedLevel(lvl);
    }
  };

  const confirmStart = () => {
    if (!selectedLevel) return;
    navigate(`/quiz/play?topic=${encodeURIComponent(topic)}&level=${selectedLevel.level}`);
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen ">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 blur-3xl" />

      {/* Header */}
      <div className="pt-28 pb-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/quiz")}
            className="flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
              {topic}{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Levels
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Score at least <span className="text-emerald-500 font-semibold">60%</span> to unlock the next level. Master all 5 to become an expert.
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-md mx-auto"
          >
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span className="text-emerald-500 font-semibold">
                {loading ? "..." : `${Math.min(unlockedLevel - 1, 5)} / 5 completed`}
              </span>
            </div>
            <div className="w-full bg-muted/60 dark:bg-muted/40 h-2.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: loading ? "0%" : `${Math.min((unlockedLevel - 1) / 5, 1) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Level Cards */}
      <div className="px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            <motion.div
              className="space-y-4 mt-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {/* Vertical timeline connector */}
              <div className="relative">
                {levelMeta.map((lvl, idx) => {
                  const isUnlocked = lvl.level <= unlockedLevel;
                  const isCompleted = lvl.level < unlockedLevel;
                  const isCurrent = lvl.level === unlockedLevel;

                  return (
                    <motion.div
                      key={lvl.level}
                      variants={{
                        hidden: { opacity: 0, x: -30 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                      }}
                      className="relative mb-6"
                    >
                      {/* Connector line */}
                      {idx < levelMeta.length - 1 && (
                        <div className={`absolute left-7 top-[4.5rem] w-0.5 h-8 ${isCompleted ? "bg-emerald-500" : "bg-border"}`} />
                      )}

                      <motion.div
                        onClick={() => handleLevelClick(lvl)}
                        whileHover={isUnlocked ? { scale: 1.01, x: 4 } : {}}
                        className={`relative flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 ${
                          isUnlocked
                            ? `bg-card ${lvl.border} shadow-lg ${lvl.glow} hover:shadow-xl cursor-pointer`
                            : "bg-muted/30 border-border opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {/* Level icon */}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${isUnlocked ? lvl.bg : "bg-muted/50"}`}>
                          {isCompleted ? (
                            <Trophy className="h-6 w-6 text-emerald-500" />
                          ) : isUnlocked ? (
                            <span>{lvl.icon}</span>
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Level info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isUnlocked ? "text-emerald-500" : "text-muted-foreground"}`}>
                              Level {lvl.level}
                            </span>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                                <Star className="h-3 w-3" /> Completed
                              </span>
                            )}
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold animate-pulse">
                                <Sparkles className="h-3 w-3" /> Current
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-foreground">{lvl.title}</h3>
                          <p className="text-sm text-muted-foreground">{lvl.subtitle}</p>
                        </div>

                        {/* Action */}
                        <div className="flex-shrink-0">
                          {isUnlocked ? (
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                              <ChevronRight className="h-5 w-5 text-emerald-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLevel(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md z-10"
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${selectedLevel.bg} mb-4 text-3xl`}>
                  {selectedLevel.icon}
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Start {selectedLevel.title} Quiz
                </h2>
                <p className="text-sm text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">{topic}</span> — Level {selectedLevel.level}
                </p>
                <p className="text-xs text-muted-foreground">
                  Score at least 60% to unlock the next level
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="flex-1 px-4 py-3 rounded-xl bg-muted hover:bg-accent text-foreground font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStart}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                >
                  Start Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
