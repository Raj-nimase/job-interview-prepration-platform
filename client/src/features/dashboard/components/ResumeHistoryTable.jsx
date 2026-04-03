function formatDateLike(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function ResumeHistoryTable({ analyses }) {
  if (!analyses || analyses.length === 0) return null;

  const rows = analyses.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">
        Recent Resume Analyses
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-foreground">
              <th className="p-3 border-b border-border">File</th>
              <th className="p-3 border-b border-border">Target Role</th>
              <th className="p-3 border-b border-border">Overall</th>
              <th className="p-3 border-b border-border">ATS</th>
              <th className="p-3 border-b border-border">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition">
                <td className="p-3 border-b border-border">{a.fileName}</td>
                <td className="p-3 border-b border-border">{a.targetRole || "—"}</td>
                <td className="p-3 border-b border-border">{a.overallScore}</td>
                <td className="p-3 border-b border-border">{a.atsScore}</td>
                <td className="p-3 border-b border-border">
                  {formatDateLike(a.updatedAt || a.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

