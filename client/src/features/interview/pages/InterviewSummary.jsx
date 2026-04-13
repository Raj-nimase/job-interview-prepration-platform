import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useInterview } from "../hook/useInterview";
import { SummaryReportHeader } from "../components/SummaryReportHeader";
import { SummaryOverallScoreCard } from "../components/SummaryOverallScoreCard";
import { SummaryQuestionBreakdown } from "../components/SummaryQuestionBreakdown";
import { SummaryInsightsAside } from "../components/SummaryInsightsAside";
import { averageScoreFromHistory } from "../services/interviewFeedback.helpers";
import { MAX_QUESTIONS } from "../constants/interview.constants";
import { getInterviewSummary } from "../services/interview.api";

const TERMINATION_COPY = {
  struggling: {
    title: 'Session ended early',
    body: "The last couple of answers scored below the minimum threshold for this role. That's completely okay — this is practice. Use the feedback below to identify exactly where to focus, and try again with those areas in mind.",
    bg: 'var(--color-background-warning, #FEF3C7)',
    color: 'var(--color-text-warning, #D97706)',
  },
  declining: {
    title: 'Session ended early',
    body: "Your scores were trending downward over the session. This often happens when fatigue or topic difficulty compounds. The breakdown below shows the exact inflection point — start your next session right there.",
    bg: 'var(--color-background-warning, #FEF3C7)',
    color: 'var(--color-text-warning, #D97706)',
  },
};

const PerformanceCurveChart = ({ sessionHealthLog }) => {
  if (!sessionHealthLog || sessionHealthLog.length < 2) return null;

  const data = sessionHealthLog.map((log, i) => ({
    name: `Q${i + 1}`,
    avg: log.avg,
  }));

  return (
    <div style={{ height: 180, marginBottom: '1.5rem', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip 
            formatter={(value) => [`${value} / 10`, 'Average']}
          />
          <Line 
            type="monotone" 
            dataKey="avg" 
            stroke="#2E75B6" 
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export function InterviewSummary() {
  const nav = useNavigate();
  const { history, role, setHistory, setStarted, earlyTerminationReason, sessionExtended, sessionHealthLog } = useInterview();
  const [report, setReport] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Mark session inactive once summary is shown (avoids /interview redirect race on End).
  useEffect(() => {
    setStarted(false);
  }, [setStarted]);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    let mounted = true;
    setIsLoadingReport(true);
    getInterviewSummary(sessionId, { earlyTermination: earlyTerminationReason, sessionExtended })
      .then((data) => {
        if (!mounted) return;
        setReport(data?.summary || null);
      })
      .catch((err) => {
        console.error("Summary fetch error:", err);
      })
      .finally(() => {
        if (mounted) setIsLoadingReport(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
            This session ended before any answer was saved. Start a new
            interview to practice.
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
  const endedEarly = earlyTerminationReason && earlyTerminationReason !== 'complete';
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

          <div className="lg:col-span-12 w-full space-y-4">
            {/* Early Termination Banner */}
            {earlyTerminationReason && TERMINATION_COPY[earlyTerminationReason] && (
              <div style={{
                background: TERMINATION_COPY[earlyTerminationReason].bg,
                padding: '1rem 1.25rem',
                borderLeft: `3px solid ${TERMINATION_COPY[earlyTerminationReason].color}`,
              }}>
                <p style={{ fontWeight: 500, color: TERMINATION_COPY[earlyTerminationReason].color, margin: '0 0 6px' }}>
                  {TERMINATION_COPY[earlyTerminationReason].title}
                </p>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary, #6B7280)', margin: 0, lineHeight: 1.6 }}>
                  {TERMINATION_COPY[earlyTerminationReason].body}
                </p>
              </div>
            )}

            {/* Session Extended Banner */}
            {sessionExtended && !earlyTerminationReason && (
              <div style={{
                background: 'var(--color-background-success, #ECFDF5)',
                borderRadius: '0.5rem',
                padding: '1rem 1.25rem',
              }}>
                <p style={{ fontWeight: 500, color: 'var(--color-text-success, #10B981)', margin: '0 0 4px' }}>
                  Extended session completed
                </p>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary, #6B7280)', margin: 0 }}>
                  Your strong performance unlocked bonus questions. Scores from extended questions are included in your overall average.
                </p>
              </div>
            )}

            {/* Performance Curve Chart */}
            <PerformanceCurveChart sessionHealthLog={sessionHealthLog} />
          </div>

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
            report={report}
            isLoadingReport={isLoadingReport}
            onNewInterview={handleNewInterview}
          />
        </div>
      </main>
    </div>
  );
}
