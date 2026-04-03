import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

const MotionDiv = motion.div;

const STEPS = [
  { label: "Reading PDF contents" },
  { label: "Extracting role keywords" },
  { label: "Checking ATS compatibility..." },
  { label: "Calculating match score" },
];

export function AnalyzingScreen({ onCancel }) {
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through steps over time
  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * 1800),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center gap-8 py-4">
      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-8 flex w-full max-w-md flex-col items-center gap-8 relative"
      >
        {/* Cancel button */}
        <button
          className="absolute -top-12 right-0 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={onCancel}
        >
          <ArrowLeft size={16} />
          Cancel
        </button>
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Analyzing resume structure...
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Please wait while we evaluate your profile against the target role.
          </p>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Document skeleton + scanner */}
          <div className="relative mx-auto mb-8 h-56 w-full max-w-md overflow-hidden rounded-lg border border-border bg-background/60 p-6">
            <div className="space-y-3 animate-pulse">
              <div className="h-3 w-1/2 rounded-full bg-muted" />
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-5/6 rounded-full bg-muted" />
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-4/5 rounded-full bg-muted" />
              <div className="mt-6 h-3 w-1/3 rounded-full bg-muted" />
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-3/4 rounded-full bg-muted" />
            </div>
            <MotionDiv
              className="absolute left-0 top-0 h-[2px] w-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.5)]"
              animate={{ y: [0, 216] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Checklist */}
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            {STEPS.map((step, i) => {
              const isDone = i < activeStep;
              const isActive = i === activeStep;
              const isPending = i > activeStep;
              return (
                <AnimatePresence key={i}>
                  <MotionDiv
                    className={`flex items-center gap-3 ${isPending ? "opacity-40" : "opacity-100"}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {isDone ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <CheckCircle2 size={16} />
                      </div>
                    ) : isActive ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border">
                        <Loader2
                          size={14}
                          className="animate-spin text-emerald-500"
                        />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-border" />
                    )}
                    <span
                      className={`text-sm font-medium text-foreground ${isActive ? "animate-pulse" : ""}`}
                    >
                      {step.label}
                    </span>
                  </MotionDiv>
                </AnimatePresence>
              );
            })}
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
