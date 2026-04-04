import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/features/auth/context/auth.context";
import { InterviewContext } from "../context/interview.context";
import {
  generateQuestion,
  transcribeAudio,
  getTTS,
  getFeedbackAPI,
  startSession,
} from "../services/interview.api";
import { MAX_QUESTIONS } from "../constants/interview.constants";
export { MAX_QUESTIONS };

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

  // ─── TTS ───────────────────────────────────────────────────────────────────
  const playTTS = async (text) => {
    try {
      const blob = await getTTS(text);
      const url = URL.createObjectURL(blob);
      new Audio(url).play();
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  // ─── Generate next question ────────────────────────────────────────────────
  const getNextQuestion = async (r, exp) => {
    ctx.setIsLoadingQuestion(true);
    ctx.setQuestion("");
    ctx.setUserAnswer("");
    ctx.setTranscript("");
    ctx.setFeedback("");
    try {
      const data = await generateQuestion(r, exp);
      if (data.question) {
        ctx.setQuestion(data.question);
        playTTS(data.question);
      }
    } catch (err) {
      console.error("Next question error:", err);
    } finally {
      ctx.setIsLoadingQuestion(false);
    }
  };

  // ─── Convert blob to base64 ────────────────────────────────────────────────
  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // ─── Send audio to Gemini STT + auto-trigger AI feedback ──────────────────
  const sendAudioToBackend = async (blob) => {
    ctx.setIsTranscribing(true);
    try {
      const audioBase64 = await blobToBase64(blob);
      const mimeType = blob.type || "audio/webm";
      const data = await transcribeAudio(
        audioBase64,
        mimeType,
        ctx.role,
        ctx.question,
      );
      const text = data.transcript || "";
      ctx.setTranscript(text);
      ctx.setUserAnswer(text);

      // Auto-trigger AI feedback right after transcription succeeds
      if (text.trim()) {
        ctx.setIsLoadingFeedback(true); // set before clearing transcribing to avoid UI flash
        ctx.setIsTranscribing(false);
        try {
          const feedbackData = await getFeedbackAPI(
            userId,
            ctx.role,
            ctx.experience,
            ctx.question,
            text, // pass transcript directly (React state may not be flushed yet)
          );
          ctx.setFeedback(feedbackData);
        } catch (err) {
          console.error("Auto-feedback error:", err);
          // Don't alert — user can retry via the fallback button
        } finally {
          ctx.setIsLoadingFeedback(false);
        }
        return; // already cleared isTranscribing above
      }
    } catch (err) {
      console.error("Transcription error:", err);
      ctx.setTranscript("(Transcription failed — check console)");
    } finally {
      ctx.setIsTranscribing(false);
    }
  };

  // ─── Start recording + Web Audio analyser ────────────────────────────────
  const startRecording = async () => {
    try {
      ctx.setTranscript("");
      ctx.setUserAnswer("");
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
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
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

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
  };

  // ─── Stop recording ────────────────────────────────────────────────────────
  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  };

  // ─── Toggle recording ──────────────────────────────────────────────────────
  const toggleRecording = () => {
    if (ctx.isRecording) {
      stopRecording();
      ctx.setIsRecording(false);
    } else {
      startRecording();
      ctx.setIsRecording(true);
    }
  };

  // ─── Get AI feedback ──────────────────────────────────────────────────────
  const submitFeedback = async () => {
    ctx.setIsLoadingFeedback(true);
    try {
      const data = await getFeedbackAPI(
        userId,
        ctx.role,
        ctx.experience,
        ctx.question,
        ctx.userAnswer,
      );
      ctx.setFeedback(data);
    } catch (err) {
      console.error("Feedback error:", err);
      alert("Error getting feedback");
    } finally {
      ctx.setIsLoadingFeedback(false);
    }
  };

  // ─── End interview ─────────────────────────────────────────────────────────
  // When `finalHistory` is passed (e.g. after the last "Next"), use it as-is.
  // When called with no args, merge the current in-progress turn so partial
  // sessions still appear on the summary.
  const endInterview = (finalHistory) => {
    let h;
    if (Array.isArray(finalHistory)) {
      h = finalHistory;
    } else {
      h = [...ctx.history];
      const q = (ctx.question || "").trim();
      const answer = (ctx.userAnswer || ctx.transcript || "").trim();
      const hasFeedback =
        ctx.feedback != null &&
        ctx.feedback !== "" &&
        (typeof ctx.feedback !== "string" || ctx.feedback.trim().length > 0);

      const shouldIncludeCurrent =
        q.length > 0 && (answer.length > 0 || hasFeedback);

      if (shouldIncludeCurrent) {
        const entry = {
          question: ctx.question,
          answer: ctx.userAnswer || ctx.transcript || "",
          feedback: ctx.feedback || "",
        };
        const last = h[h.length - 1];
        if (last && last.question === entry.question) {
          h = [...h.slice(0, -1), entry];
        } else {
          h.push(entry);
        }
      }
    }

    ctx.setHistory(h);
    localStorage.setItem("interviewHistory", JSON.stringify(h));
    localStorage.setItem("interviewRole", ctx.role || "");
    // Do not setStarted(false) here — InterviewWorkspace would re-render on /interview
    // with started=false and redirect to /selectRole before /summary applies.
    // InterviewSummary sets started false on mount instead.
    nav("/summary");
  };

  // ─── Advance to next question ──────────────────────────────────────────────
  const handleNextQuestion = () => {
    const entry = {
      question: ctx.question,
      answer: ctx.userAnswer || ctx.transcript,
      feedback: ctx.feedback,
    };
    const nextCount = ctx.history.length + 1;
    const updatedHistory = [...ctx.history, entry];
    ctx.setHistory(updatedHistory);

    if (nextCount >= MAX_QUESTIONS) {
      endInterview(updatedHistory);
    } else {
      ctx.setUserAnswer("");
      ctx.setTranscript("");
      ctx.setFeedback("");
      getNextQuestion(ctx.role, ctx.experience);
    }
  };

  // ─── Begin interview (create DB session + load first question) ─────────────
  // Accepts optional role/experience params since React state updates are async
  const beginInterview = async (overrideRole, overrideExperience) => {
    const r = overrideRole || ctx.role;
    const exp = overrideExperience || ctx.experience;

    if (userId) {
      try {
        const data = await startSession(userId, r);
        localStorage.setItem("sessionId", data.sessionId);
      } catch (error) {
        console.warn(
          "Session creation failed (continuing anyway):",
          error.message,
        );
      }
    }
    ctx.setStarted(true);
    getNextQuestion(r, exp);
  };

  return {
    // context state
    ...ctx,
    // actions
    playTTS,
    getNextQuestion,
    submitFeedback,
    toggleRecording,
    endInterview,
    handleNextQuestion,
    beginInterview,
  };
}
