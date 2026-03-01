import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as authApi from "../features/auth/services/auth.api";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [interviewStats, setInterviewStats] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // first ask server for current user; cookie sent automatically
    const initialize = async () => {
      try {
        const me = await authApi.getMe();
        if (!me.user || !me.user.id) {
          throw new Error("no user returned");
        }
        setUser(me.user);

        const interviewRes = await axios.get(
          `http://localhost:4000/dashboard/userData/${me.user.id}`,
        );
        const quizRes = await axios.get(
          `http://localhost:4000/dashboard/quiz-stats/${me.user.id}`,
        );
        // if (process.env.NODE_ENV === "development") {
        //   console.log("[Dashboard] Stats loaded:", {
        //     interview: interviewRes.data,
        //     quiz: quizRes.data,
        //   });
        // }

        setInterviewStats(interviewRes.data);
        setQuizStats(quizRes.data);
      } catch (error) {
        // unauthorized or other error
        console.error(
          "[Dashboard] Error initializing:",
          error.response?.data || error.message,
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground text-xl">
        Loading Dashboard...
      </div>
    );
  }

  const features = [
    {
      title: "Take Interview",
      description: "Practice live interviews and improve your skills.",
      route: "/interview",
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
  ];

  const quizStatsArray = [
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
  const interviewStatsArray = interviewStats
    ? [
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
      ]
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-10 mt-24 sm:pt-28 ">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-10"
      >
        Welcome Back, <span className="text-emerald-400">{user.name}</span> 👋
      </motion.h1>

      {/* Interview Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10">
        {interviewStatsArray.length ? (
          interviewStatsArray.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300"
            >
              {stat.icon}
              <h2 className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </h2>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))
        ) : (
          <p className="col-span-4 text-center text-muted-foreground">
            No interview stats available
          </p>
        )}
      </div>

      {interviewStats?.recentSessions?.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4  text-emerald-400">
            Recent Interview Sessions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-foreground">
                  <th className="p-3 border-b border-border">Role</th>
                  <th className="p-3 border-b border-border">Score</th>
                  <th className="p-3 border-b border-border">
                    Questions Attempted
                  </th>
                </tr>
              </thead>
              <tbody>
                {interviewStats.recentSessions.map((session, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition">
                    <td className="p-3 border-b border-border">
                      {session.role}
                    </td>
                    <td className="p-3 border-b border-border">
                      {session.overallScore}
                    </td>
                    <td className="p-3 border-b border-border">
                      {session.questionsAttempted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quiz Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10 mt-16">
        {quizStats ? (
          quizStatsArray.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300"
            >
              {stat.icon}
              <h2 className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </h2>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                  <span className="text-foreground font-medium">
                    {item.topic}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.accuracy}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-emerald-400 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${item.accuracy}%` }}
                  ></div>
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
