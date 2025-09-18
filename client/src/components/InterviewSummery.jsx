import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Award, Bot, User, Sparkles, RotateCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function InterviewSummary() {
  const [history, setHistory] = useState(null);
  const [role, setRole] = useState(null);
  const router = useNavigate();

  useEffect(() => {
    const storedHistory = localStorage.getItem("interviewHistory");
    const storedRole = localStorage.getItem("interviewRole");

    if (!storedHistory || !storedRole) {
      router("/");
    } else {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
        setRole(storedRole);
      } catch (error) {
        console.error("Failed to parse interview history", error);
        router("/");
      }
    }
  }, [router]);

  const handleNewInterview = () => {
    localStorage.removeItem("sessionId");

    router("/");
  };

  if (!history || !role) {
    return (
      <div className="w-full max-w-4xl space-y-6 p-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <Card className="w-full max-w-4xl bg-white text-gray-900 shadow-xl border border-gray-800 rounded-xl fade-in-up">
        <CardHeader className="text-center p-8 rounded-t-xl ">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-4 shadow-lg">
            <Award size={40} />
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight">
            Interview Complete!
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground pt-2">
            Here's your performance summary for the{" "}
            <span className="font-semibold text-primary">{role}</span> role.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {history.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              defaultValue="item-0"
            >
              {history.map((turn, index) => {
                const feedbackText =
                  typeof turn.feedback === "string"
                    ? turn.feedback
                    : turn.feedback?.feedback || "";

                const feedbackScore =
                  typeof turn.feedback === "object"
                    ? turn.feedback?.score
                    : null;

                const strengths =
                  typeof turn.feedback === "object"
                    ? turn.feedback?.strengths || []
                    : [];

                const weaknesses =
                  typeof turn.feedback === "object"
                    ? turn.feedback?.weaknesses || []
                    : [];

                const suggestions =
                  typeof turn.feedback === "object"
                    ? turn.feedback?.suggestions || []
                    : [];

                return (
                  <AccordionItem
                    value={`item-${index}`}
                    key={index}
                    className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                  >
                    <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </span>
                        <span className="text-left">Question {index + 1}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 p-6 pt-2">
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-3 text-lg">
                          <Bot className="text-primary" />
                          Question Asked
                        </h4>
                        <p className="pl-10 text-gray-600 text-base">
                          {turn.question}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-3 text-lg">
                          <User />
                          Your Answer
                        </h4>
                        <blockquote className="pl-10 text-gray-700 border-l-4 border-emerald-400 bg-emerald-50 ml-2 py-3 px-4 rounded text-base italic">
                          "{turn.answer}"
                        </blockquote>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-3 text-lg">
                          <Sparkles className="text-accent" />
                          AI Feedback
                        </h4>

                        {feedbackScore !== null && (
                          <p className="pl-10 text-gray-800">
                            <strong>Score:</strong> {feedbackScore}
                          </p>
                        )}

                        <div
                          className="pl-10 text-foreground/90 prose prose-base max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: feedbackText.replace(/\n/g, "<br />"),
                          }}
                        />

                        {strengths.length > 0 && (
                          <div className="pl-10">
                            <h5 className="font-semibold">Strengths:</h5>
                            <ul className="list-disc list-inside">
                              {strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {weaknesses.length > 0 && (
                          <div className="pl-10">
                            <h5 className="font-semibold">Weaknesses:</h5>
                            <ul className="list-disc list-inside">
                              {weaknesses.map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {suggestions.length > 0 && (
                          <div className="pl-10">
                            <h5 className="font-semibold">Suggestions:</h5>
                            <ul className="list-disc list-inside">
                              {suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <p className="text-center text-muted-foreground py-10 text-lg">
              You didn't answer any questions. Try another interview to see your
              summary here.
            </p>
          )}
        </CardContent>

        <CardFooter className="p-8 border-t">
          <Button
            onClick={handleNewInterview}
            className="w-full h-14 text-xl bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <RotateCw className="mr-3 h-6 w-6" />
            Start a New Interview
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
