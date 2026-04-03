import { useContext } from "react";
import { ResumeAnalyzerContext } from "../context/resume-analyzer.context";
import {
  analyzeResumeAPI,
  getAnalysisHistoryAPI,
} from "../services/resume-analyzer.api";

export function useResumeAnalyzer() {
  const ctx = useContext(ResumeAnalyzerContext);
  const userId = localStorage.getItem("userId");

  const submitResume = async () => {
    if (!ctx.file) {
      ctx.setError("Please upload a PDF file");
      return;
    }

    ctx.setError("");
    ctx.setAnalysis(null);
    ctx.setIsAnalyzing(true);

    try {
      const data = await analyzeResumeAPI(ctx.file, ctx.targetRole, userId);
      ctx.setAnalysis(data);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to analyze resume";
      ctx.setError(message);
    } finally {
      ctx.setIsAnalyzing(false);
    }
  };

  const fetchHistory = async () => {
    if (!userId) return;
    ctx.setIsLoadingHistory(true);
    try {
      const data = await getAnalysisHistoryAPI(userId);
      ctx.setHistory(data.analyses || []);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      ctx.setIsLoadingHistory(false);
    }
  };

  const resetAnalysis = () => {
    ctx.setFile(null);
    ctx.setAnalysis(null);
    ctx.setError("");
    ctx.setTargetRole("");
  };

  return {
    ...ctx,
    submitResume,
    fetchHistory,
    resetAnalysis,
  };
}
