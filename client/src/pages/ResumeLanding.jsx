import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, ChevronRight } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
//import { API_TTS_BASE } from "@/lib/api";

const JOB_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Other",
];

export default function ResumeLanding() {
  const nav = useNavigate();
  const previewImage = "https://assets.resume-now.com/blobimages/rna/sem/images/karthikChoudhryResume.png?w=678";

  const [modalOpen, setModalOpen] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [confirmResume, setConfirmResume] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const handleStartAnalysis = async () => {
    if (!jobRole || !confirmResume) return;
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await axios.post(`${API_TTS_BASE}/api/analyze-resume`, {
        jobRole,
        resumeData: { confirmed: true },
      });
      setAnalysisResult(res.data);
      setModalOpen(false);
      setPanelOpen(true);
      setJobRole("");
      setConfirmResume(false);
    } catch (err) {
      setAnalysisError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const canSubmit = jobRole && confirmResume && !analyzing;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20 relative">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:flex lg:justify-between items-center gap-10 lg:gap-12 flex-1">
        <section className="flex-1 animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-emerald-500 font-extrabold leading-tight mb-4">
            Build a resume that gets you hired fast.
          </h1>
          <p className="text-muted-foreground mb-6 max-w-xl">
            Choose a recruiter-approved template, fill your information and download a professional resume in PDF.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => nav("/resumetemplate")}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all"
            >
              Choose Template
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all"
            >
              Analyze Resume
            </button>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm text-muted-foreground">
            <div className="p-3 bg-card rounded-xl border border-border hover:border-emerald-500/30 transition">ATS Friendly</div>
            <div className="p-3 bg-card rounded-xl border border-border hover:border-emerald-500/30 transition">Download PDF</div>
            <div className="p-3 bg-card rounded-xl border border-border hover:border-emerald-500/30 transition">6 Templates</div>
            <div className="p-3 bg-card rounded-xl border border-border hover:border-emerald-500/30 transition">Fully Responsive</div>
          </div>
        </section>

        {/* Image Preview */}
        <section className="w-full lg:w-1/2 animate-fadeIn">
          <div className="bg-card p-4 rounded-2xl shadow-xl border border-border hover:shadow-2xl hover:border-emerald-500/20 transform hover:scale-[1.02] transition-all duration-300">
            <img
              src={previewImage}
              alt="Resume Example Preview"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </section>
      </main>

      {/* Advantages Section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl text-foreground mb-6">Why Choose Our Builder?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-2xl border border-border hover:border-emerald-500/30 shadow-lg transition">📄 Professional Templates</div>
          <div className="p-6 bg-card rounded-2xl border border-border hover:border-emerald-500/30 shadow-lg transition">⚡ Build in Minutes</div>
          <div className="p-6 bg-card rounded-2xl border border-border hover:border-emerald-500/30 shadow-lg transition">💼 Recruiter Approved</div>
        </div>
      </section>

      {/* Ratings */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
          <div className="flex justify-center gap-1 text-yellow-500 text-xl">
            ★★★★★
          </div>
          <p className="text-lg text-foreground">Rated <strong>4.9/5</strong> by thousands of professionals</p>
          <blockquote className="italic text-muted-foreground">
            “The easiest and fastest way to create a resume that stands out!”
          </blockquote>
        </div>
      </section>
      
      {/* Analyze Resume Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Analyze Resume</DialogTitle>
            <DialogDescription>
              Select your target job role and confirm your resume data to receive tailored analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="job-role">Job Role</Label>
              <Select value={jobRole} onValueChange={setJobRole}>
                <SelectTrigger id="job-role" className="w-full">
                  <SelectValue placeholder="Select a job role" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirm-resume"
                checked={confirmResume}
                onChange={(e) => setConfirmResume(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="confirm-resume" className="text-sm font-normal cursor-pointer">
                I confirm my resume information is complete and accurate
              </Label>
            </div>
            {analysisError && (
              <p className="text-sm text-destructive">{analysisError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={analyzing}>
              Cancel
            </Button>
            <Button
              onClick={handleStartAnalysis}
              disabled={!canSubmit}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Start Analysis"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Right-side sliding analysis panel */}
      <AnimatePresence>
        {panelOpen && analysisResult && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md lg:max-w-lg bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Analysis Result</h3>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {analysisResult.score != null && (
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                    <p className="text-2xl font-bold text-emerald-500">{analysisResult.score}/100</p>
                  </div>
                )}
                {analysisResult.summary && (
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
                  </div>
                )}
                {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Suggestions</h4>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Strengths</h4>
                    <ul className="space-y-1">
                      {analysisResult.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {!analysisResult.score && !analysisResult.summary && !analysisResult.suggestions?.length && !analysisResult.strengths?.length && (
                  <p className="text-sm text-muted-foreground">Analysis complete. Review the feedback above.</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
