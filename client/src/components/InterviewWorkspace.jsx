import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Volume2,
  Bot,
  Sparkles,
  XCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Keyboard, ListChecks, AlertCircle } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import axios from "axios";

const MAX_QUESTIONS = 5;

// ─── Waveform Visualizer ────────────────────────────────────────────────────────
function WaveformVisualizer({ isRecording, analyserRef }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const drawIdle = () => {
      ctx.clearRect(0, 0, W, H);
      const bars = 48;
      const barW = 3;
      const gap = (W - bars * barW) / (bars + 1);
      ctx.fillStyle = "rgba(0,208,132,0.25)";
      for (let i = 0; i < bars; i++) {
        const x = gap + i * (barW + gap);
        const h = 4;
        ctx.beginPath();
        ctx.roundRect(x, H / 2 - h / 2, barW, h, 2);
        ctx.fill();
      }
    };

    if (!isRecording || !analyserRef.current) {
      drawIdle();
      return;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, W, H);

      const bars = 48;
      const barW = 3;
      const gap = (W - bars * barW) / (bars + 1);

      for (let i = 0; i < bars; i++) {
        const dataIdx = Math.floor((i / bars) * bufferLength * 0.5);
        const val = dataArray[dataIdx] / 255;
        const h = Math.max(4, val * H * 0.85);

        const alpha = 0.4 + val * 0.6;
        ctx.fillStyle = `rgba(0,208,132,${alpha})`;

        const x = gap + i * (barW + gap);
        ctx.beginPath();
        ctx.roundRect(x, H / 2 - h / 2, barW, h, 2);
        ctx.fill();
      }
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording, analyserRef]);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={64}
      className="w-full rounded-lg"
      style={{ background: "rgba(0,208,132,0.05)", display: "block" }}
    />
  );
}

