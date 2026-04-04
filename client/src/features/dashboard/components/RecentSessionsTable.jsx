import { TrendingUp, AlertTriangle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RecentSessionsTable({ sessions }) {
  const navigate = useNavigate();
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">
        Recent Interview Sessions
      </h2>
      <div className="overflow-x-auto space-y-4">
        {sessions.map((session, idx) => (
          <div
            key={idx}
            className="group bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-emerald-500/50 hover:shadow-emerald-500/10 cursor-pointer transition-all relative"
            onClick={() => session.id && navigate(`/interview-report/${session.id}`)}
          >
            <div className="absolute top-5 right-5 text-emerald-500/0 group-hover:text-emerald-500/100 transition-colors">
              <ExternalLink className="w-5 h-5" />
            </div>
            
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {session.role}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {session.createdAt
                    ? new Date(session.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently"}
                </p>
              </div>
              <div className="flex gap-4 text-sm font-medium pr-8">
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">
                  Score: {session.overallScore?.toFixed(1)}/10
                </div>
                <div className="bg-muted px-3 py-1 rounded-full text-foreground">
                  Q's Attempted: {session.questionsAttempted}
                </div>
              </div>
            </div>

            {session.summary ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/60">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Next-Level Edge
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {session.summary.nextLevelEdge}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Refinement Areas
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {session.summary.refinementAreas}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-border/60 text-sm text-muted-foreground italic">
                No advanced feedback generated for this session.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

