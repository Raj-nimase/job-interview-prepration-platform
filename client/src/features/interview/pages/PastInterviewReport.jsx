import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { SummaryReportHeader } from "../components/SummaryReportHeader";
import { SummaryOverallScoreCard } from "../components/SummaryOverallScoreCard";
import { SummaryQuestionBreakdown } from "../components/SummaryQuestionBreakdown";
import { SummaryInsightsAside } from "../components/SummaryInsightsAside";
import { averageScoreFromHistory } from "../services/interviewFeedback.helpers";
import { getInterviewSummary, getSession } from "../services/interview.api";

export default function PastInterviewReport() {
  const { id } = useParams();
  const nav = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    if (id) {
      getSession(id)
        .then((data) => setSession(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (!id || !session) return;
    const hasSummary =
      !!session.summary?.nextLevelEdge || !!session.summary?.refinementAreas;
    const hasAnswers = (session.questionsAsked?.length || 0) > 0;
    if (hasSummary || !hasAnswers) return;

    let mounted = true;
    setIsLoadingReport(true);
    getInterviewSummary(id)
      .then((data) => {
        if (!mounted) return;
        if (data?.summary) {
          setSession((prev) => (prev ? { ...prev, summary: data.summary } : prev));
        }
      })
      .catch((err) => console.error("Past report summary fetch error:", err))
      .finally(() => {
        if (mounted) setIsLoadingReport(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background pt-24">
        <div className="w-full max-w-5xl space-y-6 p-4">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-foreground font-headline text-2xl pt-24">
        <span>Session not found.</span>
        <button
          onClick={() => nav("/dashboard")}
          className="mt-6 flex items-center text-emerald-500 hover:text-emerald-400 transition-colors text-sm font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
        </button>
      </div>
    );
  }

  const history = session.questionsAsked || [];
  const averageScore = session.overallScore || averageScoreFromHistory(history);
  const report = session.summary || null;
  const overviewText = `You completed ${history.length} questions. Here is your historical report and analysis from this past ${session.role} session.`;

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <main className="max-w-[80vw] mx-auto p-6 md:p-10 lg:p-16 pt-0">
        <button
          onClick={() => nav("/dashboard")}
          className="flex items-center text-muted-foreground hover:text-emerald-500 transition-colors mb-8 text-sm font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-4 items-start">
          <SummaryReportHeader
            className="lg:col-span-8"
            role={session.role}
            overviewText={overviewText}
          />
          <SummaryOverallScoreCard
            averageScore={averageScore}
            questionCount={history.length}
          />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12">
          {history.length > 0 ? (
            <SummaryQuestionBreakdown history={history} />
          ) : (
            <section className="xl:col-span-8 rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
              This session has no recorded questions/answers. It may have been
              started but ended before submitting any response.
            </section>
          )}
          <SummaryInsightsAside
            role={session.role}
            averageScore={averageScore}
            questionCount={history.length}
            report={report}
            isLoadingReport={isLoadingReport}
            onNewInterview={() => nav("/selectRole")}
          />
        </div>
      </main>
    </div>
  );
}
