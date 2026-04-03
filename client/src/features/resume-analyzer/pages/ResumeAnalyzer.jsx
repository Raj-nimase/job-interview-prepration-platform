import { AnimatePresence, motion } from "framer-motion";
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

export function ResumeAnalyzer() {
  const {
    file,
    setFile,
    targetRole,
    setTargetRole,
    analysis,
    isAnalyzing,
    error,
    submitResume,
    resetAnalysis,
    view,
  } = useResumeAnalyzer();

  return (
    <div className="h-screen w-screen bg-background">
      <AnimatePresence mode="wait">
        {/* ── UPLOAD ── */}
        {view === "upload" && (
          <MotionDiv
            key="upload"
            {...pageVariants}
            className="h-screen w-screen pt-20 pb-12 px-4 flex flex-col items-center justify-center gap-3"
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
            />
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
