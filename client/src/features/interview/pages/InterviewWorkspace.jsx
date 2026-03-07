import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle, ArrowRight } from "lucide-react";

import { useInterview, MAX_QUESTIONS } from "../hook/useInterview";
import { PreInterviewTips } from "../components/PreInterviewTips";
import { QuestionCard } from "../components/QuestionCard";
import { AnswerCard } from "../components/AnswerCard";
import { FeedbackCard } from "../components/FeedbackCard";

export function InterviewWorkspace() {
  const nav = useNavigate();
  const {
    role,
    question,
    userAnswer,
    setUserAnswer,
    transcript,
    feedback,
    history,
    started,
    isLoadingQuestion,
    isLoadingFeedback,
    isRecording,
    isTranscribing,
    voiceMode,
    setVoiceMode,
    playTTS,
    submitFeedback,
    toggleRecording,
    endInterview,
    handleNextQuestion,
    beginInterview,
  } = useInterview();

  // Redirect if no role selected
  useEffect(() => {
    if (!role && !localStorage.getItem("interviewRole")) nav("/");
  }, [role, nav]);

  // Unlock AudioContext on first click (required by some browsers)
  useEffect(() => {
    const unlock = () => {
      new Audio().play().catch(() => {});
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("click", unlock);
    return () => document.removeEventListener("click", unlock);
  }, []);

  // Loading skeleton while role resolves
  if (!role) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl space-y-8 p-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  // Pre-interview tips screen
  if (!started) {
    return <PreInterviewTips onStart={beginInterview} />;
  }

  // Live interview screen
  return (
    <main className="min-h-screen text-white flex flex-col items-center p-4 sm:p-6 lg:mt-12">
      <div className="w-full max-w-4xl space-y-6">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Interview for <span className="text-emerald-400">{role}</span>
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
          value={(history.length / MAX_QUESTIONS) * 100}
          className="w-full h-2 rounded-full bg-white/10"
        />

        <QuestionCard
          question={question}
          isLoading={isLoadingQuestion}
          onPlayTTS={playTTS}
        />

        <AnswerCard
          voiceMode={voiceMode}
          onVoiceModeChange={setVoiceMode}
          userAnswer={userAnswer}
          onAnswerChange={setUserAnswer}
          feedback={feedback}
          isLoadingFeedback={isLoadingFeedback}
          isLoadingQuestion={isLoadingQuestion}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          transcript={transcript}
          onToggleRecording={toggleRecording}
          onSubmitFeedback={submitFeedback}
        />

        <FeedbackCard feedback={feedback} isLoading={isLoadingFeedback} />

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
