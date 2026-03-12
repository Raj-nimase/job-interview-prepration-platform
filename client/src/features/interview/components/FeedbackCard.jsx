import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export function FeedbackCard({ feedback, isLoading }) {
  if (!isLoading && !feedback) return null;

  const feedbackText =
    typeof feedback === "string" ? feedback : feedback?.feedback || "";

  return (
    <Card className="shadow-xl border-t-4 border-[#00d084] ">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-3 text-white">
          <Sparkles className="text-[#00d084]" />
          AI Feedback
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full bg-white/10" />
            <Skeleton className="h-5 w-full bg-white/10" />
            <Skeleton className="h-5 w-5/6 bg-white/10" />
          </div>
        ) : (
          feedback && (
            <div className="space-y-4 text-white/90">
              {/* Score badge */}
              {typeof feedback === "object" && feedback.score !== undefined && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                    Score
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 font-bold text-lg">
                    {feedback.score}/10
                  </span>
                </div>
              )}

              {/* Main feedback text */}
              <div
                className="prose prose-invert prose-base max-w-none"
                dangerouslySetInnerHTML={{
                  __html: feedbackText.replace(/\n/g, "<br />"),
                }}
              />

              {/* Strengths */}
              {typeof feedback === "object" &&
                feedback.strengths?.length > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-emerald-400 mb-2">
                      ✓ Strengths
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {feedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Weaknesses */}
              {typeof feedback === "object" &&
                feedback.weaknesses?.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-red-400 mb-2">
                      ✗ Areas to Improve
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {feedback.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Suggestions */}
              {typeof feedback === "object" &&
                feedback.suggestions?.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">
                      → Suggestions
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {feedback.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
