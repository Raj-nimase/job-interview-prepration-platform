import { getFeedbackParts } from "../services/interviewFeedback.helpers";

const TAGS = ["Core competency", "Depth", "Communication", "Leadership"];

export function SummaryQuestionBreakdown({ history }) {
  return (
    <section className="xl:col-span-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 font-headline">
          <span className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm">
            {String(history.length).padStart(2, "0")}
          </span>
          Detailed breakdown
        </h2>
      </div>

      {history.map((turn, index) => {
        const parts = getFeedbackParts(turn.feedback);
        const tag = TAGS[index % TAGS.length];
        const isFirst = index === 0;

        return (
          <article
            key={index}
            className={`p-8 md:p-10 rounded-3xl transition-all border shadow-sm ${
              isFirst
                ? "bg-muted/40 border-l-[8px] border-l-emerald-500 border-y border-r border-border"
                : "bg-card border border-border hover:bg-muted/20"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/15 px-2 py-0.5 rounded">
                  {tag}
                </span>
                <h3 className="text-xl md:text-2xl font-bold mt-2 text-foreground font-headline">
                  Question {index + 1}
                </h3>
              </div>
              {parts.score != null && (
                <div className="bg-card px-4 py-3 rounded-2xl shadow-sm border border-border shrink-0">
                  <span className="text-lg font-bold text-emerald-600 tracking-tight">
                    {parts.score}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {" "}
                    / 10
                  </span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-base italic mb-4 font-medium leading-relaxed">
              &ldquo;{turn.question}&rdquo;
            </p>
            <p className="text-foreground text-sm md:text-base leading-relaxed mb-4">
              <span className="font-semibold text-muted-foreground">
                Your answer:{" "}
              </span>
              {turn.answer}
            </p>
            {parts.text && (
              <div
                className="text-muted-foreground text-sm md:text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none border-t border-border pt-4"
                dangerouslySetInnerHTML={{
                  __html: parts.text.replace(/\n/g, "<br />"),
                }}
              />
            )}
          </article>
        );
      })}
    </section>
  );
}
