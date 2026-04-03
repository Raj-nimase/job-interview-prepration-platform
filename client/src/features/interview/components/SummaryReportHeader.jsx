import { BadgeCheck } from "lucide-react";

export function SummaryReportHeader({ role, overviewText, className = "" }) {
  return (
    <div className={className}>
       
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground my-5 tracking-tight leading-tight font-headline">
          {role}{" "}
          <span className="text-emerald-600 dark:text-emerald-400 italic">
            assessment
          </span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl">
          {overviewText}
        </p>
    </div>
  );
}
