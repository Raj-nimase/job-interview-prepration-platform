import { BrainCircuit, Code2, UserCog, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quizTopics = [
  {
    name: "Aptitude",
    icon: (
      <Activity className="h-10 w-10 text-pink-300 group-hover:text-white transition" />
    ),
    color: "from-pink-500 to-pink-700",
  },
  {
    name: "Technical",
    icon: (
      <BrainCircuit className="h-10 w-10 text-blue-300 group-hover:text-white transition" />
    ),
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Coding",
    icon: (
      <Code2 className="h-10 w-10 text-yellow-300 group-hover:text-white transition" />
    ),
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "HR",
    icon: (
      <UserCog className="h-10 w-10 text-indigo-300 group-hover:text-white transition" />
    ),
    color: "from-indigo-500 to-indigo-700",
  },
  {
    name: "DSA",
    icon: (
      <Activity className="h-10 w-10 text-pink-300 group-hover:text-white transition" />
    ),
    color: "from-green-500 to-green-700",
  },
  {
    name: "Computer Science Fundamentals",
    icon: (
      <Activity className="h-10 w-10 text-pink-300 group-hover:text-white transition" />
    ),
    color: "from-purple-500 to-purple-700",
  },
];

const QuizHome = () => {
  const navigate = useNavigate();

  const handleStart = (topic) => {
    console.log(topic);
    // navigate(`/quiz/play?topic=${topic}`);
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
            <div
              key={topic.name}
              onClick={() => handleStart(topic.name)}
              className={`bg-gradient-to-br ${topic.color} relative p-6 rounded-xl shadow-xl cursor-pointer transition-transform hover:scale-105 group overflow-hidden`}
            >
              {/* Icon */}
              <div className="mb-4">{topic.icon}</div>

              {/* Title */}
              <h2 className="text-white text-2xl font-semibold">
                {topic.name}
              </h2>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-white opacity-10 blur-xl group-hover:opacity-20 transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizHome;
