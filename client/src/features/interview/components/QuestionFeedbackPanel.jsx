import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles, PlayCircle, CheckCircle2, AlertTriangle, Lightbulb,
  TrendingUp, ArrowRight, XCircle, Bookmark, BookmarkCheck,
  Mic, Volume2, BarChart2, MessageSquare, Columns2, Code2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { MAX_QUESTIONS } from "../constants/interview.constants";
import { getFeedbackParts } from "../services/interviewFeedback.helpers";

// ─── STAR Breakdown sub-component ──────────────────────────────────────────────
function STARBreakdown({ starScores }) {
  if (!starScores) return null;
  const items = [
    { key: "situation", label: "Situation", weight: "20%" },
    { key: "task", label: "Task", weight: "20%" },
    { key: "action", label: "Action", weight: "40%" },
    { key: "result", label: "Result", weight: "20%" },
  ];
  const getColor = (score) => {
    if (score >= 7) return { bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/25" };
    if (score >= 4) return { bar: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/25" };
    return { bar: "bg-red-500", text: "text-red-500", bg: "bg-red-500/10 border-red-500/25" };
  };
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-5 mb-6">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
        <BarChart2 className="w-3.5 h-3.5" /> STAR Framework Score
      </h4>
      <div className="space-y-3">
        {items.map(({ key, label, weight }) => {
          const score = starScores[key] ?? 0;
          const c = getColor(score);
          return (
            <div key={key} className={`rounded-xl border ${c.bg} p-3`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{weight}</span>
                  <span className={`text-sm font-black ${c.text}`}>{score}/10</span>
                </div>
              </div>
              <div className="h-1.5 bg-background/60 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${score * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Delivery Score sub-component ──────────────────────────────────────────────
function DeliveryPanel({ delivery }) {
  if (!delivery) return (
    <p className="text-sm text-muted-foreground">No delivery data available.</p>
  );
  const bars = [
    { label: "Pacing", score: delivery.pacingScore },
    { label: "Clarity", score: delivery.clarityScore },
    { label: "Overall Delivery", score: delivery.overallDeliveryScore },
  ];
  const fillerCats = delivery.fillerCategories || {};
  return (
    <div className="space-y-5">
      {/* Bar scores */}
      <div className="space-y-3">
        {bars.map(({ label, score }) => {
          if (!score && score !== 0) return null;
          const pct = (score / 10) * 100;
          const color = score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-red-500";
          return (
            <div key={label}>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-foreground">{label}</span>
                <span className="text-muted-foreground">{score}/10</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filler word breakdown */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Filler Word Analysis</h5>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-black text-foreground">{delivery.fillerWordCount ?? 0}</span>
          <span className="text-sm text-muted-foreground">filler words</span>
          {delivery.fillerWordRate != null && (
            <span className="text-xs text-muted-foreground ml-auto">({delivery.fillerWordRate}% of words)</span>
          )}
        </div>
        {Object.keys(fillerCats).length > 0 && (
          <div className="space-y-1.5">
            {Object.entries(fillerCats).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{cat.replace(/_/g, " ")}</span>
                <span className="font-semibold text-foreground">{count}</span>
              </div>
            ))}
          </div>
        )}
        {delivery.fillerWordCount === 0 && (
          <p className="text-xs text-emerald-600 font-medium">No filler words detected — excellent delivery!</p>
        )}
      </div>
    </div>
  );
}

// ─── Ideal Answer Side-by-Side ──────────────────────────────────────────────────
function IdealAnswerPanel({ userAnswer, suggestedAnswer }) {
  const [showIdeal, setShowIdeal] = useState(true);
  if (!suggestedAnswer) return null;
  return (
    <div className="mt-6 space-y-4">
      <button
        type="button"
        onClick={() => setShowIdeal((v) => !v)}
        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
      >
        <Columns2 className="w-3.5 h-3.5" />
        {showIdeal ? "Hide ideal answer" : "Show ideal answer"}
      </button>
      {showIdeal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Your answer</h5>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{userAnswer || "—"}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Ideal answer</h5>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{suggestedAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Code Review Sub-component ────────────────────────────────────────────────
function CodeReviewPanel({ codeReview }) {
  if (!codeReview) return null;
  const bars = [
    { label: "Correctness", score: codeReview.correctness },
    { label: "Efficiency", score: codeReview.efficiency },
    { label: "Readability", score: codeReview.readability },
    { label: "Overall Code", score: codeReview.overallCode },
  ];
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {bars.map(({ label, score }) => {
          if (!score && score !== 0) return null;
          const pct = (score / 10) * 100;
          const color = score >= 7 ? "bg-blue-500" : score >= 5 ? "bg-amber-500" : "bg-red-500";
          return (
            <div key={label}>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-foreground">{label}</span>
                <span className="text-muted-foreground">{score}/10</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {codeReview.suggestions && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <h5 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Code Feedback
          </h5>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{codeReview.suggestions}</p>
        </div>
      )}

      {codeReview.improvedVersion && (
        <div className="mt-4 rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="bg-muted px-4 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" /> Improved Version
            </span>
          </div>
          <div className="h-64 sm:h-80 w-full relative">
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={codeReview.improvedVersion}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main QuestionFeedbackPanel ─────────────────────────────────────────────────
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
  // New props
  onBookmark,
  isBookmarked,
  lastAudioBlob,
  followUpQuestion,
  followUpAnswer,
}) {
  const [activeTab, setActiveTab] = useState("content"); // content | delivery | ideal
  const [bookmarked, setBookmarked] = useState(isBookmarked || false);
  const audioBlobUrlRef = useRef(null);

  const parts = getFeedbackParts(feedback);
  const qNum = Math.min(answeredCount + 1, MAX_QUESTIONS);
  const sessionHint = localStorage.getItem("sessionId")
    ? `Session · ${String(localStorage.getItem("sessionId")).slice(0, 8)}…`
    : "Session in progress";

  const delivery = feedback?.delivery || null;
  const starScores = feedback?.starScores || null;
  const suggestedAnswer = feedback?.suggestedAnswer || null;
  const conciseness = feedback?.conciseness || null;
  const codeReview = feedback?.codeReview || null;

  const handlePlayAudio = () => {
    if (!lastAudioBlob) return;
    if (audioBlobUrlRef.current) URL.revokeObjectURL(audioBlobUrlRef.current);
    const url = URL.createObjectURL(lastAudioBlob);
    audioBlobUrlRef.current = url;
    new Audio(url).play();
  };

  const handleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    onBookmark?.(next);
  };

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

  const nextLabel = answeredCount + 1 >= MAX_QUESTIONS ? "View summary" : "Next question";
  const tabs = [
    { id: "content", label: "Content", icon: MessageSquare },
    { id: "delivery", label: "Delivery", icon: Volume2 },
    ...(codeReview ? [{ id: "code", label: "Code Review", icon: Code2 }] : []),
    ...(suggestedAnswer ? [{ id: "ideal", label: "Ideal Answer", icon: Columns2 }] : []),
  ];

  return (
    <section className="max-w-8xl mx-auto w-full">
      {/* Sticky toolbar */}
      <div
        className="sticky top-0 z-20 -mx-1 px-1 mb-6 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]"
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Bookmark button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={`rounded-full h-11 w-11 shrink-0 ${bookmarked ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"}`}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this question"}
            title={bookmarked ? "Remove bookmark" : "Bookmark question"}
          >
            {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </Button>
          {/* Voice playback button */}
          {lastAudioBlob && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePlayAudio}
              className="rounded-full h-11 w-11 shrink-0 text-muted-foreground hover:text-emerald-600"
              aria-label="Play back your recorded answer"
              title="Hear yourself"
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
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
      </div>

      {/* Header */}
      <header className="mb-8">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider text-sm uppercase mb-2 block">
          {sessionHint}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-2 tracking-tight leading-tight font-headline">
          Analysis complete
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Question {qNum} of {MAX_QUESTIONS}
          {role ? (<> : <span className="text-foreground">{role}</span></>) : null}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column — Q + Answer */}
        <div className="lg:col-span-5 space-y-6">
          {/* Question */}
          <div className="bg-muted/50 rounded-xl p-6 relative overflow-hidden border border-border/60">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/25" />
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Prompt</h3>
            <p className="text-base md:text-lg font-medium text-foreground leading-relaxed italic">
              &ldquo;{question}&rdquo;
            </p>
            {onPlayQuestionTTS && (
              <Button
                type="button" variant="ghost" size="sm"
                className="mt-4 text-emerald-600 hover:text-emerald-700 px-0"
                onClick={() => onPlayQuestionTTS(question)}
              >
                <PlayCircle className="w-4 h-4 mr-1" /> Listen to question
              </Button>
            )}
          </div>

          {/* User answer */}
          <div className="bg-card rounded-xl p-6 md:p-8 border border-border/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Your answer</h3>
              {lastAudioBlob && (
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600 transition-colors font-medium"
                >
                  <Mic className="w-3.5 h-3.5" /> Play recording
                </button>
              )}
            </div>
            <p className="text-foreground/90 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {userAnswer || "—"}
            </p>
            {/* Follow-up transcript */}
            {followUpQuestion && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Follow-up probe</p>
                <p className="text-sm text-muted-foreground italic mb-2">&ldquo;{followUpQuestion}&rdquo;</p>
                {followUpAnswer && (
                  <>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Your follow-up answer</p>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{followUpAnswer}</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* STAR breakdown (if behavioral) */}
          {starScores && <STARBreakdown starScores={starScores} />}

          {/* Score chips */}
          <div className="flex flex-wrap gap-3">
            {parts.score != null && (
              <div className="rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500 px-5 py-3 text-white shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Content</p>
                <p className="text-2xl font-black">{parts.score}<span className="text-sm font-bold opacity-70">/10</span></p>
              </div>
            )}
            {delivery?.overallDeliveryScore != null && (
              <div className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 px-5 py-3 text-white shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Delivery</p>
                <p className="text-2xl font-black">{delivery.overallDeliveryScore}<span className="text-sm font-bold opacity-70">/10</span></p>
              </div>
            )}
          </div>

          {/* Conciseness note */}
          {conciseness && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2 border border-border/60">
              ⏱ {conciseness}
            </p>
          )}
        </div>

        {/* Right column — Tabs */}
        <div className="lg:col-span-7">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight font-headline">Executive feedback</h2>
            </div>

            {/* Tab navigation */}
            <div className="flex p-1 bg-muted rounded-xl mb-6 gap-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* ── Content Tab ── */}
            {activeTab === "content" && (
              <div className="animate-in fade-in duration-200">
                {parts.text && (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-8"
                    dangerouslySetInnerHTML={{ __html: parts.text.replace(/\n/g, "<br />") }}
                  />
                )}

                {(parts.nextLevelEdge || parts.refinementAreas) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                      <div className="flex items-center gap-2 text-emerald-600 mb-3">
                        <TrendingUp className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Next-level edge</h4>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {parts.nextLevelEdge || "Use the strongest part of your answer as a repeatable pattern."}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                      <div className="flex items-center gap-2 text-amber-600 mb-3">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Refinement areas</h4>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {parts.refinementAreas || "Tighten the weakest part before the next question."}
                      </p>
                    </div>
                  </div>
                )}

                {parts.strengths.length > 0 && (
                  <section className="mb-8">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Core strengths
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {parts.strengths.map((s, i) => (
                        <div key={i} className="p-4 rounded-xl bg-muted/50 flex gap-3 items-start border border-border/50">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground leading-snug">{s}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {parts.weaknesses.length > 0 && (
                  <section className="mb-8">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Areas to tighten
                    </h4>
                    <div className="space-y-3">
                      {parts.weaknesses.map((w, i) => (
                        <div key={i} className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 flex gap-3 items-start">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground leading-snug">{w}</p>
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
                        <h5 className="text-base font-bold text-foreground mb-1 font-headline">Coaching tips</h5>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          {parts.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* ── Delivery Tab ── */}
            {activeTab === "delivery" && (
              <div className="animate-in fade-in duration-200">
                <DeliveryPanel delivery={delivery} />
              </div>
            )}

            {/* ── Code Tab ── */}
            {activeTab === "code" && (
              <div className="animate-in fade-in duration-200">
                <CodeReviewPanel codeReview={codeReview} />
              </div>
            )}

            {/* ── Ideal Answer Tab ── */}
            {activeTab === "ideal" && (
              <div className="animate-in fade-in duration-200 space-y-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Compare your response to the AI-generated model answer to identify what's missing.
                </p>
                <IdealAnswerPanel userAnswer={userAnswer} suggestedAnswer={suggestedAnswer} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  );
}
