import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle } from "lucide-react";

import { useInterview } from "../hook/useInterview";
import { QuestionCard } from "../components/QuestionCard";
import { AnswerCard } from "../components/AnswerCard";
import { WorkspaceSessionHeader } from "../components/WorkspaceSessionHeader";
import { QuestionFeedbackPanel } from "../components/QuestionFeedbackPanel";

export function InterviewWorkspace() {
  const nav = useNavigate();
  const location = useLocation();
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
  } = useInterview();

  const feedbackPhase = isLoadingFeedback || !!feedback;

  useEffect(() => {
    if (!role && !localStorage.getItem("interviewRole")) {
      nav("/selectRole");
    }
  }, [role, nav]);

  // Only when actually on /interview: if session never started, send to setup.
  // Must be an effect — not render-time nav — and must NOT run after endInterview
  // (that leaves started true until Summary mounts; see useInterview.endInterview).
  useEffect(() => {
    if (location.pathname !== "/interview") return;
    if (!started) {
      nav("/selectRole", { replace: true });
    }
  }, [started, location.pathname, nav]);

  useEffect(() => {
    const unlock = () => {
      new Audio().play().catch(() => {});
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("click", unlock);
    return () => document.removeEventListener("click", unlock);
  }, []);

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

  if (!started) {
    return null;
  }

  return (
    <main className="min-h-screen w-screen bg-background text-foreground py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[80vw] mx-auto w-full">
        <WorkspaceSessionHeader answeredCount={history.length} role={role} />

        {!feedbackPhase && (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 mb-6">
              <Button
                type="button"
                variant="destructive"
                onClick={() => endInterview()}
                className="rounded-full h-11 px-6 w-full sm:w-auto"
              >
                <XCircle className="w-5 h-5 mr-2" />
                End interview
              </Button>
            </div>
            <QuestionCard
              question={question}
              isLoading={isLoadingQuestion}
              onPlayTTS={playTTS}
              role={role}
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
          </>
        )}

        {feedbackPhase && (
          <QuestionFeedbackPanel
            feedback={feedback}
            isLoading={isLoadingFeedback}
            question={question}
            userAnswer={userAnswer || transcript}
            answeredCount={history.length}
            role={role}
            onPlayQuestionTTS={playTTS}
            onNextQuestion={handleNextQuestion}
            onEndInterview={() => endInterview()}
            canGoNext={!isLoadingFeedback && !!feedback}
          />
        )}
      </div>
    </main>
  );
}
