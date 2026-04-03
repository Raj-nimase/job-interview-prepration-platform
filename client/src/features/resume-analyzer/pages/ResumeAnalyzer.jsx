import { motion } from "framer-motion";
import { FileSearch, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeAnalyzer } from "../hook/useResumeAnalyzer";
import { ResumeUploadForm } from "../components/ResumeUploadForm";
import { AnalysisResult } from "../components/AnalysisResult";

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
  } = useResumeAnalyzer();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 mb-4">
            <FileSearch size={28} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Upload your resume and get instant AI-powered feedback on content,
            formatting, ATS compatibility, and keyword optimization.
          </p>
        </motion.div>

        {/* Upload Form or Results */}
        {!analysis ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm"
          >
            <ResumeUploadForm
              file={file}
              onFileChange={setFile}
              targetRole={targetRole}
              onTargetRoleChange={setTargetRole}
              onSubmit={submitResume}
              isAnalyzing={isAnalyzing}
              error={error}
            />
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw size={16} />
                Analyze Another Resume
              </Button>
            </div>
            <AnalysisResult analysis={analysis} />
          </div>
        )}
      </div>
    </div>
  );
}
