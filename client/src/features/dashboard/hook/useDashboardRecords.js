import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardUserRecords } from "../services/dashboard.api";

export function useDashboardRecords() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [interviewStats, setInterviewStats] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [competencyProfile, setCompetencyProfile] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await getDashboardUserRecords();
        setUser(data.user);
        setInterviewStats(data.interviewStats);
        setQuizStats(data.quizStats);
        setResumeHistory(data.resumeHistory);
        setCompetencyProfile(data.competencyProfile || {});
      } catch (error) {
        console.error("[Dashboard] Error initializing:", error?.response?.data || error?.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [navigate]);

  return {
    loading,
    user,
    interviewStats,
    quizStats,
    resumeHistory,
    competencyProfile,
  };
}
