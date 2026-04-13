import { useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/features/auth/context/auth.context";
import { InterviewContext } from "../context/interview.context";
import {
  generateQuestion,
  transcribeAudio,
  getTTS,
  getFeedbackAPI,
  startSession,
  checkFollowUpAPI,
  respondToClarificationAPI,
  generateWarmupAPI,
  bookmarkQuestionAPI,
} from "../services/interview.api";
import { MAX_QUESTIONS } from "../constants/interview.constants";
import { toast } from "react-hot-toast";
import { evaluateSessionHealth } from "../utils/sessionHealth";
import SESSION_HEALTH_CONFIG from "../config/interviewConfig";
export { MAX_QUESTIONS };

// ─── Filler word detection (client-side) ────────────────────────────────────────
const FILLER_WORDS = {
  hesitation: ["um", "uh", "er", "hmm", "uhh"],
  padding: ["like", "you know", "kind of", "sort of", "basically", "literally"],
  starters: ["so", "and so", "i mean", "right", "okay so"],
};

function detectFillerWords(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const totalWords = words.length;
  let count = 0;

  const categories = {};
  Object.entries(FILLER_WORDS).forEach(([cat, fillers]) => {
    let catCount = 0;
    fillers.forEach((filler) => {
      // Count phrase occurrences
      const regex = new RegExp(`\\b${filler}\\b`, "gi");
      const matches = text.match(regex) || [];
      catCount += matches.length;
    });
    if (catCount > 0) categories[cat] = catCount;
    count += catCount;
  });

  const fillerWordRate = totalWords > 0 ? parseFloat(((count / totalWords) * 100).toFixed(1)) : 0;
  return { fillerWordCount: count, fillerWordRate, categories, totalWords };
}

export function useInterview() {
  const nav = useNavigate();
  const ctx = useContext(InterviewContext);
  const { user: authUser } = useContext(AuthContext);
  const userId = authUser?.id || localStorage.getItem("userId");

  // ─── Recording refs (local to this hook instance) ──────────────────────────
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const answerStartTimeRef = useRef(null);

  // ─── TTS ───────────────────────────────────────────────────────────────────
  const playTTS = useCallback(async (text) => {
    try {
      const blob = await getTTS(text);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      // Pause timer while TTS plays, resume after
      ctx.setTimerActive(false);
      audio.onended = () => {
        if (!ctx.feedback && !ctx.isFollowUpPhase) {
          ctx.setTimerActive(true);
        }
      };
      audio.play();
    } catch (err) {
      console.error("TTS error:", err);
    }
  }, [ctx]);

  // ─── Timer management ──────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    ctx.setTimeRemaining(ctx.questionTimeLimit);
    ctx.setTimerExpired(false);
    ctx.setTimerActive(true);
    answerStartTimeRef.current = Date.now();
  }, [ctx]);

  const stopTimer = useCallback(() => {
    ctx.setTimerActive(false);
    if (answerStartTimeRef.current) {
      const taken = Math.round((Date.now() - answerStartTimeRef.current) / 1000);
      ctx.setTimeTaken(taken);
    }
  }, [ctx]);

  // ─── Generate next question ────────────────────────────────────────────────
  const getNextQuestion = useCallback(async (r, exp) => {
    ctx.setIsLoadingQuestion(true);
    ctx.setQuestionError(false);
    ctx.setQuestion("");
    ctx.setUserAnswer("");
    ctx.setTranscript("");
    ctx.setFeedback("");
    ctx.setIsFollowUpPhase(false);
    ctx.setFollowUpQuestion("");
    ctx.setFollowUpAnswer("");
    ctx.setTimerExpired(false);
    ctx.setTimerActive(false);
    ctx.setIsClarificationPhase(false);
    ctx.setClarificationText("");
    ctx.setInterviewerClarificationResponse("");
    ctx.setClarificationTimeLeft(15);
    ctx.setLastAudioBlob(null);
    ctx.setRequiresCode(false);
    ctx.setCodePrompt("");
    ctx.setStarterCode("");
    // We intentionally don't clear codeLanguage so user's choice persists
    ctx.setCodeAnswer("");

    try {
      const options = {
        interviewType: ctx.interviewType,
        personaStyle: ctx.personaStyle,
        jobDescription: ctx.jobDescription || null,
        targetCompany: ctx.targetCompany || null,
        includeBookmarked: ctx.includeBookmarked,
      };
      const data = await generateQuestion(r, exp, ctx.history, options);
      if (data.question) {
        ctx.setQuestion(data.question);
        if (data.topic) ctx.setQuestionTopic(data.topic);
        if (data.difficulty) ctx.setQuestionDifficulty(data.difficulty);
        if (data.codePrompt !== undefined) {
          ctx.setRequiresCode(!!data.codePrompt || !!data.starterCode);
          ctx.setCodePrompt(data.codePrompt || "");
          ctx.setStarterCode(data.starterCode || "");
          // reset code answer since a new starter code might be supplied, 
          // code panel component's useEffect will listen to this change
        }

        // Play TTS then start clarification phase timer
        await playTTS(data.question);
        startClarificationPhase();
      }
    } catch (err) {
      console.error("Next question error:", err);
      ctx.setQuestionError(true);
    } finally {
      ctx.setIsLoadingQuestion(false);
    }
  }, [ctx, playTTS]);

  const retryQuestion = useCallback(() => {
    getNextQuestion(ctx.role, ctx.experience);
  }, [getNextQuestion, ctx.role, ctx.experience]);

  // ─── Clarification phase ───────────────────────────────────────────────────
  const startClarificationPhase = useCallback(() => {
    ctx.setIsClarificationPhase(true);
    ctx.setClarificationTimeLeft(15);

    // Auto-dismiss after 15 seconds
    if (ctx.clarificationTimerRef.current) clearInterval(ctx.clarificationTimerRef.current);
    ctx.clarificationTimerRef.current = setInterval(() => {
      ctx.setClarificationTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(ctx.clarificationTimerRef.current);
          ctx.setIsClarificationPhase(false);
          startTimer(); // start answer timer after clarification window
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [ctx, startTimer]);

  const skipClarification = useCallback(() => {
    if (ctx.clarificationTimerRef.current) clearInterval(ctx.clarificationTimerRef.current);
    ctx.setIsClarificationPhase(false);
    startTimer();
  }, [ctx, startTimer]);

  const submitClarification = useCallback(async () => {
    if (!ctx.clarificationText.trim()) return;
    ctx.setIsLoadingClarification(true);
    if (ctx.clarificationTimerRef.current) clearInterval(ctx.clarificationTimerRef.current);
    ctx.setIsClarificationPhase(false);

    try {
      const data = await respondToClarificationAPI(
        localStorage.getItem("sessionId"),
        ctx.question,
        ctx.clarificationText,
        ctx.role,
        ctx.experience,
        ctx.personaStyle
      );
      ctx.setInterviewerClarificationResponse(data.interviewerResponse || "");
      if (data.interviewerResponse) {
        await playTTS(data.interviewerResponse);
      }
    } catch (err) {
      console.error("Clarification error:", err);
    } finally {
      ctx.setIsLoadingClarification(false);
      startTimer();
    }
  }, [ctx, playTTS, startTimer]);

  // ─── Convert blob to base64 ────────────────────────────────────────────────
  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => { const base64 = reader.result.split(",")[1]; resolve(base64); };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // ─── Auto-submit on timer expiry ───────────────────────────────────────────
  const handleTimerExpiry = useCallback(async () => {
    ctx.setTimerExpired(true);
    ctx.setTimerActive(false);
    stopTimer();

    // If no answer, mark as no answer and move to feedback with a flag
    const currentAnswer = ctx.userAnswer || ctx.transcript || "";
    if (!currentAnswer.trim()) {
      await getFeedbackForAnswer("No answer submitted within time limit.", true);
    } else {
      await getFeedbackForAnswer(currentAnswer, true);
    }
  }, [ctx]);

  // ─── Get feedback for an answer ────────────────────────────────────────────
  const getFeedbackForAnswer = useCallback(async (answerText, timedOut = false) => {
    const fillerData = detectFillerWords(answerText);
    ctx.setIsLoadingFeedback(true);
    try {
      const options = {
        interviewType: ctx.interviewType,
        timeTaken: ctx.timeTaken,
        followUpAnswer: ctx.followUpAnswer || null,
        jobDescription: ctx.jobDescription || null,
        targetCompany: ctx.targetCompany || null,
      };
      const feedbackData = await getFeedbackAPI(
        userId,
        localStorage.getItem("sessionId"),
        ctx.role,
        ctx.experience,
        ctx.question,
        answerText,
        options,
        ctx.codeAnswer,
        ctx.codeLanguage
      );

      // Merge client-side filler data into feedback delivery
      const enrichedFeedback = {
        ...feedbackData,
        delivery: {
          ...(feedbackData.delivery || {}),
          fillerWordCount: fillerData.fillerWordCount,
          fillerWordRate: fillerData.fillerWordRate,
          fillerCategories: fillerData.categories,
          timedOut,
        },
      };
      ctx.setFeedback(enrichedFeedback);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      ctx.setIsLoadingFeedback(false);
    }
  }, [ctx, userId]);

  // ─── Send audio to Gemini STT ──────────────────────────────────────────────
  const sendAudioToBackend = useCallback(async (blob) => {
    ctx.setIsTranscribing(true);
    ctx.setLastAudioBlob(blob); // Store for voice playback
    stopTimer();
    try {
      const audioBase64 = await blobToBase64(blob);
      const mimeType = blob.type || "audio/webm";
      const data = await transcribeAudio(audioBase64, mimeType, ctx.role, ctx.question);
      const text = data.transcript || "";
      ctx.setTranscript(text);
      ctx.setUserAnswer(text);

      if (text.trim()) {
        ctx.setIsLoadingFeedback(true);
        ctx.setIsTranscribing(false);

        // Check if follow-up is needed
        try {
          const followUpCheck = await checkFollowUpAPI(
            localStorage.getItem("sessionId"),
            ctx.question,
            text,
            ctx.role,
            ctx.experience,
            ctx.interviewType
          );

          if (followUpCheck.shouldFollowUp) {
            ctx.setIsLoadingFeedback(false);
            ctx.setIsFollowUpPhase(true);
            ctx.setFollowUpQuestion(followUpCheck.followUpQuestion);
            await playTTS(followUpCheck.followUpQuestion);
            return;
          }
        } catch (err) {
          console.error("Follow-up check error (non-fatal):", err);
        }

        try {
          await getFeedbackForAnswer(text);
        } finally {
          ctx.setIsLoadingFeedback(false);
        }
        return;
      }
    } catch (err) {
      console.error("Transcription error:", err);
      ctx.setTranscript("(Transcription failed — check console)");
    } finally {
      ctx.setIsTranscribing(false);
    }
  }, [ctx, getFeedbackForAnswer, playTTS, stopTimer]);

  // ─── Submit Follow-up Answer ───────────────────────────────────────────────
  const submitFollowUp = useCallback(async (followUpText) => {
    ctx.setFollowUpAnswer(followUpText);
    ctx.setIsFollowUpPhase(false);
    ctx.setIsLoadingFeedback(true);
    try {
      const combinedAnswer = `${ctx.userAnswer}\n\n[Follow-up answer]: ${followUpText}`;
      await getFeedbackForAnswer(combinedAnswer);
    } finally {
      ctx.setIsLoadingFeedback(false);
    }
  }, [ctx, getFeedbackForAnswer]);

  // ─── Start / Stop / Toggle recording ──────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      ctx.setTranscript("");
      ctx.setUserAnswer("");
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 48000, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const blobMime = mimeType.split(";")[0];
        const blob = new Blob(chunksRef.current, { type: blobMime });
        sourceRef.current?.disconnect();
        audioCtxRef.current?.close();
        analyserRef.current = null;
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        await sendAudioToBackend(blob);
      };

      recorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (err) {
      console.error("startRecording error:", err);
      alert("Could not access microphone. Check browser permissions.");
    }
  }, [ctx, sendAudioToBackend]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (ctx.isRecording) {
      stopRecording();
      ctx.setIsRecording(false);
    } else {
      startRecording();
      ctx.setIsRecording(true);
    }
  }, [ctx, startRecording, stopRecording]);

  // ─── Get AI feedback (manual submit for typed answers) ────────────────────
  const submitFeedback = useCallback(async () => {
    ctx.setIsLoadingFeedback(true);
    stopTimer();
    try {
      // Check follow-up first
      const followUpCheck = await checkFollowUpAPI(
        localStorage.getItem("sessionId"),
        ctx.question,
        ctx.userAnswer,
        ctx.role,
        ctx.experience,
        ctx.interviewType
      );
      if (followUpCheck.shouldFollowUp) {
        ctx.setIsFollowUpPhase(true);
        ctx.setFollowUpQuestion(followUpCheck.followUpQuestion);
        await playTTS(followUpCheck.followUpQuestion);
        ctx.setIsLoadingFeedback(false);
        return;
      }
      await getFeedbackForAnswer(ctx.userAnswer);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      ctx.setIsLoadingFeedback(false);
    }
  }, [ctx, getFeedbackForAnswer, playTTS, stopTimer]);

  // ─── Bookmark a question ───────────────────────────────────────────────────
  const bookmarkCurrentQuestion = useCallback(async (bookmarked = true) => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;
    // Last question index = history.length (current is being reviewed)
    const questionIndex = ctx.history.length;
    try {
      await bookmarkQuestionAPI(sessionId, questionIndex, bookmarked);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  }, [ctx]);

  // ─── End interview ─────────────────────────────────────────────────────────
  const endInterview = useCallback((finalHistory) => {
    let h;
    if (Array.isArray(finalHistory)) {
      h = finalHistory;
    } else {
      h = [...ctx.history];
      const q = (ctx.question || "").trim();
      const answer = (ctx.userAnswer || ctx.transcript || "").trim();
      const hasFeedback = ctx.feedback != null && ctx.feedback !== "" && (typeof ctx.feedback !== "string" || ctx.feedback.trim().length > 0);
      const hasCode = ctx.requiresCode && ctx.codeAnswer?.trim()?.length > 0;
      const shouldIncludeCurrent = q.length > 0 && (answer.length > 0 || hasFeedback || hasCode);
      if (shouldIncludeCurrent) {
        const entry = { 
          question: ctx.question, 
          answer: ctx.userAnswer || ctx.transcript || "", 
          feedback: ctx.feedback || "",
          codeAnswer: ctx.codeAnswer,
          codeLanguage: ctx.codeLanguage
        };
        const last = h[h.length - 1];
        if (last && last.question === entry.question) { h = [...h.slice(0, -1), entry]; } else { h.push(entry); }
      }
    }
    stopTimer();
    ctx.setHistory(h);
    localStorage.setItem("interviewHistory", JSON.stringify(h));
    localStorage.setItem("interviewRole", ctx.role || "");
    nav("/summary");
  }, [ctx, stopTimer, nav]);

  // ─── Advance to next question ──────────────────────────────────────────────
  const handleNextQuestion = useCallback(async () => {
    const entry = {
      question: ctx.question,
      answer: ctx.userAnswer || ctx.transcript,
      feedback: ctx.feedback,
      codeAnswer: ctx.codeAnswer,
      codeLanguage: ctx.codeLanguage
    };
    const updatedHistory = [...ctx.history, entry];
    ctx.setHistory(updatedHistory);

    // 1. Run the health evaluation
    const health = evaluateSessionHealth(updatedHistory, ctx.questionCount, ctx.experience);

    // 2. Log this snapshot for the summary chart
    const scores = updatedHistory.map(h => h.feedback?.score || 0);
    const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    ctx.setSessionHealthLog(prev => [...prev, {
      questionIndex: updatedHistory.length,
      avg: parseFloat(avg.toFixed(2)),
      action: health.action,
      reason: health.reason ?? null,
    }]);

    // 3. Update the live performance status indicator
    ctx.setPerformanceStatus(
      avg >= 7.5 ? 'strong'     :
      avg >= 5.0 ? 'on-track'   :
                   'needs-work'
    );

    // 4. Handle the engine's decision
    if (health.action === 'terminate') {
      ctx.setEarlyTerminationReason(health.reason);
      endInterview(updatedHistory);
      return;
    }

    if (health.action === 'extend' && !ctx.sessionExtended) {
      const newCount = Math.min(
        ctx.questionCount + health.extraQuestions,
        SESSION_HEALTH_CONFIG.absoluteMaxQuestions
      );
      ctx.setQuestionCount(newCount);
      ctx.setSessionExtended(true);

      // Show a toast notification to the user
      toast.success(
        health.reason === 'excelling'
          ? `Excellent performance! Adding ${health.extraQuestions} more question${health.extraQuestions > 1 ? 's' : ''}.`
          : `You're improving — adding 1 more question.`
      );
    }

    // 5. Proceed to next question
    ctx.setUserAnswer("");
    ctx.setTranscript("");
    ctx.setFeedback("");
    await getNextQuestion(ctx.role, ctx.experience);
  }, [ctx, endInterview, getNextQuestion]);

  // ─── Warmup flow ───────────────────────────────────────────────────────────
  const beginWarmup = useCallback(async (r, exp) => {
    ctx.setIsLoadingWarmup(true);
    ctx.setWarmupPhase(true);
    ctx.setWarmupDone(false);
    ctx.setWarmupIndex(0);
    ctx.setWarmupAnswer("");
    try {
      const data = await generateWarmupAPI(r, exp);
      ctx.setWarmupQuestions(data.questions || []);
      if (data.questions?.length) {
        await playTTS(data.questions[0]);
      }
    } catch (err) {
      console.error("Warmup error:", err);
      ctx.setWarmupDone(true);
      ctx.setWarmupPhase(false);
    } finally {
      ctx.setIsLoadingWarmup(false);
    }
  }, [ctx, playTTS]);

  const nextWarmup = useCallback(() => {
    const nextIdx = ctx.warmupIndex + 1;
    if (nextIdx >= ctx.warmupQuestions.length) {
      ctx.setWarmupPhase(false);
      ctx.setWarmupDone(true);
      // Start the real interview
      getNextQuestion(ctx.role, ctx.experience);
    } else {
      ctx.setWarmupIndex(nextIdx);
      ctx.setWarmupAnswer("");
      playTTS(ctx.warmupQuestions[nextIdx]);
    }
  }, [ctx, getNextQuestion, playTTS]);

  // ─── Begin interview ────────────────────────────────────────────────────────
  const beginInterview = useCallback(async (overrideRole, overrideExperience) => {
    const r = overrideRole || ctx.role;
    const exp = overrideExperience || ctx.experience;

    if (userId) {
      try {
        const data = await startSession(userId, r, {
          interviewType: ctx.interviewType,
          personaStyle: ctx.personaStyle,
          jobDescription: ctx.jobDescription || "",
          targetCompany: ctx.targetCompany || "",
        });
        localStorage.setItem("sessionId", data.sessionId);
      } catch (error) {
        console.warn("Session creation failed (continuing anyway):", error.message);
      }
    }

    ctx.setStarted(true);
    // Start with warmup
    await beginWarmup(r, exp);
  }, [ctx, userId, beginWarmup]);

  return {
    // context state
    ...ctx,
    // computed
    analyserRef,
    // actions
    playTTS,
    getNextQuestion,
    retryQuestion,
    submitFeedback,
    submitFollowUp,
    toggleRecording,
    endInterview,
    handleNextQuestion,
    beginInterview,
    beginWarmup,
    nextWarmup,
    startTimer,
    stopTimer,
    handleTimerExpiry,
    bookmarkCurrentQuestion,
    startClarificationPhase,
    skipClarification,
    submitClarification,
    getFeedbackForAnswer,
  };
}
