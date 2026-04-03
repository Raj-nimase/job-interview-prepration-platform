import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Mic, Keyboard } from "lucide-react";
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
}) {
  const showSubmit =
    userAnswer.trim() && !feedback && !isTranscribing && !isLoadingFeedback;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 bg-muted/40 rounded-[2rem] p-6 md:p-8 flex flex-col justify-center min-h-[220px] border border-border/60">
        <div className="flex items-center gap-2 mb-6 justify-center bg-card/80 px-4 py-2 rounded-full border border-border w-fit mx-auto">
          <Mic
            className={`w-4 h-4 ${isRecording ? "text-red-500" : "text-emerald-600"}`}
          />
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm ">
            {voiceMode
              ? isRecording
                ? "Recording active"
                : "Voice response"
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
          <h4 className="font-headline font-bold text-sm text-foreground mb-4">
            Response mode
          </h4>
          <div className="flex p-1 bg-card rounded-full border border-border">
            <button
              type="button"
              onClick={() => onVoiceModeChange(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-xs transition-all ${
                voiceMode
                  ? "bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              Voice
            </button>
            <button
              type="button"
              onClick={() => onVoiceModeChange(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-xs transition-all ${
                !voiceMode
                  ? "bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              Type
            </button>
          </div>
        </div>

        <div className="space-y-3">
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
