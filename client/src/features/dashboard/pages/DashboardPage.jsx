import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  ListChecks,
  FileText,
  ClipboardList,
  List,
  CheckCircle,
  GaugeCircle,
  UserCheck,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useDashboardRecords } from "../hook/useDashboardRecords";
import { StatsCard } from "../components/StatsCard";
import { RecentSessionsTable } from "../components/RecentSessionsTable";
import { ResumeHistoryTable } from "../components/ResumeHistoryTable";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { loading, user, interviewStats, quizStats, resumeHistory } =
    useDashboardRecords();

  const features = useMemo(
    () => [
      {
        title: "Take Interview",
        description: "Practice live interviews and improve your skills.",
        route: "/selectRole",
        icon: <Mic className="h-8 w-8 text-emerald-400 mb-3" />,
      },
      {
        title: "Take Quiz",
        description: "Test your knowledge with topic-based quizzes.",
        route: "/quiz",
        icon: <ListChecks className="h-8 w-8 text-emerald-400 mb-3" />,
      },
      {
        title: "Build Resume",
        description: "Build your professional resume.",
        route: "/resume",
        icon: <FileText className="h-8 w-8 text-emerald-400 mb-3" />,
      },
    ],
    []
  );

  const quizStatsArray = useMemo(() => {
    if (!quizStats) return [];
    return [
      {
        label: "Total Quizzes",
        value: quizStats.totalQuizzes || 0,
        color: "text-purple-400",
        icon: <ClipboardList className="h-6 w-6 text-purple-400 mb-2" />,
      },
      {
        label: "Total Questions",
        value: quizStats.totalQuestions || 0,
        color: "text-indigo-400",
        icon: <List className="h-6 w-6 text-indigo-400 mb-2" />,
      },
      {
        label: "Correct Answers",
        value: quizStats.correct || 0,
        color: "text-green-400",
        icon: <CheckCircle className="h-6 w-6 text-green-400 mb-2" />,
      },
      {
        label: "Accuracy",
        value: `${quizStats.accuracy || 0}%`,
        color: "text-cyan-400",
        icon: <GaugeCircle className="h-6 w-6 text-cyan-400 mb-2" />,
      },
    ];
  }, [quizStats]);

  const interviewStatsArray = useMemo(() => {
    if (!interviewStats) return [];
    return [
      {
        label: "Interviews Taken",
        value: interviewStats.totalInterviews || 0,
        color: "text-cyan-400",
        icon: <UserCheck className="h-6 w-6 text-cyan-400 mb-2" />,
      },
      {
        label: "Total Questions",
        value: interviewStats.totalQuestions || 0,
        color: "text-green-400",
        icon: <HelpCircle className="h-6 w-6 text-green-400 mb-2" />,
      },
      {
        label: "Average Score/Session",
        value: interviewStats.averageScorePerSession || 0,
        color: "text-yellow-400",
        icon: <CheckCircle2 className="h-6 w-6 text-yellow-400 mb-2" />,
      },
      {
        label: "Average Score/question",
        value: (interviewStats.averageScorePerQuestion || 0).toFixed(2),
        color: "text-red-400",
        icon: <XCircle className="h-6 w-6 text-red-400 mb-2" />,
      },
    ];
  }, [interviewStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-10 mt-24 sm:pt-28">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-10"
      >
        Welcome Back,{" "}
        <span className="text-emerald-400">{user?.name || "User"}</span> 👋
      </motion.h1>

      {/* Interview Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10">
        {interviewStatsArray.length ? (
          interviewStatsArray.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="block"
            >
              <StatsCard
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                colorClassName={stat.color}
              />
            </motion.div>
          ))
        ) : (
          <p className="col-span-4 text-center text-muted-foreground">
            No interview stats available
          </p>
        )}
      </div>

      {/* Recent Interview Sessions */}
      <RecentSessionsTable
        sessions={interviewStats?.recentSessions || []}
      />

      {/* Resume History */}
      <ResumeHistoryTable analyses={resumeHistory || []} />

      {/* Quiz Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10 mt-16">
        {quizStats ? (
          quizStatsArray.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="block"
            >
              <StatsCard
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                colorClassName={stat.color}
              />
            </motion.div>
          ))
        ) : (
          <p className="col-span-4 text-center text-muted-foreground">
            No quiz stats available
          </p>
        )}
      </div>

      {quizStats?.topicWise?.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4 text-emerald-400">
            Performance by Topic
          </h2>
          <div className="space-y-4">
            {quizStats.topicWise.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-foreground font-medium">{item.topic}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.accuracy}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-emerald-400 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(feature.route)}
            className="cursor-pointer bg-card border border-border p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300"
          >
            {feature.icon}
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              {feature.title}
            </h2>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

