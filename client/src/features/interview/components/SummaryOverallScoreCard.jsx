import { TrendingUp } from "lucide-react";

export function SummaryOverallScoreCard({ averageScore, questionCount }) {
  return (
    <div className="lg:col-span-4 flex justify-start lg:justify-end items-start">
      {averageScore != null ? (
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-500 p-1 rounded-3xl shadow-xl w-full max-w-[280px] my-8">
          <div className="bg-card rounded-[1.25rem] p-8 text-center border border-border/50">
            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
              Overall score
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl md:text-7xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter font-headline">
                {averageScore}
              </span>
              <span className="text-xl text-muted-foreground font-bold">/10</span>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              Across {questionCount} questions
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-3xl border border-border p-8 w-full max-w-[280px] text-center">
          <span className="block text-xs font-bold text-muted-foreground uppercase tracking-tight mb-2">
            Overall score
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No numeric scores were returned for this session. Review narrative
            feedback in each block.
          </p>
        </div>
      )}
    </div>
  );
}
