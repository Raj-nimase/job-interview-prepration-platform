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
} from "lucide-react";

import { Keyboard, ListChecks, AlertCircle } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import axios from "axios";

const MAX_QUESTIONS = 5;

// Uncomment when implementing
// const SpeechRecognition =
//   (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

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
  const [experience, setExperience] = useState("");

  const lastPlayedRef = useRef(null);

  const recognitionRef = useRef(null);
  const router = useNavigate();
  const [started, setStarted] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [answering, setAnswering] = useState(false);

  const userId = localStorage.getItem("userId");

  const playTTS = async (question) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/interview/tts",
        { text: question },
        { responseType: "blob" } // important for binary audio
      );

      const url = URL.createObjectURL(res.data);
      new Audio(url).play();
    } catch (err) {
      console.error("TTS error:", err);
      alert("TTS failed (see console).");
    }
  };

  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio();
      audio.play().catch(() => {}); // silent unlock
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
  }, []);

  const getNextQuestion = async (r, experience) => {
    setIsLoadingQuestion(true);
    setCurrentQuestion("");
    setUserAnswer("");
    setFeedback("");
    console.log(experience);

    try {
      const res = await axios.post(
        "http://localhost:4000/interview/generate_question",
        {
          role: r,
          experience: experience,
        }
      );

      if (res.data.question) {
        setQuestion(res.data.question);
        setTranscript("");
        setFeedback(null);
        playTTS(res.data.question);
      }
    } catch (err) {
      console.error("Next question error:", err);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("interviewRole");
    const storedExperience = localStorage.getItem("interviewExperience");

    if (!storedRole || !storedExperience) {
      router("/"); // redirect if missing
    } else {
      setRole(storedRole);
      setExperience(storedExperience); // new state
    }
  }, []);

  const startRecording = async () => {
    try {
      setTranscript("");
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

      const options = { mimeType: "audio/webm;codecs=opus" };
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(blob, "answer.webm");

        // Stop mic stream
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorderRef.current = mediaRecorder;
      mediaRecorder.start();
      console.log("🎙 Recording started");
    } catch (err) {
      console.error("startRecording error:", err);
      alert("Could not start recording. Check microphone permissions.");
    }
  };

  const sendAudioToBackend = async (fileOrBlob, filename) => {
    try {
      const form = new FormData();
      form.append("file", fileOrBlob, filename);
      form.append("role", role);
      form.append("question", question);

      const res = await axios.post(
        "http://localhost:4000/interview/transcribe",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Transcription response:", res.data);
      setTranscript(res.data.transcript || "(No text detected)");
    } catch (err) {
      console.error("Upload/transcribe error:", err);
      setTranscript("(Transcription failed - see console)");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      console.log("⏹ Recording stopped");
    }
  };

  const getFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const res = await axios.post("http://localhost:4000/interview/feedback", {
        userId,
        role,
        experience, // new
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

  const handleNextQuestion = () => {
    const entry = { question, answer: transcript || userAnswer, feedback };
    const nextCount = history.length + 1;

    setHistory((prev) => [...prev, entry]);

    if (nextCount >= MAX_QUESTIONS) {
      endInterview();
    } else {
      setUserAnswer("");
      setFeedback("");
      getNextQuestion(role, experience);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  const endInterview = () => {
    window.speechSynthesis.cancel();
    localStorage.setItem("interviewHistory", JSON.stringify(history));
    localStorage.setItem("interviewRole", role || "");
    setStarted(false);
    router("/summary");
  };

  if (!role) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-4xl space-y-8 p-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  const progressValue = (history.length / MAX_QUESTIONS) * 100;

  if (!started) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white transition-all duration-600 ease-in p-6">
          {/* Tips Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-2xl shadow-lg backdrop-blur-sm mb-8 fade-in-up">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#00d084]">
              Before You Start
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mic className="text-[#00d084] shrink-0 mt-1" />
                <span>
                  Use a good quality microphone for better voice recognition.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Volume2 className="text-[#00d084] shrink-0 mt-1" />
                <span>
                  Speak clearly and at a moderate pace for accurate
                  transcription.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="text-[#00d084] shrink-0 mt-1" />
                <span>
                  Find a quiet place to avoid background noise interference.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Keyboard className="text-[#00d084] shrink-0 mt-1" />
                <span>
                  If voice input isn’t accurate, type your answer manually.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ListChecks className="text-[#00d084] shrink-0 mt-1" />
                <span>
                  The interview has <strong>5 questions</strong> — be ready for
                  each one.
                </span>
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={async () => {
              try {
                console.log(userId);
                const res = await axios.post(
                  "http://localhost:4000/api/session/start_session",
                  {
                    userId,
                    role,
                  }
                );

                localStorage.setItem("sessionId", res.data.sessionId);
                setStarted(true);
                getNextQuestion(role, experience);
              } catch (error) {
                console.error("Error starting session:", error);
              }
            }}
            className="bg-emerald-400 text-white rounded-lg px-10 py-4 hover:bg-emerald-600 cursor-pointer text-lg font-semibold transition-transform duration-300 hover:scale-105"
          >
            Start Interview
          </button>
        </div>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight">
            Interview for <span className="text-[#00d084]">{role}</span>
          </h1>
          <Badge
            variant="outline"
            className="text-md py-2 text-white px-4 w-fit border-2"
          >
            Question {Math.min(history.length + 1, MAX_QUESTIONS)} of{" "}
            {MAX_QUESTIONS}
          </Badge>
        </header>
        <Progress
          value={progressValue}
          className="w-full h-3  rounded-full"
          style={{
            "--progress-fill": "white",
          }}
        />

        <Card
          className="shadow-xl border-t-4 border-emerald-600 fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="p-2 bg-primary/10 rounded-full">
                <Bot className="text-primary shrink-0" size={24} />
              </span>
              <CardTitle className="text-2xl font-semibold">Question</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => playTTS(question)}
              disabled={isLoadingQuestion}
            >
              <Volume2 />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoadingQuestion ? (
              <div className="space-y-2 pt-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : (
              <p className="text-xl font-medium text-foreground/90">
                {question}
              </p>
            )}
          </CardContent>
        </Card>

        <Card
          className="shadow-xl fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Your Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder={
                  isRecording
                    ? "Listening..."
                    : "Click the microphone to start speaking or type your answer here..."
                }
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={8}
                className="pr-16 text-lg"
                disabled={isLoadingFeedback || !!feedback}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={toggleRecording}
                className={`absolute top-4 right-4 rounded-full w-12 h-12 transition-all duration-300 transform scale-100 hover:scale-110 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-background hover:bg-secondary"
                }`}
                disabled={!!feedback || isLoadingFeedback}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <MicOff /> : <Mic />}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={getFeedback}
              disabled={!userAnswer.trim() || isLoadingFeedback || !!feedback}
              className="h-12 px-6 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isLoadingFeedback ? "Analyzing..." : "Get Feedback"}
            </Button>
          </CardFooter>
        </Card>

        {(isLoadingFeedback || feedback) && (
          <Card
            className="shadow-xl border-[#00d084] border-t-4 fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                <Sparkles className="text-accent" /> AI Feedback
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoadingFeedback ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                </div>
              ) : (
                feedback && (
                  <div className="prose prose-lg max-w-none text-foreground/90">
                    {/* Score */}
                    {typeof feedback === "object" &&
                      feedback.score !== undefined && (
                        <p>
                          <strong>Score:</strong> {feedback.score ?? "N/A"}
                        </p>
                      )}

                    {/* Feedback text */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (typeof feedback === "string"
                          ? feedback
                          : feedback.feedback || ""
                        ).replace(/\n/g, "<br />"),
                      }}
                    />

                    {/* Strengths */}
                    {typeof feedback === "object" &&
                      Array.isArray(feedback.strengths) &&
                      feedback.strengths.length > 0 && (
                        <div>
                          <h4 className="font-semibold">Strengths:</h4>
                          <ul className="list-disc list-inside">
                            {feedback.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Weaknesses */}
                    {typeof feedback === "object" &&
                      Array.isArray(feedback.weaknesses) &&
                      feedback.weaknesses.length > 0 && (
                        <div>
                          <h4 className="font-semibold">Weaknesses:</h4>
                          <ul className="list-disc list-inside">
                            {feedback.weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Suggestions */}
                    {typeof feedback === "object" &&
                      Array.isArray(feedback.suggestions) &&
                      feedback.suggestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold">Suggestions:</h4>
                          <ul className="list-disc list-inside">
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

        <div
          className="flex justify-between items-center pt-4 fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            variant="destructive"
            onClick={endInterview}
            className="h-12 px-6 text-lg cursor-pointer"
          >
            <XCircle className="mr-2 h-5 w-5" />
            End Interview
          </Button>
          {!isLoadingQuestion && !isLoadingFeedback && !!question && (
            <Button
              onClick={handleNextQuestion}
              className="h-12 px-6 text-lg bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
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
