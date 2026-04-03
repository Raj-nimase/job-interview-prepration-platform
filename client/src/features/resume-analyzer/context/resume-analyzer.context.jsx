import { createContext, useState } from "react";

export const ResumeAnalyzerContext = createContext();

export function ResumeAnalyzerProvider({ children }) {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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
      }}
    >
      {children}
    </ResumeAnalyzerContext.Provider>
  );
}
