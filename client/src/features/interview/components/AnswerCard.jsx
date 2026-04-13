import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Mic, Keyboard, MessageCircleQuestion, Send } from "lucide-react";
import { VoiceAnswerInput } from "./VoiceAnswerInput";

export function AnswerCard({
  voiceMode,
  onVoiceModeChange,
  userAnswer,
  onAnswerChange,
  feedback,
  isLoadingFeedback,
  isLoadingQuestion,
  isRecording,
  isTranscribing,
  transcript,
  onToggleRecording,
  onSubmitFeedback,
  // Follow-up props
  isFollowUpPhase,
  followUpQuestion,
  onSubmitFollowUp,
  isCheckingFollowUp,
}) {
  const [followUpText, setFollowUpText] = useState("");

  const showSubmit =
    userAnswer.trim() && !feedback && !isTranscribing && !isLoadingFeedback && !isFollowUpPhase;

  // ─── Follow-up Mode ──────────────────────────────────────────────────────────
  if (isFollowUpPhase && followUpQuestion) {
    return (
      <div className="bg-amber-500/5 border border-amber-500/30 rounded-[2rem] p-6 md:p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <MessageCircleQuestion className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Follow-up question</h3>
            <p className="text-xs text-muted-foreground">Your initial answer needs more detail. Answer this probe.</p>
          </div>
        </div>

        {/* Follow-up question box */}
        <div className="bg-card rounded-xl p-5 border border-amber-500/20">
          <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
            &ldquo;{followUpQuestion}&rdquo;
          </p>
        </div>

        {/* Answer area */}
        <div className="space-y-4">
          <div className="flex p-1 bg-card rounded-full border border-border w-fit">
            <button
              type="button"
              onClick={() => onVoiceModeChange(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${voiceMode ? "bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Mic className="w-3.5 h-3.5" /> Voice
            </button>
            <button
              type="button"
              onClick={() => onVoiceModeChange(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${!voiceMode ? "bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Keyboard className="w-3.5 h-3.5" /> Type
            </button>
          </div>

          {voiceMode ? (
            <VoiceAnswerInput
              isRecording={isRecording}
              isTranscribing={isTranscribing}
              transcript={followUpText || transcript}
              userAnswer={followUpText}
              feedback={null}
              isLoadingFeedback={isLoadingFeedback}
              isLoadingQuestion={false}
              onToggleRecording={onToggleRecording}
              onAnswerChange={setFollowUpText}
              variant="bento"
            />
          ) : (
            <Textarea
              placeholder="Type your follow-up answer here…"
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              rows={6}
              className="bg-background border-border text-foreground text-base resize-none rounded-xl"
            />
          )}

          <Button
            onClick={() => onSubmitFollowUp(followUpText || transcript)}
            disabled={(!followUpText.trim() && !transcript.trim()) || isLoadingFeedback}
            className="w-full rounded-full py-6 text-base font-bold bg-gradient-to-br from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg"
          >
            {isLoadingFeedback ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analysing combined response…
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit follow-up answer
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ─── Normal Answer Mode ──────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 bg-muted/40 rounded-[2rem] p-6 md:p-8 flex flex-col justify-center min-h-[220px] border border-border/60">
        <div className="flex items-center gap-2 mb-6 justify-center bg-card/80 px-4 py-2 rounded-full border border-border w-fit mx-auto">
          <Mic className={`w-4 h-4 ${isRecording ? "text-red-500" : "text-emerald-600"}`} />
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            {voiceMode
              ? isRecording ? "Recording active" : "Voice response"
              : "Typed response"}
          </span>
        </div>

        {voiceMode ? (
          <VoiceAnswerInput
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            transcript={transcript}
            userAnswer={userAnswer}
            feedback={feedback}
            isLoadingFeedback={isLoadingFeedback}
            isLoadingQuestion={isLoadingQuestion}
            onToggleRecording={onToggleRecording}
            onAnswerChange={onAnswerChange}
            variant="bento"
          />
        ) : (
          <Textarea
            placeholder="Type your answer here…"
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={10}
            className="bg-background border-border text-foreground text-base resize-none rounded-xl"
            disabled={isLoadingFeedback || !!feedback}
          />
        )}
      </div>

      <div className="bg-muted/50 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between border border-border/60 gap-8">
        <div>
          <h4 className="font-headline font-bold text-sm text-foreground mb-4">Response mode</h4>
          <div className="flex p-1 bg-card rounded-full border border-border">
            <button
              type="button"
              onClick={() => onVoiceModeChange(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-xs transition-all ${voiceMode ? "bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Mic className="w-3.5 h-3.5" /> Voice
            </button>
            <button
              type="button"
              onClick={() => onVoiceModeChange(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-xs transition-all ${!voiceMode ? "bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Keyboard className="w-3.5 h-3.5" /> Type
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {isCheckingFollowUp && (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
              <span className="inline-block w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              Checking response depth…
            </div>
          )}
          {showSubmit && (
            <Button
              onClick={onSubmitFeedback}
              disabled={isLoadingFeedback || isRecording}
              className="w-full rounded-full py-6 text-base font-bold bg-gradient-to-br from-emerald-700 to-emerald-500 hover:from-emerald-800 hover:to-emerald-600 text-white shadow-lg"
            >
              {isLoadingFeedback ? "Analysing…" : "Submit answer"}
            </Button>
          )}
          {voiceMode && isRecording && (
            <Button
              type="button"
              variant="ghost"
              onClick={onToggleRecording}
              className="w-full rounded-full py-6 font-headline font-bold text-muted-foreground hover:text-foreground"
            >
              Finish recording
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
