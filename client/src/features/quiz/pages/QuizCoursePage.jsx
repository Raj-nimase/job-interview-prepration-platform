import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { QuizTopicTile } from "../components/QuizTopicTile";
import { useQuizCourseProgress } from "../hook/useQuizCourseProgress";

const levels = [
  {
    level: 1,
    topics: [
      {
        name: "Time Complexity",
        articles: 6,
        problems: 15,
        icon: "⏱️",
        color: "from-blue-400 to-blue-600",
      },
    ],
  },
  {
    level: 2,
    topics: [
      {
        name: "Arrays",
        articles: 12,
        problems: 44,
        icon: "🔢",
        color: "from-green-400 to-green-600",
      },
      {
        name: "Math",
        articles: 6,
        problems: 29,
        icon: "➗",
        color: "from-purple-400 to-purple-600",
      },
    ],
  },
  {
    level: 3,
    topics: [
      {
        name: "Linked List",
        articles: 10,
        problems: 32,
        icon: "🔗",
        color: "from-pink-400 to-pink-600",
      },
      {
        name: "Strings",
        articles: 8,
        problems: 25,
        icon: "🔤",
        color: "from-yellow-400 to-yellow-600",
      },
    ],
  },
  {
    level: 4,
    topics: [
      {
        name: "Trees",
        articles: 9,
        problems: 30,
        icon: "🌳",
        color: "from-lime-400 to-lime-600",
      },
      {
        name: "Graphs",
        articles: 11,
        problems: 38,
        icon: "📉",
        color: "from-rose-400 to-rose-600",
      },
    ],
  },
  {
    level: 5,
    topics: [
      {
        name: "DP",
        articles: 14,
        problems: 42,
        icon: "📈",
        color: "from-indigo-400 to-indigo-600",
      },
      {
        name: "Backtracking",
        articles: 5,
        problems: 21,
        icon: "🧩",
        color: "from-orange-400 to-orange-600",
      },
    ],
  },
  {
    level: "Master",
    topics: [
      {
        name: "Final Exam",
        articles: 2,
        problems: 10,
        icon: "👑",
        color: "from-red-400 to-red-600",
      },
    ],
  },
];

export default function QuizCoursePage() {
  const navigate = useNavigate();
  const { unlockedLevel, setUnlockedLevel } = useQuizCourseProgress(1);

  const [modalTopic, setModalTopic] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartQuiz = (topic, levelIndex) => {
    if (levelIndex + 1 <= unlockedLevel) {
      setModalTopic(topic);
    }
  };

  const confirmStart = () => {
    if (!modalTopic) return;
    navigate(`/quiz/play?topic=${modalTopic}`);
    setModalTopic(null);
    if (unlockedLevel < levels.length) {
      setUnlockedLevel((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [modalTopic]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <div className="mt-16 p-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-cyan-600 dark:text-cyan-300">
          Master Your Interview with MCQ Practice
        </h1>

        {levels.map((lvl, idx) => (
          <div key={lvl.level} className="mb-16 relative">
            <h2 className="text-xl font-semibold text-center mb-6">
              Level {lvl.level}
            </h2>

            <div className="flex justify-center flex-wrap gap-6">
              {lvl.topics.map((topic) => (
                <QuizTopicTile
                  key={topic.name}
                  topic={topic}
                  index={idx}
                  unlockedLevel={unlockedLevel}
                  onSelect={(t, index) => handleStartQuiz(t, index)}
                />
              ))}
            </div>

            {idx < levels.length - 1 && (
              <div className="flex justify-center mt-6">
                <div className="h-1 w-2/3 bg-gray-300 dark:bg-white rounded-full opacity-20" />
              </div>
            )}
          </div>
        ))}

        <Dialog
          open={!!modalTopic}
          onClose={() => setModalTopic(null)}
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md border dark:border-gray-700">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Start Quiz
              </Dialog.Title>
              <p>
                Are you ready to begin the <strong>{modalTopic}</strong> quiz?
              </p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setModalTopic(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStart}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Start
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

