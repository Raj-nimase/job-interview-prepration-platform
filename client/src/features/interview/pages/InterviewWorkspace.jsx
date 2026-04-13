import { useEffect, useState } from "react";
import { useInterview } from "../hook/useInterview";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { WorkspaceSessionHeader } from "../components/WorkspaceSessionHeader";
import { QuestionCard } from "../components/QuestionCard";
import { AnswerCard } from "../components/AnswerCard";
import { QuestionFeedbackPanel } from "../components/QuestionFeedbackPanel";
import { WarmupCard } from "../components/WarmupCard";
import { ClarifyingQuestionPanel } from "../components/ClarifyingQuestionPanel";
import CodePanel from "../components/CodePanel";

export function InterviewWorkspace() {
  const {
    role,
    experience,
    started,
    question,
    questionTopic,
    questionDifficulty,
    questionError,
    userAnswer,
    setUserAnswer,
    transcript,
    feedback,
    history,
    isLoadingQuestion,
    isLoadingFeedback,
    isRecording,
    isTranscribing,
    voiceMode,
    setVoiceMode,
    playTTS,
    getNextQuestion,
    retryQuestion,
    submitFeedback,
    toggleRecording,
    endInterview,
    handleNextQuestion,
    questionCount,
    performanceStatus,

    // Timer fields
    timeRemaining,
    questionTimeLimit,
    timerActive,
    timerExpired,

    // Warmup
    warmupPhase,
    warmupQuestions,
    warmupIndex,
    warmupAnswer,
    setWarmupAnswer,
    nextWarmup,
    isLoadingWarmup,

    // Clarification
    isClarificationPhase,
    clarificationTimeLeft,
    clarificationText,
    setClarificationText,
    interviewerClarificationResponse,
    isLoadingClarification,
    skipClarification,
    submitClarification,

    // Follow-up
    isFollowUpPhase,
    followUpQuestion,
    followUpAnswer,
    submitFollowUp,
    isCheckingFollowUp,

    // Meta
    interviewType,
    bookmarkCurrentQuestion,
    lastAudioBlob,

    // Code
    requiresCode,
    codePrompt,
    starterCode,
    codeLanguage,
    setCodeLanguage,
    codeAnswer,
    setCodeAnswer,
  } = useInterview();

  const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);

  // Auto-open code panel when code is required
  useEffect(() => {
    if (requiresCode) {
      setIsCodePanelOpen(true);
    }
  }, [requiresCode]);

  // If in warmup phase, render entirely different UI
  if (warmupPhase) {
    return (
      <WarmupCard
        question={warmupQuestions[warmupIndex]}
        questionIndex={warmupIndex}
        totalQuestions={warmupQuestions.length}
        answer={warmupAnswer}
        onAnswerChange={setWarmupAnswer}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        onNextWarmup={nextWarmup}
        voiceMode={voiceMode}
        onVoiceModeChange={setVoiceMode}
        isLoadingWarmup={isLoadingWarmup}
      />
    );
  }

  const canGoNext = true; // They can always proceed from feedback
  const isFeedbackMode = !!feedback;

  return (
    <div className="min-h-screen w-screen bg-background text-foreground transition-all">
      <main className="max-w-[85vw] mx-auto p-4 md:p-8 lg:p-12 transition-all">
        {/* Workspace header showing progress (top left/right) */}
        {!isFeedbackMode && (
          <WorkspaceSessionHeader
            answeredCount={history.length}
            role={role}
            questionCount={questionCount}
            history={history}
            performanceStatus={performanceStatus}
          />
        )}

        <div className={`transition-all duration-500 ease-in-out ${isFeedbackMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 flex flex-col md:flex-row gap-6'}`}>
          <div className={`flex flex-col flex-1 transition-all duration-500 ease-in-out`}>
            <QuestionCard
              question={question}
              isLoading={isLoadingQuestion}
              questionError={questionError}
              onRetry={retryQuestion}
              onPlayTTS={playTTS}
              role={role}
              timeRemaining={timeRemaining}
              timeLimit={questionTimeLimit}
              timerActive={timerActive}
              timerExpired={timerExpired}
              questionTopic={questionTopic}
              questionDifficulty={questionDifficulty}
              interviewType={interviewType}
            />

            {isClarificationPhase && (
              <ClarifyingQuestionPanel
                clarificationTimeLeft={clarificationTimeLeft}
                clarificationText={clarificationText}
                onClarificationTextChange={setClarificationText}
                onSubmitClarification={submitClarification}
                onSkip={skipClarification}
                isLoading={isLoadingClarification}
                interviewerResponse={interviewerClarificationResponse}
              />
            )}

            {!isClarificationPhase && (
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
                isFollowUpPhase={isFollowUpPhase}
                followUpQuestion={followUpQuestion}
                onSubmitFollowUp={submitFollowUp}
                isCheckingFollowUp={isCheckingFollowUp}
              />
            )}

            {/* Fallback end button if not auto-ended */}
            {!isLoadingQuestion && !isRecording && !isLoadingFeedback && !isFollowUpPhase && !isClarificationPhase && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={endInterview}
                  className="text-muted-foreground hover:text-red-500 text-sm font-medium transition-colors"
                >
                  End interview early
                </button>
              </div>
            )}
          </div>

          {requiresCode && (
            <>
              {/* Divider / Toggle */}
              <div className="hidden md:flex flex-col items-center justify-center -mx-2 z-10 w-4">
                <div className="flex-1 w-px bg-border/40"></div>
                <button
                  onClick={() => setIsCodePanelOpen(!isCodePanelOpen)}
                  className="w-6 h-10 bg-card border border-border shadow-md rounded flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-colors"
                  title={isCodePanelOpen ? "Collapse Code Panel" : "Expand Code Panel"}
                >
                  {isCodePanelOpen ? <ChevronRight size={14} className="text-muted-foreground" /> : <ChevronLeft size={14} className="text-muted-foreground" />}
                </button>
                <div className="flex-1 w-px bg-border/40"></div>
              </div>

              {/* Code Panel Column */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isCodePanelOpen ? "w-full md:w-[45%]" : "hidden w-0"
                }`}
              >
                <div className="h-full min-h-[500px]">
                  <CodePanel
                    language={codeLanguage}
                    setLanguage={setCodeLanguage}
                    readOnly={!timerActive && !timerExpired && !userAnswer && !transcript && !isFollowUpPhase}
                    onCodeChange={setCodeAnswer}
                    initialCode={starterCode}
                    codePrompt={codePrompt}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {isFeedbackMode && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <QuestionFeedbackPanel
              feedback={feedback}
              isLoading={isLoadingFeedback}
              question={question}
              userAnswer={userAnswer}
              answeredCount={history.length}
              role={role}
              onPlayQuestionTTS={playTTS}
              onNextQuestion={handleNextQuestion}
              onEndInterview={endInterview}
              canGoNext={canGoNext}
              onBookmark={bookmarkCurrentQuestion}
              isBookmarked={false}
              lastAudioBlob={lastAudioBlob}
              followUpQuestion={followUpQuestion}
              followUpAnswer={followUpAnswer}
            />
          </div>
        )}
      </main>
    </div>
  );
}
