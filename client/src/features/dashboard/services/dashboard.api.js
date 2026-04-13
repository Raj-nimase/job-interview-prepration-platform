import axios from "axios";
import * as authApi from "../../auth/services/auth.api";
import { getAnalysisHistoryAPI } from "../../resume-analyzer/services/resume-analyzer.api";
import { getCompetencyProfileAPI } from "../../interview/services/interview.api";

const API_BASE = "http://localhost:4000";

export async function getDashboardUserRecords() {
  const me = await authApi.getMe();
  const userId = me?.user?.id;
  if (!userId) throw new Error("User id missing");

  const [interviewRes, quizRes, resumeHistoryRes, competencyData] = await Promise.all([
    axios.get(`${API_BASE}/dashboard/userData/${userId}`),
    axios.get(`${API_BASE}/dashboard/quiz-stats/${userId}`),
    getAnalysisHistoryAPI(userId),
    getCompetencyProfileAPI(userId).catch(() => ({ profile: {} })) // fallback if it fails
  ]);

  return {
    user: me.user,
    interviewStats: interviewRes.data,
    quizStats: quizRes.data,
    resumeHistory: resumeHistoryRes?.analyses || [],
    competencyProfile: competencyData?.profile || {},
  };
}
