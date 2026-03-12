import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  return (
    <Card className="shadow-xl border border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground">
            Your Answer
          </CardTitle>

          {/* Voice / Type toggle */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => onVoiceModeChange(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                voiceMode
                  ? "bg-emerald-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mic className="inline w-3.5 h-3.5 mr-1" />
              Voice
            </button>
            <button
              onClick={() => onVoiceModeChange(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                !voiceMode
                  ? "bg-emerald-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Keyboard className="inline w-3.5 h-3.5 mr-1" />
              Type
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
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
          />
        ) : (
          <Textarea
            placeholder="Type your answer here…"
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={8}
            className="bg-background border-border text-foreground text-base resize-none"
            disabled={isLoadingFeedback || !!feedback}
          />
        )}
      </CardContent>

      <CardFooter>
        {/* Voice mode: auto-feedback runs automatically; show retry only if it failed */}
        {/* Type mode: manual feedback button as before */}
        {(!voiceMode || (voiceMode && !isLoadingFeedback && !feedback && userAnswer.trim() && !isTranscribing)) && (
          <Button
            onClick={onSubmitFeedback}
            disabled={
              !userAnswer.trim() ||
              isLoadingFeedback ||
              !!feedback ||
              isTranscribing
            }
            className="h-12 px-6 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer w-full sm:w-auto"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {voiceMode
              ? "Retry AI Feedback"
              : isLoadingFeedback
                ? "Analysing…"
                : "Get AI Feedback"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
