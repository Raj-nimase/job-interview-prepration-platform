import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Volume2, Zap, Brain } from "lucide-react";
import { TimerRing } from "./TimerRing";

export function QuestionCard({
  question,
  isLoading,
  questionError,
  onRetry,
  onPlayTTS,
  role,
  // Timer props
  timeRemaining,
  timeLimit = 120,
  timerActive,
  timerExpired,
  // Meta
  questionTopic,
  questionDifficulty,
  interviewType,
}) {
  const badgeLabel = role ? role.split(" ").slice(0, 2).join(" ") : "Interview";

  const difficultyColor = {
    easy: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    hard: "text-red-500 bg-red-500/10 border-red-500/20",
  }[questionDifficulty] || "text-muted-foreground bg-muted border-border";

  const showTimer = timerActive || timerExpired;

  return (
    <div className="relative bg-card rounded-[2rem] p-8 md:p-12 shadow-[0px_12px_32px_rgba(25,28,30,0.06)] border border-border/80 mb-6 md:mb-8 ">
      {/* Top row: badges + timer */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            {badgeLabel}
          </div>

          {interviewType && interviewType !== "Technical" && (
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
              <Brain className="w-3 h-3" />
              {interviewType}
            </div>
          )}

          {questionDifficulty && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${difficultyColor}`}>
              <Zap className="w-3 h-3" />
              {questionDifficulty.charAt(0).toUpperCase() + questionDifficulty.slice(1)}
            </div>
          )}

          {questionTopic && (
            <span className="text-xs text-muted-foreground font-medium hidden sm:block">
              {questionTopic}
            </span>
          )}
        </div>

        {/* Timer ring */}
        {showTimer && (
          <div className="shrink-0">
            <TimerRing
              timeRemaining={timerExpired ? 0 : timeRemaining}
              timeLimit={timeLimit}
              size={68}
            />
          </div>
        )}
      </div>

      {/* Question text + TTS */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {questionError ? (
          <div className="bg-red-500/10 border-red-500/20 border p-6 rounded-xl flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-red-500 font-bold mb-4">Connection to AI failed.</p>
            <Button onClick={onRetry} variant="default" className="bg-red-500 hover:bg-red-600 text-white rounded-full font-bold">
              Retry question generation
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 flex-1 pt-1">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-4/5" />
          </div>
        ) : (
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight max-w-4xl font-headline pr-2">
            &ldquo;{question}&rdquo;
          </h3>
        )}
        {!questionError && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPlayTTS(question)}
            disabled={isLoading || !question}
            className="shrink-0 text-muted-foreground hover:text-emerald-600 rounded-full"
            aria-label="Play question audio"
          >
            <Volume2 className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Timer expired banner */}
      {timerExpired && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/25 px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium">
          ⏱ Time limit reached — answer was auto-submitted.
        </div>
      )}
    </div>
  );
}