// ─── Recording Timer ──────────────────────────────────────────────────────────
function RecordingTimer({ isRecording }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      setSeconds(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  if (!isRecording) return null;

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <span className="text-red-400 font-mono text-sm font-semibold animate-pulse">
      ● {mins}:{secs}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function InterviewWorkspace() {
  const [role, setRole] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [experience, setExperience] = useState("");
  const [transcript, setTranscript] = useState("");
  const [started, setStarted] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true); // true = voice, false = text

  const router = useNavigate();
  const userId = localStorage.getItem("userId");

  // ─── Refs for Recording ────────────────────────────────────────────────────
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // ─── Unlock Audio context on first user interaction ────────────────────────
  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio();
      audio.play().catch(() => {});
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  // ─── Load role/experience from localStorage ───────────────────────────────
  useEffect(() => {
    const storedRole = localStorage.getItem("interviewRole");
    const storedExperience = localStorage.getItem("interviewExperience");

    if (!storedRole || !storedExperience) {
      router("/");
    } else {
      setRole(storedRole);
      setExperience(storedExperience);
    }
  }, []);

  // ─── TTS ───────────────────────────────────────────────────────────────────
  const playTTS = async (text) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/interview/tts",
        { text },
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(res.data);
      new Audio(url).play();
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  // ─── Generate next question ────────────────────────────────────────────────
  const getNextQuestion = async (r, exp) => {
    setIsLoadingQuestion(true);
    setQuestion("");
    setUserAnswer("");
    setTranscript("");
    setFeedback("");

    try {
      const res = await axios.post(
        "http://localhost:4000/interview/generate_question",
        { role: r, experience: exp },
      );
      if (res.data.question) {
        setQuestion(res.data.question);
        playTTS(res.data.question);
      }
    } catch (err) {
      console.error("Next question error:", err);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // ─── Convert blob to base64 ────────────────────────────────────────────────
  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // result is "data:<mime>;base64,<data>" — strip the prefix
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // ─── Send audio (base64) to Gemini STT backend ────────────────────────────
  const sendAudioToBackend = async (blob) => {
    setIsTranscribing(true);
    try {
      const audioBase64 = await blobToBase64(blob);
      const mimeType = blob.type || "audio/webm";

      const res = await axios.post(
        "http://localhost:4000/interview/transcribe",
        {
          audioBase64,
          mimeType,
          role,
          question,
        },
      );

      const text = res.data.transcript || "";
      setTranscript(text);
      setUserAnswer(text);
    } catch (err) {
      console.error("Transcription error:", err);
      setTranscript("(Transcription failed — check console)");
    } finally {
      setIsTranscribing(false);
    }
  };

  // ─── Start recording + Web Audio analyser ────────────────────────────────
  const startRecording = async () => {
    try {
      setTranscript("");
      setUserAnswer("");
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

      // Set up Web Audio analyser for waveform
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Choose best supported mime type
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
        const blobMime = mimeType.split(";")[0]; // e.g. "audio/webm"
        const blob = new Blob(chunksRef.current, { type: blobMime });

        // Cleanup audio graph
        sourceRef.current?.disconnect();
        audioCtxRef.current?.close();
        analyserRef.current = null;

        // Stop mic tracks
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
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  // ─── Get feedback ─────────────────────────────────────────────────────────
  const getFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const res = await axios.post("http://localhost:4000/interview/feedback", {
        userId,
        role,
        experience,
        question,
        answer: userAnswer,
      });
      setFeedback(res.data);
    } catch (err) {
      console.error("Feedback error:", err);
      alert("Error getting feedback");
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // ─── Next question ─────────────────────────────────────────────────────────
  const handleNextQuestion = () => {
    const entry = { question, answer: userAnswer || transcript, feedback };
    const nextCount = history.length + 1;
    setHistory((prev) => [...prev, entry]);

    if (nextCount >= MAX_QUESTIONS) {
      endInterview([...history, entry]);
    } else {
      setUserAnswer("");
      setTranscript("");
      setFeedback("");
      getNextQuestion(role, experience);
    }
  };

  // ─── End interview ─────────────────────────────────────────────────────────
  const endInterview = (finalHistory) => {
    const h = finalHistory || history;
    localStorage.setItem("interviewHistory", JSON.stringify(h));
    localStorage.setItem("interviewRole", role || "");
    setStarted(false);
    router("/summary");
  };

  const progressValue = (history.length / MAX_QUESTIONS) * 100;

  // ─── Skeleton while role loads ─────────────────────────────────────────────
  if (!role) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="w-full max-w-4xl space-y-8 p-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  // ─── Pre-interview tips screen ─────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl backdrop-blur-sm mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#00d084]">
            Before You Start
          </h2>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <span className="p-2 bg-[#00d084]/10 rounded-full">
                <Mic className="text-[#00d084]" size={20} />
              </span>
              <div>
                <p className="font-semibold">Good Microphone</p>
                <p className="text-sm text-gray-400">
                  Use a quality microphone for better recognition accuracy.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="p-2 bg-[#00d084]/10 rounded-full">
                <Volume2 className="text-[#00d084]" size={20} />
              </span>
              <div>
                <p className="font-semibold">Speak Clearly</p>
                <p className="text-sm text-gray-400">
                  Moderate pace ensures accurate Gemini STT transcription.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="p-2 bg-[#00d084]/10 rounded-full">
                <AlertCircle className="text-[#00d084]" size={20} />
              </span>
              <div>
                <p className="font-semibold">Quiet Environment</p>
                <p className="text-sm text-gray-400">
                  Minimize background noise for clean transcription.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="p-2 bg-[#00d084]/10 rounded-full">
                <Keyboard className="text-[#00d084]" size={20} />
              </span>
              <div>
                <p className="font-semibold">Fallback to Typing</p>
                <p className="text-sm text-gray-400">
                  You can always type your answer if voice isn't accurate.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="p-2 bg-[#00d084]/10 rounded-full">
                <ListChecks className="text-[#00d084]" size={20} />
              </span>
              <div>
                <p className="font-semibold">5 Questions Total</p>
                <p className="text-sm text-gray-400">
                  Each answer is analysed by AI and you get detailed feedback.
                </p>
              </div>
            </li>
          </ul>

          {/* Gemini STT badge */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs font-semibold">
              ✦ Powered by Gemini STT
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold">
              Browser MediaRecorder API
            </span>
          </div>
        </div>

        <button
          onClick={async () => {
            // Only create a DB session when a logged-in userId is available
            if (userId) {
              try {
                const res = await axios.post(
                  "http://localhost:4000/api/session/start_session",
                  { userId, role },
                );
                localStorage.setItem("sessionId", res.data.sessionId);
              } catch (error) {
                console.warn(
                  "Session creation failed (continuing anyway):",
                  error.message,
                );
              }
            }
            setStarted(true);
            getNextQuestion(role, experience);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-12 py-4 text-lg font-bold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
        >
          Start Interview
        </button>
      </div>
    );
  }

  // ─── Live Interview Screen ─────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Interview for <span className="text-[#00d084]">{role}</span>
          </h1>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-md py-2 text-white px-4 w-fit border-2"
            >
              Question {Math.min(history.length + 1, MAX_QUESTIONS)} of{" "}
              {MAX_QUESTIONS}
            </Badge>
          </div>
        </header>

        {/* Progress bar */}
        <Progress
          value={progressValue}
          className="w-full h-2 rounded-full bg-white/10"
        />

        {/* Question Card */}
        <Card className="shadow-xl border-t-4 border-emerald-600 bg-[#1e293b]">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="p-2 bg-emerald-500/10 rounded-full">
                <Bot className="text-emerald-400 shrink-0" size={24} />
              </span>
              <CardTitle className="text-xl font-semibold text-white">
                Question
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => playTTS(question)}
              disabled={isLoadingQuestion}
              className="text-gray-400 hover:text-white"
            >
              <Volume2 />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoadingQuestion ? (
              <div className="space-y-2 pt-2">
                <Skeleton className="h-6 w-full bg-white/10" />
                <Skeleton className="h-6 w-3/4 bg-white/10" />
              </div>
            ) : (
              <p className="text-xl font-medium text-white/90 leading-relaxed">
                {question}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Answer Card */}
        <Card className="shadow-xl bg-[#1e293b] border border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">
                Your Answer
              </CardTitle>
              {/* Mode Toggle */}
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setVoiceMode(true)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    voiceMode
                      ? "bg-emerald-500 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Mic className="inline w-3.5 h-3.5 mr-1" />
                  Voice
                </button>
                <button
                  onClick={() => setVoiceMode(false)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    !voiceMode
                      ? "bg-emerald-500 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Keyboard className="inline w-3.5 h-3.5 mr-1" />
                  Type
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {voiceMode ? (
              /* ── Voice Mode UI ──────────────────────────────────────────── */
              <div className="space-y-4">
                {/* Waveform area */}
                <div
                  className={`rounded-xl border-2 p-4 transition-all duration-300 ${
                    isRecording
                      ? "border-red-500/60 bg-red-500/5"
                      : isTranscribing
                        ? "border-blue-500/60 bg-blue-500/5"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  <WaveformVisualizer
                    isRecording={isRecording}
                    analyserRef={analyserRef}
                  />

                  {/* Status text */}
                  <div className="mt-3 flex items-center justify-center gap-2 min-h-[24px]">
                    {isRecording && (
                      <>
                        <span className="text-red-400 text-sm">Recording…</span>
                        <RecordingTimer isRecording={isRecording} />
                      </>
                    )}
                    {isTranscribing && !isRecording && (
                      <span className="flex items-center gap-2 text-blue-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transcribing with Gemini…
                      </span>
                    )}
                    {!isRecording && !isTranscribing && !transcript && (
                      <span className="text-gray-500 text-sm">
                        Press the microphone below to start speaking
                      </span>
                    )}
                    {!isRecording && !isTranscribing && transcript && (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Transcription complete
                      </span>
                    )}
                  </div>
                </div>

                {/* Large mic button */}
                <div className="flex justify-center">
                  <button
                    onClick={toggleRecording}
                    disabled={isTranscribing || !!feedback || isLoadingQuestion}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                      ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/40 shadow-2xl"
                          : "bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-emerald-500/30"
                      }`}
                  >
                    {/* Pulse rings when recording */}
                    {isRecording && (
                      <>
                        <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-60" />
                        <span className="absolute inset-[-8px] rounded-full border border-red-400/40 animate-ping animation-delay-150" />
                      </>
                    )}
                    {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                </div>

                {/* Transcript display */}
                {(transcript || isTranscribing) && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
                      Transcript
                    </p>
                    {isTranscribing && !transcript ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <Skeleton className="h-4 w-4/5 bg-white/10" />
                      </div>
                    ) : (
                      <p className="text-white/80 text-base leading-relaxed">
                        {transcript}
                      </p>
                    )}
                  </div>
                )}

                {/* Edit transcript field */}
                {transcript && !isTranscribing && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">
                      Edit if needed
                    </p>
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      rows={4}
                      placeholder="Edit your transcribed answer here…"
                      className="bg-white/5 border-white/10 text-white text-base resize-none"
                      disabled={!!feedback || isLoadingFeedback}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* ── Text Mode UI ───────────────────────────────────────────── */
              <Textarea
                placeholder="Type your answer here…"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={8}
                className="bg-white/5 border-white/10 text-white text-base resize-none"
                disabled={isLoadingFeedback || !!feedback}
              />
            )}
          </CardContent>

          <CardFooter>
            <Button
              onClick={getFeedback}
              disabled={
                !userAnswer.trim() ||
                isLoadingFeedback ||
                !!feedback ||
                isTranscribing
              }
              className="h-12 px-6 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isLoadingFeedback ? "Analysing…" : "Get AI Feedback"}
            </Button>
          </CardFooter>
        </Card>

        {/* Feedback Card */}
        {(isLoadingFeedback || feedback) && (
          <Card className="shadow-xl border-t-4 border-[#00d084] bg-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-3 text-white">
                <Sparkles className="text-[#00d084]" />
                AI Feedback
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoadingFeedback ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full bg-white/10" />
                  <Skeleton className="h-5 w-full bg-white/10" />
                  <Skeleton className="h-5 w-5/6 bg-white/10" />
                </div>
              ) : (
                feedback && (
                  <div className="space-y-4 text-white/90">
                    {typeof feedback === "object" &&
                      feedback.score !== undefined && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                            Score
                          </span>
                          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 font-bold text-lg">
                            {feedback.score}/10
                          </span>
                        </div>
                      )}

                    <div
                      className="prose prose-invert prose-base max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: (typeof feedback === "string"
                          ? feedback
                          : feedback.feedback || ""
                        ).replace(/\n/g, "<br />"),
                      }}
                    />

                    {typeof feedback === "object" &&
                      Array.isArray(feedback.strengths) &&
                      feedback.strengths.length > 0 && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                          <h4 className="font-semibold text-emerald-400 mb-2">
                            ✓ Strengths
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {feedback.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {typeof feedback === "object" &&
                      Array.isArray(feedback.weaknesses) &&
                      feedback.weaknesses.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <h4 className="font-semibold text-red-400 mb-2">
                            ✗ Areas to Improve
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {feedback.weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {typeof feedback === "object" &&
                      Array.isArray(feedback.suggestions) &&
                      feedback.suggestions.length > 0 && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-400 mb-2">
                            → Suggestions
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {feedback.suggestions.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="destructive"
            onClick={() => endInterview()}
            className="h-12 px-6 text-base cursor-pointer"
          >
            <XCircle className="mr-2 h-5 w-5" />
            End Interview
          </Button>

          {!isLoadingQuestion && !isLoadingFeedback && !!question && (
            <Button
              onClick={handleNextQuestion}
              className="h-12 px-6 text-base bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              {history.length + 1 >= MAX_QUESTIONS
                ? "Finish & See Summary"
                : "Next Question"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
