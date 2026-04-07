import { Mic, MicOff, CheckCircle2, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { RecordingTimer } from "./RecordingTimer";

export function VoiceAnswerInput({
  isRecording,
  isTranscribing,
  transcript,
  userAnswer,
  feedback,
  isLoadingFeedback,
  isLoadingQuestion,
  onToggleRecording,
  onAnswerChange,
  variant = "default",
}) {
  const shell =
    variant === "bento"
      ? `rounded-2xl border p-4 transition-all duration-300 ${
          isRecording
            ? "border-red-500/50 bg-red-500/[0.07]"
            : isTranscribing
              ? "border-blue-500/50 bg-blue-500/[0.07]"
              : "border-border/60 bg-card/60"
        }`
      : `rounded-xl border-2 p-4 transition-all duration-300 ${
          isRecording
            ? "border-red-500/60 bg-red-500/5"
            : isTranscribing
              ? "border-blue-500/60 bg-blue-500/5"
              : "border-border bg-muted/50"
        }`;

  return (
    <div className="space-y-4">
      {/* Waveform + status */}
      <div className={shell}>
        <WaveformVisualizer isRecording={isRecording} />

        <div className="mt-3 flex items-center justify-center gap-2 min-h-[24px]">
          {isRecording && (
            <>
              <span className="text-red-400 text-sm">Recording...</span>
              <RecordingTimer isRecording={isRecording} />
            </>
          )}
          {isTranscribing && !isRecording && (
            <span className="flex items-center gap-2 text-blue-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Transcribing...
            </span>
          )}
          {!isRecording && !isTranscribing && !transcript && (
            <span className="text-muted-foreground text-sm">
              Press the microphone to start speaking
            </span>
          )}
          {!isRecording && !isTranscribing && transcript && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Ready for feedback
            </span>
          )}
        </div>
      </div>

      {/* Mic button */}
      <div className="flex justify-center">
        <button
          onClick={onToggleRecording}
          disabled={isTranscribing || !!feedback || isLoadingQuestion}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/40 shadow-2xl"
              : "bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-emerald-500/30"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-60" />
              <span className="absolute inset-[-8px] rounded-full border border-red-400/40 animate-ping animation-delay-150" />
            </>
          )}
          {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
      </div>

      {/* Editable answer - single field for transcript editing */}
      {(transcript || isTranscribing) && (
        <div>
          <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">
            Your Answer {transcript && !isTranscribing && "(edit if needed)"}
          </p>
          <Textarea
            value={isTranscribing ? "" : userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={4}
            placeholder={
              isTranscribing
                ? "Transcribing your answer..."
                : "Your transcribed answer will appear here..."
            }
            className="bg-background border-border text-foreground text-base resize-none"
            disabled={isTranscribing || !!feedback || isLoadingFeedback}
          />
        </div>
      )}
    </div>
  );
}
