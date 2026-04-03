import { BrainCircuit, Code2, UserCog, Activity, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const quizTopics = [
  {
    name: "Aptitude",
    icon: <Activity className="h-8 w-8" />,
    description: "Numerical ability, reasoning & problem-solving",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-400",
  },
  {
    name: "Technical",
    icon: <BrainCircuit className="h-8 w-8" />,
    description: "CS fundamentals, networking & system design",
    gradient: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  {
    name: "Coding",
    icon: <Code2 className="h-8 w-8" />,
    description: "Programming concepts, syntax & problem patterns",
    gradient: "from-emerald-500 to-green-600",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  {
    name: "HR",
    icon: <UserCog className="h-8 w-8" />,
    description: "Behavioral, situational & communication skills",
    gradient: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/20",
    bg: "bg-purple-500/10",
    iconColor: "text-purple-400",
  },
  {
    name: "DSA",
    icon: <BookOpen className="h-8 w-8" />,
    description: "Data structures, algorithms & complexity analysis",
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
    bg: "bg-rose-500/10",
    iconColor: "text-rose-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function QuizHomePage() {
  const navigate = useNavigate();

  const handleTopicSelect = (topicName) => {
    navigate(`/quizcourse?topic=${encodeURIComponent(topicName)}`);
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="pt-28 pb-8 px-4 sm:px-6 text-center relative">
        <div className="absolute inset-0 -z-10  blur-3xl" />
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
        >
          Quiz{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
            Practice
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
        >
          Choose a category to test your skills. Complete levels to unlock harder questions.
        </motion.p>
      </div>

      {/* Topic Cards */}
      <div className="px-4 sm:px-6 pb-20">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {quizTopics.map((topic) => (
            <motion.div
              key={topic.name}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              onClick={() => handleTopicSelect(topic.name)}
              className={`relative cursor-pointer bg-card rounded-2xl border border-border  hover:border-emerald-500/30 transition-all duration-300 overflow-hidden group`}
            >
              {/* Gradient accent bar */}
              <div className={`h-1.5 bg-gradient-to-r ${topic.gradient}`} />

              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${topic.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={topic.iconColor}>{topic.icon}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">{topic.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
                <div className="mt-4 flex items-center text-emerald-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Start Practice →
                </div>
              </div>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
