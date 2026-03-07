import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Volume2 } from "lucide-react";

export function QuestionCard({ question, isLoading, onPlayTTS }) {
  return (
    <Card className="shadow-xl border-t-4 border-emerald-600">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="p-2 bg-emerald-500/10 rounded-full">
            <Bot className="text-emerald-400 shrink-0" size={24} />
          </span>
          <CardTitle className="text-xl font-semibold text-white">
            Question
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPlayTTS(question)}
          disabled={isLoading}
          className="text-gray-400 hover:text-white"
        >
          <Volume2 />
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-6 w-full bg-white/10" />
            <Skeleton className="h-6 w-3/4 bg-white/10" />
          </div>
        ) : (
          <p className="text-xl font-medium text-white/90 leading-relaxed">
            {question}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
