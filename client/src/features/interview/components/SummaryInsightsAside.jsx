import { Button } from "@/components/ui/button";
import { Brain, RotateCw, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SummaryInsightsAside({
  averageScore,
  questionCount,
  report,
  isLoadingReport,
  onNewInterview,
}) {
  const clarity =
    averageScore != null ? Math.min(99, Math.round(averageScore * 10)) : null;

  return (
    <aside className="xl:col-span-4 space-y-6">
      <div className="sticky top-8 space-y-6">
        <div className="bg-muted/40 p-6 md:p-8 rounded-3xl border border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">
              Session signal
            </h3>
          </div>
          {clarity != null && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Answer quality index</span>
                  <span className="text-emerald-600">{clarity}%</span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${clarity}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Comprehensive Summary Section */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <h4 className="text-sm font-bold text-foreground mb-4">
              AI Summary Report
            </h4>
            
            {isLoadingReport ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin mr-2" />
                  <span className="text-xs text-muted-foreground">Analyzing session...</span>
                </div>
              </div>
            ) : report ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Next-Level Edge</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {report.nextLevelEdge || "Great job completing the interview. Review your individual answers for specific strengths."}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Refinement Areas</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {report.refinementAreas || "Review the feedback on your questions to find areas for improvement."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Summary report is unavailable for this session.
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-8 leading-relaxed">
            Based on {questionCount} scored responses when the API returned a
            numeric score.
          </p>
        </div>

        <Button
          type="button"
          onClick={onNewInterview}
          className="w-full rounded-full py-7 text-base font-bold bg-gradient-to-br from-emerald-800 to-emerald-500 hover:from-emerald-900 hover:to-emerald-600 text-white shadow-lg no-print"
        >
          <RotateCw className="w-5 h-5 mr-2" />
          Start new interview
        </Button>
      </div>
    </aside>
  );
}
