import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Volume2 } from "lucide-react";

export function QuestionCard({ question, isLoading, onPlayTTS, role }) {
  const badgeLabel = role ? role.split(" ").slice(0, 2).join(" ") : "Interview";

  return (
    <div className="relative bg-card rounded-[2rem] p-8 md:p-12 shadow-[0px_12px_32px_rgba(25,28,30,0.06)] border border-border/80 mb-6 md:mb-8">
      <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-500/20">
        <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
        {badgeLabel}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {isLoading ? (
          <div className="space-y-2 flex-1 pt-1">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-4/5" />
          </div>
        ) : (
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight max-w-4xl font-headline pr-2">
            &ldquo;{question}&rdquo;
          </h3>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPlayTTS(question)}
          disabled={isLoading || !question}
          className="shrink-0 text-muted-foreground hover:text-emerald-600 rounded-full"
          aria-label="Play question audio"
        >
          <Volume2 className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
