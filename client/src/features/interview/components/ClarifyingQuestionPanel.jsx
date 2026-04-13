import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Clock, ChevronRight } from "lucide-react";

/**
 * ClarifyingQuestionPanel — shown for 15 s before the answer timer starts.
 * Props:
 *   clarificationTimeLeft: number
 *   clarificationText: string
 *   onClarificationTextChange: (text) => void
 *   onSubmitClarification: () => void
 *   onSkip: () => void
 *   isLoading: boolean
 *   interviewerResponse: string  (shown after submission)
 */
export function ClarifyingQuestionPanel({
  clarificationTimeLeft,
  clarificationText,
  onClarificationTextChange,
  onSubmitClarification,
  onSkip,
  isLoading,
  interviewerResponse,
}) {
  const [inputOpen, setInputOpen] = useState(false);

  // If interviewer has responded, show the response
  if (interviewerResponse) {
    return (
      <div className="mb-4 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Interviewer response</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{interviewerResponse}</p>
        <p className="text-xs text-muted-foreground mt-2">Answer timer is now running.</p>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Clarification window · {clarificationTimeLeft}s
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-muted-foreground h-7 px-3 text-xs"
        >
          Skip <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {!inputOpen ? (
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground flex-1">
            You may ask a clarifying question before your timer starts.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => setInputOpen(true)}
            className="rounded-full bg-amber-500 hover:bg-amber-600 text-white shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Ask clarification
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={clarificationText}
            onChange={(e) => onClarificationTextChange(e.target.value)}
            placeholder="Type your clarifying question…"
            rows={2}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setInputOpen(false)}
              className="h-8"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSubmitClarification}
              disabled={!clarificationText.trim() || isLoading}
              className="h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full"
            >
              {isLoading ? (
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1" />
              )}
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
