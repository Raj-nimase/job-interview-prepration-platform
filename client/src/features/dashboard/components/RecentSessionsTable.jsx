export function RecentSessionsTable({ sessions }) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">
        Recent Interview Sessions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-foreground">
              <th className="p-3 border-b border-border">Role</th>
              <th className="p-3 border-b border-border">Score</th>
              <th className="p-3 border-b border-border">Questions Attempted</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition">
                <td className="p-3 border-b border-border">{session.role}</td>
                <td className="p-3 border-b border-border">{session.overallScore}</td>
                <td className="p-3 border-b border-border">
                  {session.questionsAttempted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

