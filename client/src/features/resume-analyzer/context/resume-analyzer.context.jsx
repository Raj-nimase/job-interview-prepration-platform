import { createContext, useState } from "react";

export const ResumeAnalyzerContext = createContext();

// view states: "upload" | "analyzing" | "results"
export function ResumeAnalyzerProvider({ children }) {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [view, setView] = useState("upload"); // "upload" | "analyzing" | "results"

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
