import { createContext, useEffect, useMemo, useState } from "react";

export const ResumeAnalyzerContext = createContext();

const STORAGE_KEYS = {
  analysis: "resumeAnalyzer.latestAnalysis",
  targetRole: "resumeAnalyzer.latestTargetRole",
};

function safeParse(jsonValue, fallback = null) {
  if (!jsonValue) return fallback;
  try {
    return JSON.parse(jsonValue);
  } catch {
    return fallback;
  }
}

// view states: "upload" | "analyzing" | "results"
export function ResumeAnalyzerProvider({ children }) {
  const initialAnalysis = useMemo(
    () => safeParse(localStorage.getItem(STORAGE_KEYS.analysis), null),
    [],
  );
  const initialTargetRole = localStorage.getItem(STORAGE_KEYS.targetRole) || "";

  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [justAnalyzed, setJustAnalyzed] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [view, setView] = useState(initialAnalysis ? "results" : "upload"); // "upload" | "analyzing" | "results"

  useEffect(() => {
    if (analysis) {
      localStorage.setItem(STORAGE_KEYS.analysis, JSON.stringify(analysis));
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.analysis);
  }, [analysis]);

  useEffect(() => {
    if (targetRole?.trim()) {
      localStorage.setItem(STORAGE_KEYS.targetRole, targetRole);
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.targetRole);
  }, [targetRole]);

  return (
    <ResumeAnalyzerContext.Provider
      value={{
        file,
        setFile,
        targetRole,
        setTargetRole,
        analysis,
        setAnalysis,
        isAnalyzing,
        setIsAnalyzing,
        justAnalyzed,
        setJustAnalyzed,
        error,
        setError,
        history,
        setHistory,
        isLoadingHistory,
        setIsLoadingHistory,
        view,
        setView,
      }}
    >
      {children}
    </ResumeAnalyzerContext.Provider>
  );
}
