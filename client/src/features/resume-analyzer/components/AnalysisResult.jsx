import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Tag,
  AlertCircle,
  TrendingUp,
  FileText,
  Zap,
} from "lucide-react";
import { ScoreRing } from "./ScoreRing";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

export function AnalysisResult({ analysis }) {
  if (!analysis) return null;

  const sectionEntries = analysis.sections
    ? Object.entries(analysis.sections)
    : [];

  const getSectionLabel = (key) => {
    const labels = {
      contactInfo: "Contact Info",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      formatting: "Formatting",
    };
    return labels[key] || key;
  };

  const getScoreBarColor = (score) => {
    if (score >= 8) return "bg-emerald-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreBadge = (score) => {
    if (score >= 8)
      return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30";
    if (score >= 6)
      return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30";
    if (score >= 4)
      return "bg-orange-500/10 text-orange-600 border border-orange-500/30";
    return "bg-red-500/10 text-red-600 border border-red-500/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-w-0 space-y-4"
    >
      {/* ── Score Hero Card ── */}
      <motion.div
        {...fadeUp(0)}
        className="bg-card border border-border rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-8">
          {/* Rings */}
          <div className="flex items-center gap-8">
            <ScoreRing
              score={analysis.overallScore || 0}
              label="Overall"
              size={120}
              strokeWidth={10}
            />
            <ScoreRing
              score={analysis.atsScore || 0}
              label="ATS Match"
              size={120}
              strokeWidth={10}
            />
          </div>
          {/* Summary text */}
          <div className="flex-1 min-w-[200px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <TrendingUp size={12} className="text-emerald-500" />
              Analysis Summary
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Here's how your resume performed
            </h2>
            {analysis.summary && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.summary}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── 2×2 Grid: Strengths | Areas | Section | Action ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        {analysis.strengths?.length > 0 && (
          <motion.div
            {...fadeUp(0.08)}
            className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="p-2 rounded-xl bg-emerald-500/10">
                <CheckCircle size={16} className="text-emerald-500" />
              </span>
              <h4 className="text-base font-bold text-foreground">
                Top Strengths
              </h4>
              <span className="ml-auto text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                {analysis.strengths.length}
              </span>
            </div>
            <ul className="space-y-2.5">
              {analysis.strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-card rounded-xl px-3.5 py-2.5 border border-border/60 shadow-sm"
                >
                  <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80 min-w-0">{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Areas to Improve */}
        {analysis.weaknesses?.length > 0 && (
          <motion.div
            {...fadeUp(0.12)}
            className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="p-2 rounded-xl bg-yellow-500/10">
                <AlertTriangle size={16} className="text-yellow-500" />
              </span>
              <h4 className="text-base font-bold text-foreground">
                Areas to Improve
              </h4>
              <span className="ml-auto text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full bg-yellow-500/15 text-yellow-600">
                {analysis.weaknesses.length}
              </span>
            </div>
            <ul className="space-y-2.5">
              {analysis.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-card rounded-xl px-3.5 py-2.5 border border-border/60 shadow-sm"
                >
                  <AlertTriangle size={15} className="text-yellow-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80 min-w-0">{w}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Section Breakdown */}
        {sectionEntries.length > 0 && (
          <motion.div
            {...fadeUp(0.16)}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="p-2 rounded-xl bg-muted">
                <FileText size={16} className="text-muted-foreground" />
              </span>
              <h3 className="text-base font-bold text-foreground">
                Section Breakdown
              </h3>
            </div>
            <div className="space-y-4">
              {sectionEntries.map(([key, section]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {getSectionLabel(key)}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreBadge(section.score)}`}>
                      {section.score} / 10
                    </span>
                  </div>
                  {section.feedback && (
                    <p className="text-xs text-muted-foreground mb-1.5">{section.feedback}</p>
                  )}
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getScoreBarColor(section.score)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(section.score / 10) * 100}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Plan (Suggestions) */}
        {analysis.suggestions?.length > 0 && (
          <motion.div
            {...fadeUp(0.2)}
            className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="p-2 rounded-xl bg-blue-500/10">
                <Lightbulb size={16} className="text-blue-500" />
              </span>
              <h4 className="text-base font-bold text-foreground">
                Action Plan
              </h4>
            </div>
            <ul className="space-y-2.5">
              {analysis.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-card rounded-xl px-3.5 py-2.5 border border-border/60 shadow-sm"
                >
                  <span className="p-1 rounded-md bg-blue-500/10 shrink-0 mt-0.5">
                    <Zap size={11} className="text-blue-500" />
                  </span>
                  <span className="text-sm text-foreground/80 min-w-0">{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* ── ATS Keywords (full width) ── */}
      {analysis.keywords && (
        <motion.div
          {...fadeUp(0.24)}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-muted">
              <Tag size={16} className="text-emerald-500" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              ATS Keywords
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {analysis.keywords.found?.length > 0 && (
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle size={13} className="shrink-0" />
                  Successfully Found
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.found.map((k, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-background text-emerald-700 dark:text-emerald-400 text-xs rounded-lg font-medium border border-emerald-500/30"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.keywords.missing?.length > 0 && (
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0" />
                  Missing (Consider Adding)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.missing.map((k, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-background text-red-600 dark:text-red-400 text-xs rounded-lg font-medium border border-red-400/40"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
