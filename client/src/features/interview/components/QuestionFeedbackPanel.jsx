import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { MAX_QUESTIONS } from "../constants/interview.constants";
import { getFeedbackParts } from "../services/interviewFeedback.helpers";

export function QuestionFeedbackPanel({
  feedback,
  isLoading,
  question,
  userAnswer,
  answeredCount,
  role,
  onPlayQuestionTTS,
  onNextQuestion,
  onEndInterview,
  canGoNext,
}) {
  const parts = getFeedbackParts(feedback);
  const qNum = Math.min(answeredCount + 1, MAX_QUESTIONS);
  const sessionHint = localStorage.getItem("sessionId")
    ? `Session · ${String(localStorage.getItem("sessionId")).slice(0, 8)}…`
    : "Session in progress";

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <Skeleton className="h-8 w-2/3 max-w-md mb-4" />
        <Skeleton className="h-24 w-full rounded-xl mb-6" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </section>
    );
  }

  if (!feedback) return null;

  const nextLabel =
    answeredCount + 1 >= MAX_QUESTIONS ? "View summary" : "Next question";

  return (
    <section className="max-w-8xl mx-auto w-full">
      <div
        className="sticky top-0 z-20 -mx-1 px-1  mb-6 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]"
        role="toolbar"
        aria-label="Interview actions"
      >
        <Button
          type="button"
          variant="destructive"
          onClick={onEndInterview}
          className="rounded-full h-11 px-5 w-full sm:w-auto shrink-0"
        >
          <XCircle className="w-5 h-5 mr-2" />
          End interview
        </Button>
        <Button
          type="button"
          onClick={onNextQuestion}
          disabled={!canGoNext}
          className="rounded-full h-11 px-6 sm:px-8 w-full sm:w-auto text-base font-bold bg-gradient-to-br from-emerald-700 to-emerald-500 hover:from-emerald-800 hover:to-emerald-600 text-white shadow-lg shrink-0"
        >
          {nextLabel}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <header className="mb-8">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider text-sm uppercase mb-2 block">
          {sessionHint}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-2 tracking-tight leading-tight font-headline">
          Analysis complete
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Question {qNum} of {MAX_QUESTIONS}
          {role ? (
            <>
              : <span className="text-foreground">{role}</span>
            </>
          ) : null}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-muted/50 rounded-xl p-6 relative overflow-hidden border border-border/60">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/25" />
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
              Prompt
            </h3>
            <p className="text-base md:text-lg font-medium text-foreground leading-relaxed italic">
              &ldquo;{question}&rdquo;
            </p>
            {onPlayQuestionTTS && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-4 text-emerald-600 hover:text-emerald-700 px-0"
                onClick={() => onPlayQuestionTTS(question)}
              >
                <PlayCircle className="w-4 h-4 mr-1" />
                Listen to question
              </Button>
            )}
          </div>

          <div className="bg-card rounded-xl p-6 md:p-8 border border-border/80">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Your answer
            </h3>
            <p className="text-foreground/90 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {userAnswer || "—"}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight font-headline">
                Executive feedback
              </h2>
            </div>

            {parts.text && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-8"
                dangerouslySetInnerHTML={{
                  __html: parts.text.replace(/\n/g, "<br />"),
                }}
              />
            )}

            {(parts.nextLevelEdge || parts.refinementAreas) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <div className="flex items-center gap-2 text-emerald-600 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">
                      Next-level edge
                    </h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {parts.nextLevelEdge ||
                      "Use the strongest part of your answer as a repeatable pattern in future responses."}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">
                      Refinement areas
                    </h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {parts.refinementAreas ||
                      "Tighten the weakest part of the answer before the next question."}
                  </p>
                </div>
              </div>
            )}

            {parts.strengths.length > 0 && (
              <section className="mb-8">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Core strengths
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parts.strengths.map((s, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-muted/50 flex gap-3 items-start border border-border/50"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground leading-snug">
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {parts.weaknesses.length > 0 && (
              <section className="mb-8">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  Refinement areas
                </h4>
                <div className="space-y-3">
                  {parts.weaknesses.map((w, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 flex gap-3 items-start"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground leading-snug">
                        {w}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {parts.suggestions.length > 0 && (
              <section className="pt-6 border-t border-border/60">
                <div className="rounded-2xl p-5 bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-foreground mb-1 font-headline">
                      Next-level edge
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      {parts.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  );
}
