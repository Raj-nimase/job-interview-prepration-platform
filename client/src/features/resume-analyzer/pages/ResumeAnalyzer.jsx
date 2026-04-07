import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  FileChartColumnIncreasing,
  FileOutput,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResumeAnalyzer } from "../hook/useResumeAnalyzer";
import { ResumeUploadForm } from "../components/ResumeUploadForm";
import { AnalyzingScreen } from "../components/AnalyzingScreen";
import { AnalysisResult } from "../components/AnalysisResult";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

const MotionDiv = motion.div;
const COMPLETE_MODAL_AUTO_CLOSE_MS = 10000;

export function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const {
    file,
    setFile,
    targetRole,
    setTargetRole,
    analysis,
    history,
    isLoadingHistory,
    isAnalyzing,
    error,
    submitResume,
    fetchHistory,
    openHistoryAnalysis,
    resetAnalysis,
    view,
    justAnalyzed,
    setJustAnalyzed,
  } = useResumeAnalyzer();

  useEffect(() => {
    fetchHistory();
    // fetch once on mount for history list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === "results" && analysis && justAnalyzed) {
      setShowCompleteModal(true);
    }
  }, [view, analysis, justAnalyzed]);

  useEffect(() => {
    if (!showCompleteModal) return;
    const timeoutId = setTimeout(() => {
      setShowCompleteModal(false);
      setJustAnalyzed(false);
    }, COMPLETE_MODAL_AUTO_CLOSE_MS);
    return () => clearTimeout(timeoutId);
  }, [showCompleteModal, setJustAnalyzed]);

  const hasHistory = history.length > 0;

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0">
      <Dialog
        open={showCompleteModal}
        onOpenChange={(open) => {
          setShowCompleteModal(open);
          if (!open) setJustAnalyzed(false);
        }}
      >
        <DialogContent className="border-emerald-500/30 bg-background/95 backdrop-blur duration-300 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-3 data-[state=closed]:slide-out-to-bottom-2">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Analysis complete
            </DialogTitle>
            <DialogDescription>
              Next step: open your{" "}
              <span className="font-semibold text-emerald-400">
                Action Plan
              </span>{" "}
              to get a prioritized checklist of edits to apply.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCompleteModal(false);
                setJustAnalyzed(false);
              }}
            >
              Stay on report
            </Button>
            <Button
              type="button"
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
              onClick={() => {
                setShowCompleteModal(false);
                setJustAnalyzed(false);
                navigate("action-plan");
              }}
            >
              Go to Action Plan
              <ArrowRight size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence mode="wait">
        {/* ── UPLOAD ── */}
        {view === "upload" && (
          <MotionDiv
            key="upload"
            {...pageVariants}
            className="h-screen w-screen overflow-y-auto overflow-x-hidden pt-20 pb-12 px-4 flex flex-col items-center gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
          >
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Optimize Your Resume
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mt-2">
                Evaluate your CV against specific job roles and instantly
                identify ATS pitfalls to boost your chances.
              </p>
            </div>

            <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-sm">
              <ResumeUploadForm
                file={file}
                onFileChange={setFile}
                targetRole={targetRole}
                onTargetRoleChange={setTargetRole}
                onSubmit={submitResume}
                isAnalyzing={isAnalyzing}
                error={error}
              />
            </div>

            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Recent Analyses
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Open any previous resume report without re-uploading.
                  </p>
                </div>
                <Clock3 size={16} className="text-muted-foreground" />
              </div>

              <div className="mt-4 space-y-3">
                {isLoadingHistory && (
                  <p className="text-sm text-muted-foreground">
                    Loading your analysis history...
                  </p>
                )}

                {!isLoadingHistory && !hasHistory && (
                  <p className="text-sm text-muted-foreground">
                    No saved analyses yet. Analyze your first resume to build
                    history.
                  </p>
                )}

                {!isLoadingHistory &&
                  history.slice(0, 8).map((item) => {
                    const overall = Math.round(Number(item.overallScore || 0));
                    const ats = Math.round(Number(item.atsScore || 0));
                    const scannedOn = new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }).format(
                      new Date(item.updatedAt || item.createdAt || Date.now()),
                    );

                    return (
                      <div
                        key={item._id || item.analysisId || item.createdAt}
                        className="rounded-xl border border-border bg-background/40 px-4 py-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.fileName || "Resume analysis"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.targetRole || "General role"} · {scannedOn}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                                Overall {overall}/100
                              </span>
                              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-cyan-300">
                                ATS {ats}/100
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => openHistoryAnalysis(item)}
                            >
                              <FileChartColumnIncreasing size={14} />
                              Open Report
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="h-8 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                              onClick={() => {
                                openHistoryAnalysis(item);
                                navigate("/resume-analyzer/action-plan");
                              }}
                            >
                              <FileOutput size={14} />
                              Action Plan
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </MotionDiv>
        )}

        {/* ── ANALYZING ── */}
        {view === "analyzing" && (
          <MotionDiv
            key="analyzing"
            {...pageVariants}
            className="h-screen w-screen flex items-center justify-center"
          >
            <AnalyzingScreen onCancel={resetAnalysis} />
          </MotionDiv>
        )}

        {/* ── RESULTS ── */}
        {view === "results" && analysis && (
          <MotionDiv
            key="results"
            {...pageVariants}
            className="h-screen w-screen"
          >
            <AnalysisResult
              analysis={analysis}
              targetRole={targetRole}
              onBack={resetAnalysis}
              onOpenActionPlan={() => navigate("action-plan")}
            />
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
