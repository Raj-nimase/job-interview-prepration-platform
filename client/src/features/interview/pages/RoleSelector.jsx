import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight } from "lucide-react";
import { useInterview } from "../hook/useInterview";

const roles = [
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "Marketing Manager",
  "Project Manager",
  "Financial Analyst",
];

const experienceLevels = [
  "Fresher / Entry-Level",
  "1-3 Years",
  "3-5 Years",
  "5+ Years",
];

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const { setRole, setExperience, setHistory } = useInterview();
  const nav = useNavigate();

  const handleStartInterview = () => {
    if (!selectedRole || !selectedExperience) return;

    setRole(selectedRole);
    setExperience(selectedExperience);
    setHistory([]);

    localStorage.setItem("interviewRole", selectedRole);
    localStorage.setItem("interviewExperience", selectedExperience);
    localStorage.removeItem("interviewHistory");

    nav("/interview");
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-16 text-white">
      <Card className="w-full max-w-lg shadow-2xl border-2 border-emerald-600/50 fade-in-up">
        <CardHeader className="text-center p-8">
          <div className="mx-auto bg-emerald-400 text-black rounded-full p-4 w-fit mb-4 shadow-lg">
            <Bot size={40} />
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight">
            CareerAI Interviewer
          </CardTitle>
          <CardDescription className="text-xl text-gray-400 pt-2">
            Hone your skills with AI-powered mock interviews.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 space-y-6">
          <Select onValueChange={setSelectedRole} value={selectedRole}>
            <SelectTrigger className="w-full h-14 text-lg border border-black/20">
              <SelectValue placeholder="Select a role to start..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role} className="text-lg py-2">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedExperience}
            value={selectedExperience}
          >
            <SelectTrigger className="w-full h-14 text-lg bg-white/10 border border-black/20">
              <SelectValue placeholder="Select experience level..." />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level} className="text-lg py-2">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>

        <CardFooter className="p-8">
          <Button
            onClick={handleStartInterview}
            disabled={!selectedRole || !selectedExperience}
            className="w-full h-14 text-xl font-semibold bg-[#00d084] hover:bg-[#00b86b] text-white"
            size="lg"
          >
            Start Interview
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
