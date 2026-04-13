import { Mic, Keyboard, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * WarmupCard — low-stakes warm-up questions before the real interview.
 * Props: question, questionIndex, totalQuestions, answer, onAnswerChange,
 *        isRecording, onToggleRecording, onNextWarmup, voiceMode, onVoiceModeChange,
 *        isLoadingWarmup
 */
export function WarmupCard({
  question,
  questionIndex,
  totalQuestions,
  answer,
  onAnswerChange,
  isRecording,
  onToggleRecording,
  onNextWarmup,
  voiceMode,
  onVoiceModeChange,
  isLoadingWarmup,
}) {
  if (isLoadingWarmup) {
    return (
      <div className="min-h-screen w-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">Preparing your warm-up…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-background text-foreground py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Header badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Warm-up — Not Scored
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {questionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Question */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Warm-up question
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug font-headline">
            &ldquo;{question}&rdquo;
          </h2>
          <p className="mt-4 text-sm text-muted-foreground italic">
            This question is just to ease you in — feel free to answer naturally. No scoring or AI feedback will be generated.
          </p>
        </div>

        {/* Answer area */}
        <div className="bg-muted/40 rounded-2xl p-6 border border-border/60 space-y-4">
          {/* Mode toggle */}
          <div className="flex p-1 bg-card rounded-full border border-border w-fit">
            <button
              type="button"
              onClick={() => onVoiceModeChange(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${voiceMode ? "bg-emerald-600 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Mic className="w-3.5 h-3.5" />
              Voice
            </button>
            <button
              type="button"
              onClick={() => onVoiceModeChange(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${!voiceMode ? "bg-emerald-600 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              Type
            </button>
          </div>

          {voiceMode ? (
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={onToggleRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg font-bold ${isRecording ? "bg-red-500 text-white animate-pulse scale-110" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <Mic className="w-7 h-7" />
              </button>
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Recording… tap to stop" : "Tap to speak your answer"}
              </p>
              {answer && (
                <div className="w-full bg-background rounded-xl p-4 border border-border text-sm text-foreground leading-relaxed">
                  {answer}
                </div>
              )}
            </div>
          ) : (
            <Textarea
              placeholder="Type your answer here…"
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              rows={5}
              className="bg-background border-border text-foreground text-base resize-none rounded-xl"
            />
          )}
        </div>

        {/* Next button */}
        <Button
          onClick={onNextWarmup}
          className="w-full rounded-full py-6 text-base font-bold bg-gradient-to-br from-emerald-700 to-emerald-500 hover:from-emerald-800 hover:to-emerald-600 text-white shadow-lg"
        >
          {questionIndex + 1 >= totalQuestions ? "Start Interview →" : "Next Warm-up →"}
        </Button>
      </div>
    </div>
  );
}
