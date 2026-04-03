import { Button } from "@/components/ui/button";
import { Brain, RotateCw } from "lucide-react";

export function SummaryInsightsAside({
  averageScore,
  questionCount,
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
          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
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
