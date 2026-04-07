import { useMemo } from "react";
import { jsPDF } from "jspdf";
import { FileDown, Map as MapIcon, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeedbackParts } from "../services/interviewFeedback.helpers";

function takeTop(items, limit = 3) {
  const counts = new Map();
  items
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .forEach((item) => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
}

function buildRoadmap({ role, history, report, averageScore }) {
  const parts = history.map((turn) => getFeedbackParts(turn.feedback));

  const strengths = takeTop(parts.flatMap((p) => p.strengths || []), 4);
  const weaknesses = takeTop(parts.flatMap((p) => p.weaknesses || []), 4);
  const suggestions = takeTop(parts.flatMap((p) => p.suggestions || []), 6);

  const nextLevel = String(report?.nextLevelEdge || "").trim();
  const refinements = String(report?.refinementAreas || "").trim();

  const focusAreas = weaknesses.length
    ? weaknesses
    : [
        "Answer structure and clarity",
        "Depth of technical explanation",
        "Real-world examples and tradeoffs",
      ];

  const actionItems = suggestions.length
    ? suggestions
    : [
        "Practice timed answers for core role concepts.",
        "Use STAR format for behavioral parts.",
        "Add one concrete example in every answer.",
      ];

  const wins = strengths.length
    ? strengths
    : ["Consistent effort", "Clear intent in responses"];

  return {
    title: `${role || "Interview"} Learning Roadmap`,
    scoreLine:
      averageScore != null
        ? `Current performance baseline: ${averageScore}/10`
        : "Current performance baseline: Not enough scored answers yet",
    summary:
      nextLevel ||
      "You have a solid base. The roadmap below prioritizes the highest-impact improvements first.",
    refinementSummary:
      refinements ||
      "Focus on sharpening weak spots with repeated practice and measurable checkpoints.",
    wins,
    phases: [
      {
        title: "Week 1: Foundation Reset",
        goal: "Fix recurring weak spots and improve consistency.",
        learn: focusAreas.slice(0, 3),
        tasks: actionItems.slice(0, 2),
      },
      {
        title: "Week 2: Depth and Application",
        goal: "Move from basic answers to practical, deep responses.",
        learn: focusAreas.slice(1, 4),
        tasks: actionItems.slice(2, 4),
      },
      {
        title: "Week 3: Interview Simulation",
        goal: "Perform under interview conditions with confidence.",
        learn: [
          "Speed and clarity under time pressure",
          "Follow-up handling and tradeoff thinking",
        ],
        tasks: actionItems.slice(4, 6),
      },
    ],
  };
}

function addParagraph(doc, text, x, y, maxWidth, lineHeight = 16) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function SummaryLearningRoadmap({ role, history, report, averageScore }) {
  const roadmap = useMemo(
    () => buildRoadmap({ role, history, report, averageScore }),
    [role, history, report, averageScore],
  );

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 44;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed = 60) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(roadmap.title, margin, y);
    y += 26;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y = addParagraph(doc, roadmap.scoreLine, margin, y, contentWidth, 15);
    y += 4;
    y = addParagraph(doc, `Executive summary: ${roadmap.summary}`, margin, y, contentWidth, 15);
    y += 4;
    y = addParagraph(
      doc,
      `Primary refinement direction: ${roadmap.refinementSummary}`,
      margin,
      y,
      contentWidth,
      15,
    );
    y += 14;

    ensureSpace(80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Strengths to Keep Building", margin, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    roadmap.wins.forEach((win) => {
      ensureSpace(24);
      y = addParagraph(doc, `- ${win}`, margin + 8, y, contentWidth - 8, 15);
    });
    y += 10;

    roadmap.phases.forEach((phase) => {
      ensureSpace(120);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(phase.title, margin, y);
      y += 18;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      y = addParagraph(doc, `Goal: ${phase.goal}`, margin, y, contentWidth, 15);
      y += 6;
      y = addParagraph(
        doc,
        `Topics: ${phase.learn.filter(Boolean).join(" | ")}`,
        margin,
        y,
        contentWidth,
        15,
      );
      y += 6;
      y = addParagraph(
        doc,
        `Tasks: ${phase.tasks.filter(Boolean).join(" | ") || "Practice one mock interview and review feedback."}`,
        margin,
        y,
        contentWidth,
        15,
      );
      y += 14;
    });

    const safeRole = String(role || "interview").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    doc.save(`${safeRole}-learning-roadmap.pdf`);
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-8 mb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <MapIcon className="w-5 h-5" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest">Learning roadmap</h3>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-headline">
            What to learn next
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Personalized from your per-question executive feedback, strengths, weaknesses, suggestions, and final summary.
          </p>
        </div>

        <Button
          type="button"
          onClick={downloadPdf}
          className="rounded-full px-6 py-5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {roadmap.phases.map((phase) => (
          <article key={phase.title} className="rounded-2xl border border-border bg-muted/20 p-5">
            <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <Target className="w-4 h-4" />
              <h4 className="text-sm font-bold text-foreground">{phase.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{phase.goal}</p>

            <div className="space-y-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                  Learn
                </p>
                {phase.learn.filter(Boolean).map((item, idx) => (
                  <p key={`${phase.title}-learn-${idx}`} className="text-sm text-foreground">
                    - {item}
                  </p>
                ))}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                  Practice
                </p>
                {(phase.tasks.filter(Boolean).length ? phase.tasks : ["Run a mock interview and review answer quality."]).map((item, idx) => (
                  <p key={`${phase.title}-task-${idx}`} className="text-sm text-foreground">
                    - {item}
                  </p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-foreground">
        <div className="flex items-center gap-2 mb-1 text-emerald-700">
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold">Executive direction</span>
        </div>
        <p className="leading-relaxed">{roadmap.summary}</p>
      </div>
    </section>
  );
}
