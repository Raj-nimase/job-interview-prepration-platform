import { createContext, useState, useEffect, useRef } from "react";
import { MAX_QUESTIONS } from "../constants/interview.constants";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  // ─── Setup state ───────────────────────────────────────────────────────────
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interviewType, setInterviewType] = useState("Technical"); // Technical | Behavioral | Mixed
  const [personaStyle, setPersonaStyle] = useState("Neutral");     // Friendly | Neutral | Skeptical
  const [jobDescription, setJobDescription] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [includeBookmarked, setIncludeBookmarked] = useState(false);

  // ─── Session state ─────────────────────────────────────────────────────────
  const [question, setQuestion] = useState("");
  const [questionTopic, setQuestionTopic] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("medium");
  const [userAnswer, setUserAnswer] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);
  const [started, setStarted] = useState(false);

  // ─── Loading state ─────────────────────────────────────────────────────────
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [questionError, setQuestionError] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);

  // ─── Timer state ────────────────────────────────────────────────────────────
  const [questionTimeLimit, setQuestionTimeLimit] = useState(120); // seconds
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef(null);

  // ─── Follow-up state ────────────────────────────────────────────────────────
  const [isFollowUpPhase, setIsFollowUpPhase] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [isCheckingFollowUp, setIsCheckingFollowUp] = useState(false);

  // ─── Clarification state ────────────────────────────────────────────────────
  const [isClarificationPhase, setIsClarificationPhase] = useState(false);
  const [clarificationTimeLeft, setClarificationTimeLeft] = useState(15);
  const [clarificationText, setClarificationText] = useState("");
  const [interviewerClarificationResponse, setInterviewerClarificationResponse] = useState("");
  const [isLoadingClarification, setIsLoadingClarification] = useState(false);
  const clarificationTimerRef = useRef(null);

  // ─── Warmup state ───────────────────────────────────────────────────────────
  const [warmupPhase, setWarmupPhase] = useState(false);
  const [warmupDone, setWarmupDone] = useState(false);
  const [warmupQuestions, setWarmupQuestions] = useState([]);
  const [warmupIndex, setWarmupIndex] = useState(0);
  const [warmupAnswer, setWarmupAnswer] = useState("");
  const [isLoadingWarmup, setIsLoadingWarmup] = useState(false);

  // ─── Audio blob for voice playback in feedback ──────────────────────────────
  const [lastAudioBlob, setLastAudioBlob] = useState(null);

  // ─── Code Panel state ───────────────────────────────────────────────────────
  const [requiresCode, setRequiresCode] = useState(false);
  const [codePrompt, setCodePrompt] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeAnswer, setCodeAnswer] = useState("");

  // ─── Adaptive Session state ──────────────────────────────────────────────────
  const [questionCount, setQuestionCount] = useState(MAX_QUESTIONS);
  const [earlyTerminationReason, setEarlyTerminationReason] = useState(null);
  const [sessionExtended, setSessionExtended] = useState(false);
  const [sessionHealthLog, setSessionHealthLog] = useState([]);
  const [performanceStatus, setPerformanceStatus] = useState('neutral');

  // ─── Restore persistent data from localStorage ─────────────────────────────
  useEffect(() => {
    const storedRole = localStorage.getItem("interviewRole") || "";
    const storedExperience = localStorage.getItem("interviewExperience") || "";
    const storedHistory = localStorage.getItem("interviewHistory");
    const storedType = localStorage.getItem("interviewType") || "Technical";
    const storedPersona = localStorage.getItem("interviewPersona") || "Neutral";
    const storedJD = localStorage.getItem("interviewJD") || "";
    const storedCompany = localStorage.getItem("interviewCompany") || "";

    if (storedRole) setRole(storedRole);
    if (storedExperience) setExperience(storedExperience);
    if (storedType) setInterviewType(storedType);
    if (storedPersona) setPersonaStyle(storedPersona);
    if (storedJD) setJobDescription(storedJD);
    if (storedCompany) setTargetCompany(storedCompany);
    if (storedHistory) {
      try { setHistory(JSON.parse(storedHistory)); } catch { /* ignore */ }
    }
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        // Setup
        role, setRole,
        experience, setExperience,
        interviewType, setInterviewType,
        personaStyle, setPersonaStyle,
        jobDescription, setJobDescription,
        targetCompany, setTargetCompany,
        includeBookmarked, setIncludeBookmarked,

        // Session
        question, setQuestion,
        questionTopic, setQuestionTopic,
        questionDifficulty, setQuestionDifficulty,
        userAnswer, setUserAnswer,
        transcript, setTranscript,
        feedback, setFeedback,
        history, setHistory,
        started, setStarted,

        // Loading
        isLoadingQuestion, setIsLoadingQuestion,
        questionError, setQuestionError,
        isLoadingFeedback, setIsLoadingFeedback,
        isRecording, setIsRecording,
        isTranscribing, setIsTranscribing,
        voiceMode, setVoiceMode,

        // Timer
        questionTimeLimit, setQuestionTimeLimit,
        timeRemaining, setTimeRemaining,
        timerActive, setTimerActive,
        timerExpired, setTimerExpired,
        timeTaken, setTimeTaken,
        timerRef,

        // Follow-up
        isFollowUpPhase, setIsFollowUpPhase,
        followUpQuestion, setFollowUpQuestion,
        followUpAnswer, setFollowUpAnswer,
        isCheckingFollowUp, setIsCheckingFollowUp,

        // Clarification
        isClarificationPhase, setIsClarificationPhase,
        clarificationTimeLeft, setClarificationTimeLeft,
        clarificationText, setClarificationText,
        interviewerClarificationResponse, setInterviewerClarificationResponse,
        isLoadingClarification, setIsLoadingClarification,
        clarificationTimerRef,

        // Warmup
        warmupPhase, setWarmupPhase,
        warmupDone, setWarmupDone,
        warmupQuestions, setWarmupQuestions,
        warmupIndex, setWarmupIndex,
        warmupAnswer, setWarmupAnswer,
        isLoadingWarmup, setIsLoadingWarmup,

        // Audio
        lastAudioBlob, setLastAudioBlob,

        // Code
        requiresCode, setRequiresCode,
        codePrompt, setCodePrompt,
        starterCode, setStarterCode,
        codeLanguage, setCodeLanguage,
        codeAnswer, setCodeAnswer,

        // Adaptive Session
        questionCount, setQuestionCount,
        earlyTerminationReason, setEarlyTerminationReason,
        sessionExtended, setSessionExtended,
        sessionHealthLog, setSessionHealthLog,
        performanceStatus, setPerformanceStatus,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
