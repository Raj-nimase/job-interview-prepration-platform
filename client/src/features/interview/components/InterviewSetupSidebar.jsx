import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import { SETUP_SESSION_BULLETS } from "../constants/interviewSetup.constants";

export function InterviewSetupSidebar({
  onStart,
  disabled,
  isStarting,
}) {
  return (
    <div className="md:col-span-4 lg:sticky lg:top-10 space-y-6">
      <div className="bg-card p-6 sm:p-8 rounded-3xl shadow-sm border border-border/80">
        <h3 className="font-bold text-lg mb-6 text-foreground font-headline">
          Session summary
        </h3>
        <ul className="space-y-4 mb-8">
          {SETUP_SESSION_BULLETS.map(({ icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-emerald-600 text-xl mt-0.5 shrink-0"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="text-sm text-muted-foreground leading-snug">
                {text}
              </span>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          onClick={onStart}
          disabled={disabled || isStarting}
          className="w-full h-14 rounded-full text-lg font-bold bg-gradient-to-br from-emerald-700 to-emerald-500 hover:from-emerald-800 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {isStarting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Starting…
            </>
          ) : (
            <>
              Start interview
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
      <div className="px-5 py-4 rounded-2xl bg-muted/60 border border-border flex items-center gap-4">
        <div className="bg-card p-3 rounded-xl border border-border shadow-sm">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Privacy &amp; security
          </p>
          <p className="text-xs text-muted-foreground leading-snug">
            Your answers stay in this session until you start a new interview.
          </p>
        </div>
      </div>
    </div>
  );
}
