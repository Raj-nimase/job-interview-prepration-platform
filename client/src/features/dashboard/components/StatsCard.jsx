export function StatsCard({ icon, value, label, subtext, colorClassName }) {
  
  return (
    <div
      className={`bg-card border border-border p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300`}
    >
      {icon}
      <h2 className={`text-xl font-bold ${colorClassName || ""}`}>{value}</h2>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      {subtext && (
        <p className="text-sm text-muted-foreground/60 mt-1 truncate" title={subtext}>
          {subtext}
        </p>
      )}
    </div>
  );
}

