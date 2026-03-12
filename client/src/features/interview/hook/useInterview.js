import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InterviewContext } from "../context/interview.context";
import {
  generateQuestion,
  transcribeAudio,
  getTTS,
  getFeedbackAPI,
  startSession,
} from "../services/interview.api";

export const MAX_QUESTIONS = 5;

export function useInterview() {
  const nav = useNavigate();
  const ctx = useContext(InterviewContext);
  const userId = localStorage.getItem("userId");

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
  const endInterview = (finalHistory) => {
    const h = finalHistory || ctx.history;
    localStorage.setItem("interviewHistory", JSON.stringify(h));
    localStorage.setItem("interviewRole", ctx.role || "");
    ctx.setStarted(false);
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
    ctx.setHistory((prev) => [...prev, entry]);

    if (nextCount >= MAX_QUESTIONS) {
      endInterview([...ctx.history, entry]);
    } else {
      ctx.setUserAnswer("");
      ctx.setTranscript("");
      ctx.setFeedback("");
      getNextQuestion(ctx.role, ctx.experience);
    }
  };

  // ─── Begin interview (create DB session + load first question) ─────────────
  const beginInterview = async () => {
    if (userId) {
      try {
        const data = await startSession(userId, ctx.role);
        localStorage.setItem("sessionId", data.sessionId);
      } catch (error) {
        console.warn(
          "Session creation failed (continuing anyway):",
          error.message,
        );
      }
    }
    ctx.setStarted(true);
    getNextQuestion(ctx.role, ctx.experience);
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
