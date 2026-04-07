import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { useResumeAnalyzer } from "../hook/useResumeAnalyzer";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";

const MotionDiv = motion.div;

const SECTION_META = {
  contactInfo: { label: "Contact Info", group: "content" },
  experience: { label: "Professional Experience", group: "content" },
  education: { label: "Education", group: "content" },
  skills: { label: "Skills", group: "content" },
  formatting: { label: "Formatting", group: "formatting" },
};

const TABS = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "formatting", label: "Formatting" },
  { id: "content", label: "Content" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
});

function toHundredScale(score) {
  const numeric = Number(score);
  if (Number.isNaN(numeric)) return 0;
  if (numeric <= 10) return Math.max(0, Math.min(100, numeric * 10));
  return Math.max(0, Math.min(100, numeric));
}

function getScoreTone(score) {
  if (score >= 80) {
    return {
      ring: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      bar: "bg-emerald-400",
      label: "Strong",
    };
  }
  if (score >= 65) {
    return {
      ring: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      bar: "bg-amber-400",
      label: "Needs polish",
    };
  }
  return {
    ring: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    bar: "bg-rose-400",
    label: "Critical",
  };
}

function normalizeItems(value, max = 4) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, max);
  }
  if (typeof value === "string") {
    return value
      .split(/\n|\.|;/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, max);
  }
  return [];
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

function buildDownloadText(analysis, sections) {
  const lines = [];
  lines.push("Resume Action Plan");
  lines.push("==================");
  lines.push("");
  lines.push(
    `Overall Score: ${Math.round(toHundredScale(analysis.overallScore))}/100`,
  );
  lines.push(`ATS Score: ${Math.round(toHundredScale(analysis.atsScore))}/100`);
  lines.push(`Target Role: ${analysis.targetRole || "Not specified"}`);
  lines.push(
    `Generated: ${formatDateLike(analysis.updatedAt || analysis.createdAt)}`,
  );
  lines.push("");

  if (analysis.summary) {
    lines.push("Summary");
    lines.push("-------");
    lines.push(analysis.summary);
    lines.push("");
  }

  lines.push("Section Improvements");
  lines.push("--------------------");
  sections.forEach((section) => {
    lines.push("");
    lines.push(
      `${section.label || "Section"} (${section.score ?? 0}/100) - ${section.status || "Needs review"}`,
    );
    if (section.feedback) lines.push(`Feedback: ${section.feedback}`);
    if ((section.whatToAdd || []).length) {
      lines.push("What To Add:");
      (section.whatToAdd || []).forEach((item) => lines.push(`- ${item}`));
    }
    if ((section.improvements || []).length) {
      lines.push("Action Plan:");
      (section.improvements || []).forEach((item) => lines.push(`- ${item}`));
    }
    if ((section.plan || []).length) {
      lines.push("Tasks:");
      (section.plan || []).forEach((task) => lines.push(`- ${task}`));
    }
  });

  if ((analysis.keywords?.missing || []).length) {
    lines.push("");
    lines.push("Missing Keywords");
    lines.push("----------------");
    normalizeItems(analysis.keywords?.missing, 20).forEach((item) => {
      lines.push(`- ${item}`);
    });
  }

  if ((analysis.actionPlan || []).length) {
    lines.push("");
    lines.push("Prioritized Action Plan");
    lines.push("----------------------");
    analysis.actionPlan.forEach((item, index) => {
      lines.push("");
      lines.push(`${index + 1}. ${item.title || "Resume improvement task"}`);
      lines.push(`Priority: ${item.priority || "medium"}`);
      if (item.targetSection) lines.push(`Section: ${item.targetSection}`);
      if (item.rationale) lines.push(`Why: ${item.rationale}`);
      if (item.estimatedImpact) lines.push(`Impact: ${item.estimatedImpact}`);
      normalizeItems(item.tasks, 10).forEach((task) => lines.push(`- ${task}`));
    });
  }

  return lines.join("\n");
}

function downloadTextAsPdf(text, fileName = "resume-action-plan.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  const marginTop = 46;
  const lineHeight = 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const wrappedLines = text
    .split("\n")
    .flatMap((line) =>
      line ? doc.splitTextToSize(line, pageWidth - marginX * 2) : [""],
    );

  let y = marginTop;
  wrappedLines.forEach((line) => {
    if (y > pageHeight - marginTop) {
      doc.addPage();
      y = marginTop;
    }
    doc.text(line, marginX, y);
    y += lineHeight;
  });

  doc.save(fileName);
}

