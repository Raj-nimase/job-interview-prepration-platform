import { createContext, useState, useEffect } from "react";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);
  const [started, setStarted] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);

  // Restore persistent data from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("interviewRole") || "";
    const storedExperience = localStorage.getItem("interviewExperience") || "";
    const storedHistory = localStorage.getItem("interviewHistory");

    if (storedRole) setRole(storedRole);
    if (storedExperience) setExperience(storedExperience);
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        role,
        setRole,
        experience,
        setExperience,
        question,
        setQuestion,
        userAnswer,
        setUserAnswer,
        transcript,
        setTranscript,
        feedback,
        setFeedback,
        history,
        setHistory,
        started,
        setStarted,
        isLoadingQuestion,
        setIsLoadingQuestion,
        isLoadingFeedback,
        setIsLoadingFeedback,
        isRecording,
        setIsRecording,
        isTranscribing,
        setIsTranscribing,
        voiceMode,
        setVoiceMode,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
