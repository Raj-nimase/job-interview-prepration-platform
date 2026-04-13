import PerformancePulse from "./PerformancePulse";

export function WorkspaceSessionHeader({ answeredCount, role, questionCount, history, performanceStatus }) {
  const n = Math.min(answeredCount + 1, questionCount || 1);
  const pct = (n / (questionCount || 1)) * 100;

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mt-4">
        <div>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block font-headline">
            Session protocol
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-headline">
            Active interview
          </h2>
          {role && (
            <p className="text-sm text-muted-foreground mt-1">
              Role: <span className="font-medium text-foreground">{role}</span>
            </p>
          )}
        </div>
        <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
          <div className="font-headline font-bold text-muted-foreground text-sm flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mb-2">
            <span>Question {n} of {questionCount}</span>
            <PerformancePulse history={history} performanceStatus={performanceStatus} />
          </div>
          <div className="w-full sm:w-48 h-2 bg-muted rounded-full overflow-hidden shrink-0">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