export function ActionPlanPage() {
  const navigate = useNavigate();
  const { analysis } = useResumeAnalyzer();
  const [activeTab, setActiveTab] = useState("all");
  const [expandedSection, setExpandedSection] = useState("contactInfo");

  const allSections = useMemo(() => {
    const source = analysis?.sections || {};
    return Object.entries(SECTION_META)
      .map(([key, meta]) => {
        const section = source[key] || {};
        const score = Math.round(toHundredScale(section.score));
        const tone = getScoreTone(score);
        const plan = normalizeItems(section.improvements, 4);
        const whatToAdd = normalizeItems(section.whatToAdd, 4);
        const issues = normalizeItems(section.issues, 3);
        const examples = normalizeItems(section.examples, 2);

        return {
          key,
          ...meta,
          score,
          tone,
          feedback: section.feedback || "",
          plan,
          whatToAdd,
          issues,
          examples,
          actionItems:
            (analysis?.actionPlan || []).filter(
              (item) =>
                String(item?.targetSection || "").toLowerCase() ===
                key.toLowerCase(),
            ) || [],
        };
      })
      .filter(Boolean);
  }, [analysis]);

  const sections = useMemo(() => {
    return allSections.filter((section) => {
      if (activeTab === "critical") return section.score < 65;
      if (activeTab === "formatting") return section.key === "formatting";
      if (activeTab === "content") return section.group === "content";
      return true;
    });
  }, [allSections, activeTab]);

  useEffect(() => {
    if (sections.length === 0) return;
    // Allow users to collapse all rows by keeping explicit empty selection.
    if (expandedSection === "") return;
    if (!sections.some((section) => section.key === expandedSection)) {
      setExpandedSection(sections[0].key);
    }
  }, [sections, expandedSection]);

  const summary =
    analysis?.summary ||
    "Generated recommendations to help improve ATS match and recruiter readiness.";
  const overallScore = Math.round(toHundredScale(analysis?.overallScore));
  const atsScore = Math.round(toHundredScale(analysis?.atsScore));

  const downloadPlan = () => {
    if (!analysis) return;
    const text = buildDownloadText(analysis, allSections);
    downloadTextAsPdf(text, "resume-action-plan.pdf");
  };

  return (
    <div className="min-h-screen text-zinc-100 pt-20 pb-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <MotionDiv
          {...fadeUp(0)}
          className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 text-zinc-300 hover:bg-white/5 hover:text-white"
              onClick={() => navigate("/resume-analyzer")}
            >
              <ArrowLeft size={15} />
              Back
            </Button>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/90">
                Resume Analyzer
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Action Plan
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.08]"
              onClick={downloadPlan}
              disabled={!analysis}
            >
              <Download size={15} />
              Download Plan
            </Button>
          </div>
        </MotionDiv>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <MotionDiv {...fadeUp(0.04)} className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-background p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-md font-semibold text-foreground uppercase">
                    Detailed, prioritized checklist of resume improvements to
                    beat the ATS
                  </p>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    {summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300/80">
                      Overall
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {Number.isFinite(overallScore) ? overallScore : 0}
                    </p>
                    <p className="text-xs text-zinc-400">/100</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/8 p-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">
                      ATS
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {Number.isFinite(atsScore) ? atsScore : 0}
                    </p>
                    <p className="text-xs text-zinc-400">/100</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 border-b border-white/8 pb-4">
                {TABS.map((tab) => {
                  const count = allSections.filter((section) => {
                    if (tab.id === "critical") return section.score < 65;
                    if (tab.id === "formatting")
                      return section.key === "formatting";
                    if (tab.id === "content")
                      return section.group === "content";
                    return true;
                  }).length;

                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                          : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 text-xs text-zinc-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-3">
                {sections.map((section) => {
                  const expanded = expandedSection === section.key;
                  const sectionPlan = section.actionItems.length
                    ? section.actionItems.flatMap((item) =>
                        normalizeItems(item.tasks, 3),
                      )
                    : section.plan;
                  const title = SECTION_META[section.key]?.label || section.key;

                  return (
                    <motion.div
                      layout
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      key={section.key}
                      className={`overflow-hidden rounded-2xl border transition ${
                        expanded
                          ? "border-emerald-500/30 bg-white/[0.03]"
                          : "border-white/8 bg-white/[0.015] hover:bg-white/[0.03]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSection(expanded ? "" : section.key)
                        }
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`mt-1 h-2.5 w-2.5 rounded-full ${section.tone.bar}`}
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                                {title}
                              </h3>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] ${section.tone.ring}`}
                              >
                                {section.tone.label}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-zinc-400">
                              {section.feedback ||
                                "Section-level improvements and resume editing guidance."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="hidden min-w-[130px] sm:block">
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                              <div
                                className={`h-full ${section.tone.bar}`}
                                style={{ width: `${section.score}%` }}
                              />
                            </div>
                            <p className="mt-1 text-right text-xs text-zinc-500">
                              {section.score}/100
                            </p>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ease-out ${expanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            key="expanded-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.24,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/8 px-4 py-4 sm:px-5">
                              <div className="grid gap-4 lg:grid-cols-2">
                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                  <div className="flex items-center gap-2 text-emerald-300">
                                    <FileText size={15} />
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                                      What To Add
                                    </p>
                                  </div>

                                  <div className="mt-3 space-y-2">
                                    {section.whatToAdd.length > 0 ? (
                                      section.whatToAdd.map((item) => (
                                        <div
                                          key={`${section.key}-what-${item}`}
                                          className="rounded-xl border border-emerald-500/15 px-3 py-3 text-sm leading-relaxed text-zinc-200"
                                        >
                                          {item}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-zinc-400">
                                        Add role-specific content, measurable
                                        impact, and concise recruiter-friendly
                                        detail.
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                                  <div className="flex items-center gap-2 text-cyan-300">
                                    <Sparkles size={15} />
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                                      Action Plan
                                    </p>
                                  </div>

                                  <div className="mt-3 space-y-2">
                                    {sectionPlan.length > 0 ? (
                                      sectionPlan.map((item) => (
                                        <div
                                          key={`${section.key}-task-${item}`}
                                          className="rounded-xl border border-cyan-500/15 bg-[#0f1511] px-3 py-3 text-sm leading-relaxed text-zinc-200"
                                        >
                                          {item}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-zinc-400">
                                        Rewrite this section with stronger
                                        keywords and clearer outcomes.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                                <div className="rounded-2xl border border-white/8 bg-[#0d120f] p-4">
                                  <div className="flex items-center gap-2 text-zinc-400">
                                    <Wrench size={15} />
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                                      Issues
                                    </p>
                                  </div>
                                  <ul className="mt-3 space-y-2">
                                    {section.issues.length > 0 ? (
                                      section.issues.map((item) => (
                                        <li
                                          key={`${section.key}-issue-${item}`}
                                          className="text-sm text-zinc-300"
                                        >
                                          • {item}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-sm text-zinc-500">
                                        No issues extracted.
                                      </li>
                                    )}
                                  </ul>
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-[#0d120f] p-4">
                                  <div className="flex items-center gap-2 text-zinc-400">
                                    <Target size={15} />
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                                      Suggestions
                                    </p>
                                  </div>
                                  <ul className="mt-3 space-y-2">
                                    {section.examples.length > 0 ? (
                                      section.examples.map((item) => (
                                        <li
                                          key={`${section.key}-example-${item}`}
                                          className="text-sm text-zinc-300"
                                        >
                                          • {item}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-sm text-zinc-500">
                                        Add concise examples or rewritten bullet
                                        lines.
                                      </li>
                                    )}
                                  </ul>
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-[#0d120f] p-4">
                                  <div className="flex items-center gap-2 text-zinc-400">
                                    <CheckCircle2 size={15} />
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                                      Next Step
                                    </p>
                                  </div>
                                  <div className="mt-3 space-y-2 text-sm text-zinc-300">
                                    <p>
                                      Increase this section toward a score of
                                      80+ by adding evidence, clarity, and
                                      keywords.
                                    </p>
                                    <p className="text-zinc-500">
                                      {section.plan.length
                                        ? "Use the action items on the right to update your resume draft."
                                        : "Focus on clarity, metrics, and role alignment."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {sections.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-400">
                    No section analysis is available yet. Run a resume analysis
                    to generate the action plan.
                  </div>
                )}
              </div>
            </section>
          </MotionDiv>

          <MotionDiv
            {...fadeUp(0.08)}
            className="space-y-6 xl:sticky xl:top-24 xl:self-start"
          >
            <section className="rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    Export
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-white">
                    Download your checklist
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-emerald-300">
                  <Download size={18} />
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Save the full action plan as a markdown file so you can update
                your resume section by section later.
              </p>

              <Button
                type="button"
                className="mt-5 w-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                onClick={downloadPlan}
                disabled={!analysis}
              >
                <Download size={15} />
                Download Action Plan
              </Button>

              <button
                type="button"
                onClick={() => navigate("/resume-analyzer")}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]"
              >
                <ExternalLink size={15} />
                Back to analysis
              </button>
            </section>

            <section className="rounded-3xl border border-white/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Priorities
              </p>
              <div className="mt-4 space-y-3">
                {(analysis?.actionPlan || []).slice(0, 4).map((item, index) => (
                  <div
                    key={`${item.title || "task"}-${index}`}
                    className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.title || "Resume improvement task"}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                          {String(item.priority || "medium").toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {(!analysis?.actionPlan ||
                  analysis.actionPlan.length === 0) && (
                  <p className="text-sm text-zinc-500">
                    No generated priority items yet.
                  </p>
                )}
              </div>
            </section>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}
