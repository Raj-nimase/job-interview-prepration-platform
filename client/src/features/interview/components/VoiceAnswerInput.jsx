import { Mic, MicOff, CheckCircle2, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
}) {
  return (
    <div className="space-y-4">
      {/* Waveform + status */}
      <div
        className={`rounded-xl border-2 p-4 transition-all duration-300 ${
          isRecording
            ? "border-red-500/60 bg-red-500/5"
            : isTranscribing
              ? "border-blue-500/60 bg-blue-500/5"
              : "border-border bg-muted/50"
        }`}
      >
        <WaveformVisualizer isRecording={isRecording} />

        <div className="mt-3 flex items-center justify-center gap-2 min-h-[24px]">
          {isRecording && (
            <>
              <span className="text-red-400 text-sm">Recording…</span>
              <RecordingTimer isRecording={isRecording} />
            </>
          )}
          {isTranscribing && !isRecording && (
            <span className="flex items-center gap-2 text-blue-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Transcribing with Gemini…
            </span>
          )}
          {!isRecording && !isTranscribing && !transcript && (
            <span className="text-gray-500 text-sm">
              Press the microphone below to start speaking
            </span>
          )}
          {!isRecording && !isTranscribing && transcript && isLoadingFeedback && (
            <span className="flex items-center gap-2 text-blue-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating AI feedback…
            </span>
          )}
          {!isRecording && !isTranscribing && transcript && !isLoadingFeedback && feedback && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Feedback ready — scroll down to view
            </span>
          )}
          {!isRecording && !isTranscribing && transcript && !isLoadingFeedback && !feedback && (
            <span className="flex items-center gap-1.5 text-amber-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Transcription complete
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

      {/* Transcript display */}
      {(transcript || isTranscribing) && (
        <div className="bg-muted border border-border rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
            Transcript
          </p>
          {isTranscribing && !transcript ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <p className="text-foreground/80 text-base leading-relaxed">
              {transcript}
            </p>
          )}
        </div>
      )}

      {/* Editable transcript */}
      {transcript && !isTranscribing && (
        <div>
          <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">
            Edit if needed
          </p>
          <Textarea
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={4}
            placeholder="Edit your transcribed answer here…"
            className="bg-background border-border text-foreground text-base resize-none"
            disabled={!!feedback || isLoadingFeedback}
          />
        </div>
      )}
    </div>
  );
}
