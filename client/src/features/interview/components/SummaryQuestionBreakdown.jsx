import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 text-blue-600 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">
                    Executive Feedback
                  </h4>
                </div>
                <div
                  className="text-foreground text-sm md:text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: parts.text.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            )}

            {(parts.nextLevelEdge || parts.refinementAreas) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-border">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <div className="flex items-center gap-2 text-emerald-600 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">
                      Next-level edge
                    </h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {parts.nextLevelEdge ||
                      "Lean into the strongest part of this answer in future interviews."}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">
                      Refinement areas
                    </h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {parts.refinementAreas ||
                      "Tighten the weakest part of the response before the next round."}
                  </p>
                </div>
              </div>
            )}

            {(parts.strengths?.length > 0 ||
              parts.weaknesses?.length > 0 ||
              parts.suggestions?.length > 0) && (
              <div className="space-y-4 mt-6 pt-5 border-t border-border">
                {parts.strengths?.length > 0 && (
                  <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                    <div className="flex items-center gap-2 text-green-600 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-widest">
                        Strengths
                      </h4>
                    </div>
                    <ul className="text-sm text-foreground leading-relaxed space-y-2">
                      {parts.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5">
                            •
                          </span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {parts.weaknesses?.length > 0 && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                    <div className="flex items-center gap-2 text-red-600 mb-3">
                      <AlertCircle className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-widest">
                        Weaknesses
                      </h4>
                    </div>
                    <ul className="text-sm text-foreground leading-relaxed space-y-2">
                      {parts.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-600 font-bold mt-0.5">
                            •
                          </span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {parts.suggestions?.length > 0 && (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <div className="flex items-center gap-2 text-blue-600 mb-3">
                      <Lightbulb className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-widest">
                        Suggestions for Improvement
                      </h4>
                    </div>
                    <ul className="text-sm text-foreground leading-relaxed space-y-2">
                      {parts.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">
                            •
                          </span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
