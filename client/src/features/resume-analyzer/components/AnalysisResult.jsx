import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Download, TrendingUp } from "lucide-react";

const SECTION_LABELS = {
  contactInfo: "Contact Info",
  experience: "Professional Experience",
  education: "Education Alignment",
  skills: "Skill Coverage",
  formatting: "Parsing & Formatting",
};

const SECTION_HINTS = {
  contactInfo: "Completeness and professionalism",
  experience: "Action verb density and quantified impact",
  education: "Degree and certification relevance",
  skills: "Role-specific and in-demand skills",
  formatting: "Machine readability and ATS parsing",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

const MotionDiv = motion.div;

function toHundredScale(score) {
  const numeric = Number(score);
  if (Number.isNaN(numeric)) return 0;
  if (numeric <= 10) return Math.max(0, Math.min(100, numeric * 10));
  return Math.max(0, Math.min(100, numeric));
}

function getBarColor(score) {
  if (score >= 80) return "#34d399";
  if (score >= 65) return "#fbbf24";
  return "#f87171";
}

function getScoreLabel(score) {
  if (score >= 80) return "High role alignment with minor optimization gaps.";
  if (score >= 65) return "Good baseline with targeted improvements needed.";
  return "Requires significant refinement to improve match quality.";
}

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

function toInsightPoints(sectionFeedback) {
  if (!sectionFeedback) return [];
  return sectionFeedback
    .split(/\.|\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function toArray(value, max = 3) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).slice(0, max);
  if (typeof value === "string") {
    return value
      .split(/\n|\.|;/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, max);
  }
  return [];
}

export function AnalysisResult({
  analysis,
  targetRole,
  onBack,
  onOpenActionPlan,
}) {
  if (!analysis) return null;

  const overallScore = Math.round(toHundredScale(analysis.overallScore));
  const atsScore = Math.round(toHundredScale(analysis.atsScore));
  const sections = Object.entries(analysis.sections || {});
  const role = targetRole || "Not specified";
  const refId = analysis.referenceId || analysis.id || "ANALYSIS-REPORT";
  const lastScan = formatDateLike(
    analysis.lastScanAt || analysis.updatedAt || analysis.createdAt,
  );

  const strengths = (analysis.strengths || []).slice(0, 2);
  const foundKeywords = (analysis.keywords?.found || []).slice(0, 8);
  const missingKeywords = (analysis.keywords?.missing || []).slice(0, 8);

  return (
    <div className="h-full w-full bg-background">
      <div className="w-full mt-12 p-4 sm:p-6 lg:p-10 space-y-6">
        {/* Header */}
        <MotionDiv
          {...fadeUp(0)}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-5">
            <button
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-emerald-400"
              onClick={onBack}
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Dashboard
            </button>

            <div className="hidden h-4 w-px bg-white/10 sm:block" />

            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                Full Analysis Report
              </h1>

              <div className="mt-1 flex gap-4">
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-400">
                  {role}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {refId}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                size="lg"
                className="relative overflow-hidden border-emerald-400/40 bg-emerald-500 text-emerald-950  transition hover:bg-emerald-400 mr-5 "
                onClick={onOpenActionPlan}
              >
                <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <Download size={14} />
                <span className="relative z-[1]">Action Plan</span>
              </Button>
            </div>
          </div>
        </MotionDiv>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* LEFT */}
          <MotionDiv {...fadeUp(0.05)} className="xl:col-span-3 space-y-5">
            {/* Overall */}
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Overall Assessment
              </h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold">
                  {overallScore}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {analysis.summary || getScoreLabel(overallScore)}
              </p>
            </section>

            {/* ATS */}
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold text-foreground">
                ATS Match
              </h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold">
                  {atsScore}
                </span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {analysis.atsFeedback || getScoreLabel(atsScore)}
              </p>
            </section>
          </MotionDiv>

          {/* CENTER */}
          <MotionDiv {...fadeUp(0.1)} className="xl:col-span-6">
            <section className="rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-foreground">
                  Section Analysis
                </h2>
              </div>

              {sections.map(([key, section], i) => {
                const score = toHundredScale(section?.score);
                const insights = toInsightPoints(section?.feedback);
                const whatToAdd = toArray(section?.whatToAdd, 3);
                const improvements = toArray(section?.improvements, 3);

                return (
                  <MotionDiv
                    key={key}
                    {...fadeUp(0.12 + i * 0.03)}
                    className="px-6 py-4 border-b border-white/10 last:border-none"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-base font-semibold">
                          {SECTION_LABELS[key]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {SECTION_HINTS[key]}
                        </p>
                      </div>

                      <span
                        className="text-sm font-semibold"
                        style={{ color: getBarColor(score) }}
                      >
                        {score.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: getBarColor(score) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                      />
                    </div>

                    <ul className="mt-3 space-y-1">
                      {insights.map((point) => (
                        <li
                          key={point}
                          className="text-sm leading-relaxed text-muted-foreground"
                        >
                          • {point}
                        </li>
                      ))}
                    </ul>

                    {(whatToAdd.length > 0 || improvements.length > 0) && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {whatToAdd.length > 0 && (
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                              What To Add
                            </p>
                            <ul className="mt-2 space-y-1">
                              {whatToAdd.map((item, idx) => (
                                <li
                                  key={`${key}-add-${idx}`}
                                  className="text-sm text-muted-foreground leading-relaxed"
                                >
                                  + {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {improvements.length > 0 && (
                          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                              Improvement Steps
                            </p>
                            <ul className="mt-2 space-y-1">
                              {improvements.map((item, idx) => (
                                <li
                                  key={`${key}-improve-${idx}`}
                                  className="text-sm text-muted-foreground leading-relaxed"
                                >
                                  → {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </MotionDiv>
                );
              })}
            </section>
          </MotionDiv>

          {/* RIGHT */}
          <MotionDiv {...fadeUp(0.14)} className="xl:col-span-3 space-y-5">
            {/* Strengths */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground">
                Strengths
              </h2>

              <div className="mt-3 space-y-2">
                {strengths.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03]"
                  >
                    {idx === 0 ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <TrendingUp size={16} />
                    )}
                    <p className="text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Keywords */}
            <section className="p-6 rounded-xl border border-white/10 bg-white/[0.03]">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Keywords
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Found
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {foundKeywords.map((k) => (
                      <span
                        key={k}
                        className="px-2 py-1 text-xs font-medium rounded bg-emerald-500/10"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Missing
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {missingKeywords.map((k) => (
                      <span
                        key={k}
                        className="px-2 py-1 text-xs font-medium rounded bg-white/10"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}
