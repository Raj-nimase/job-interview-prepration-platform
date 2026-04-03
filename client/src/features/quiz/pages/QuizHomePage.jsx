import { BrainCircuit, Code2, UserCog, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuizCategoryCard } from "../components/QuizCategoryCard";

const quizTopics = [
  {
    name: "Aptitude",
    icon: <Activity className="h-10 w-10 text-pink-300 group-hover:text-white transition" />,
    color: "from-pink-500 to-pink-700",
  },
  {
    name: "Technical",
    icon: <BrainCircuit className="h-10 w-10 text-blue-300 group-hover:text-white transition" />,
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Coding",
    icon: <Code2 className="h-10 w-10 text-yellow-300 group-hover:text-white transition" />,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "HR",
    icon: <UserCog className="h-10 w-10 text-indigo-300 group-hover:text-white transition" />,
    color: "from-indigo-500 to-indigo-700",
  },
  {
    name: "DSA",
    icon: <Activity className="h-10 w-10 text-pink-300 group-hover:text-white transition" />,
    color: "from-green-500 to-green-700",
  },
];

export default function QuizHomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    // Original behavior routes to course selection.
    navigate(`/quizcourse`);
  };

  return (
    <div className="min-h-screen">
      <div className="mt-16 py-16 px-6">
        <h1 className="text-4xl md:text-5xl text-center font-bold text-emerald-400 mb-14">
          Choose a Quiz Category
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {quizTopics.map((topic) => (
            <QuizCategoryCard
              key={topic.name}
              topic={topic}
              onClick={handleStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

