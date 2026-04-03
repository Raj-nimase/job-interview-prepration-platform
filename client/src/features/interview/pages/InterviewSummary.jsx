import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useInterview } from "../hook/useInterview";
import { SummaryReportHeader } from "../components/SummaryReportHeader";
import { SummaryOverallScoreCard } from "../components/SummaryOverallScoreCard";
import { SummaryQuestionBreakdown } from "../components/SummaryQuestionBreakdown";
import { SummaryInsightsAside } from "../components/SummaryInsightsAside";
import { averageScoreFromHistory } from "../services/interviewFeedback.helpers";
import { MAX_QUESTIONS } from "../constants/interview.constants";

export function InterviewSummary() {
  const nav = useNavigate();
  const { history, role, setHistory, setStarted } = useInterview();

  // Mark session inactive once summary is shown (avoids /interview redirect race on End).
  useEffect(() => {
    setStarted(false);
  }, [setStarted]);

  const handleNewInterview = () => {
    localStorage.removeItem("sessionId");
    setHistory([]);
    setStarted(false);
    nav("/selectRole");
  };

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-5xl space-y-6 p-4">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold font-headline text-foreground">
            No answers recorded
          </h1>
          <p className="text-muted-foreground">
            This session ended before any answer was saved. Start a new interview
            to practice.
          </p>
          <Button
            onClick={handleNewInterview}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            Start new interview
          </Button>
        </div>
      </div>
    );
  }

  const averageScore = averageScoreFromHistory(history);
  const endedEarly = history.length < MAX_QUESTIONS;
  const overviewText =
    averageScore != null
      ? endedEarly
        ? `You ended the session early after ${history.length} answered question${history.length === 1 ? "" : "s"}. Your average score across scored answers is ${averageScore}/10. Review the breakdown below.`
        : `You completed ${history.length} questions with an average score of ${averageScore}/10. Use the breakdown below to spot patterns and tighten your narrative for the real interview.`
      : endedEarly
        ? `You ended the session early after ${history.length} answered question${history.length === 1 ? "" : "s"}. Review each prompt and your answers below—scores appear when the API returns a numeric rating.`
        : `You completed ${history.length} questions. Review each prompt, your answers, and the AI narrative below—scores appear when the API returns a numeric rating.`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main
        id="interview-summary-print"
        className="max-w-[80vw] mx-auto p-6 md:p-10 lg:p-16"
      >
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-4 items-start">
          <SummaryReportHeader
            className="lg:col-span-8"
            role={role}
            overviewText={overviewText}
          />
          <SummaryOverallScoreCard
            averageScore={averageScore}
            questionCount={history.length}
          />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12">
          <SummaryQuestionBreakdown history={history} />
          <SummaryInsightsAside
            role={role}
            averageScore={averageScore}
            questionCount={history.length}
            history={history}
            onNewInterview={handleNewInterview}
          />
        </div>
      </main>

    </div>
  );
}
