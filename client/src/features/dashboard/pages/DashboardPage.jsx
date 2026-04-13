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
  Trophy,
  TrendingUp,
  Star,
  BrainCircuit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useDashboardRecords } from "../hook/useDashboardRecords";
import { StatsCard } from "../components/StatsCard";
import { RecentSessionsTable } from "../components/RecentSessionsTable";
import { ResumeHistoryTable } from "../components/ResumeHistoryTable";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { loading, user, interviewStats, quizStats, resumeHistory, competencyProfile } =
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
    const avgScore = interviewStats.averageScorePerSession || 0;
    const lastScore = interviewStats.lastInterviewScore || 0;
    const best = interviewStats.highestScoringSession;

    return [
      {
        label: "Interviews Taken",
        value: interviewStats.totalInterviews || 0,
        subtext: "completed sessions",
        color: "text-cyan-400",
        icon: <UserCheck className="h-6 w-6 text-cyan-400 mb-2" />,
      },
      {
        label: "Best Session Score",
        value: best?.overallScore != null ? `${Math.round(best.overallScore)}/10` : "—",
        subtext: best?.role || "No data yet",
        color: "text-yellow-400",
        icon: <Trophy className="h-6 w-6 text-yellow-400 mb-2" />,
      },
      {
        label: "Avg Score / Session",
        value: avgScore > 0 ? `${avgScore.toFixed(1)}/10` : "—",
        subtext: "across all sessions",
        color: "text-emerald-400",
        icon: <TrendingUp className="h-6 w-6 text-emerald-400 mb-2" />,
      },
      {
        label: "Last Interview Score",
        value: lastScore > 0 ? `${lastScore}/10` : "—",
        subtext: "most recent session",
        color: "text-purple-400",
        icon: <Star className="h-6 w-6 text-purple-400 mb-2" />,
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

  // Get top 5 competencies
  const competenciesKeys = Object.keys(competencyProfile || {});
  const hasCompetencies = competenciesKeys.length > 0;
  const sortedCompetencies = hasCompetencies
    ? competenciesKeys.sort((a, b) => competencyProfile[b] - competencyProfile[a]).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-10 mt-24 sm:pt-28 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-16">
        
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center"
        >
          Welcome Back,{" "}
          <span className="text-emerald-400">{user?.name || "User"}</span> 👋
        </motion.h1>

        {/* Section: Interview Progress */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Interview Progress</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="col-span-1 lg:col-span-8 space-y-8">
              {/* Interview Stats Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {interviewStatsArray.length ? (
                  interviewStatsArray.map((stat, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} className="block">
                      <StatsCard
                        icon={stat.icon}
                        value={stat.value}
                        label={stat.label}
                        subtext={stat.subtext}
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
              <RecentSessionsTable sessions={interviewStats?.recentSessions || []} />
            </div>

            {/* Competency Radar Widget */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <div className="bg-card border border-border p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <BrainCircuit className="text-purple-500 w-5 h-5" /> AI Competency Profile
                  </h3>
                </div>
                
                {!hasCompetencies ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">Take more interviews to build your profile.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedCompetencies.map(skill => {
                      const score = competencyProfile[skill];
                      const c = score >= 8 ? "bg-emerald-500" : score >= 6 ? "bg-amber-500" : "bg-red-500";
                      return (
                        <div key={skill}>
                          <div className="flex justify-between mb-1.5 text-sm font-medium">
                            <span className="text-foreground capitalize">{skill.replace(/_/g, " ")}</span>
                            <span className="text-muted-foreground">{score}/10</span>
                          </div>
                          <div className="w-full bg-muted/60 rounded-full h-2">
                            <div
                              className={`${c} h-2 rounded-full transition-all duration-700`}
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-xs text-muted-foreground mt-4 italic text-center">
                      Continuously updated based on your interview answers.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Resume History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Resume Analysis</h2>
          </div>
          <ResumeHistoryTable analyses={resumeHistory || []} />
        </section>

        {/* Section: Quiz Stats Summary */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Quiz Performance</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {quizStats ? (
              quizStatsArray.map((stat, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} className="block">
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
            <div className="bg-card border border-border p-6 rounded-2xl shadow-lg mt-6">
              <h3 className="text-xl font-bold mb-6 text-foreground">
                Performance by Topic
              </h3>
              <div className="space-y-4">
                {quizStats.topicWise.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-foreground font-medium">{item.topic}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.accuracy}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-emerald-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Feature Navigation Cards */}
        <section className="pb-12 border-t border-border/60 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-center w-full text-foreground relative z-10">
              <span className="bg-background px-4 text-emerald-400">Practice Modules</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(feature.route)}
                className="cursor-pointer bg-card border border-border p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
              >
                {feature.icon}
                <h2 className="text-2xl font-bold font-headline text-emerald-400 mb-2">
                  {feature.title}
                </h2>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
