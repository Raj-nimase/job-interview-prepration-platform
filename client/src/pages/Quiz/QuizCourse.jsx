import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

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

const QuizCourse = () => {
  const navigate = useNavigate();
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem("unlockedLevel");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("unlockedLevel", unlockedLevel);
  }, [unlockedLevel]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [modalTopic, setModalTopic] = useState(null);

  const handleStartQuiz = (topic, levelIndex) => {
    if (levelIndex + 1 <= unlockedLevel) {
      console.log(topic)
      setModalTopic(topic);
    }
  };

  const confirmStart = () => {
    navigate(`/quiz/play?topic=${modalTopic}`);
    setModalTopic(null);
    if (unlockedLevel < levels.length) setUnlockedLevel((prev) => prev + 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen mt-16 text-white p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-cyan-300">
        Master Your Interview with MCQ Practice
      </h1>

      {levels.map((lvl, idx) => (
        <div key={lvl.level} className="mb-16 relative">
          <h2 className="text-xl font-semibold text-center mb-6">
            Level {lvl.level}
          </h2>

          <div className="flex justify-center flex-wrap gap-6">
            {lvl.topics.map((topic) => (
              <div
                key={topic.name}
                onClick={() => handleStartQuiz(topic.name, idx)}
                className={`relative cursor-pointer w-72 bg-gradient-to-br ${
                  topic.color
                } text-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-transparent ${
                  idx + 1 > unlockedLevel
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-yellow-400"
                } group`}
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-center">
                    {topic.name}
                  </h3>
                  <div className="flex justify-between w-full text-sm text-gray-200">
                    <div>
                      <span className="font-semibold">{topic.articles}</span>{" "}
                      Articles
                    </div>
                    <div>
                      <span className="font-semibold">{topic.problems}</span>{" "}
                      Problems
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 text-black group-hover:scale-110 transition-transform">
                    ▶️
                  </div>
                </div>
              </div>
            ))}
          </div>

          {idx < levels.length - 1 && (
            <div className="flex justify-center mt-6">
              <div className="h-1 w-2/3 bg-white rounded-full opacity-20"></div>
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
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
          <Dialog.Panel className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Start Quiz
            </Dialog.Title>
            <p>
              Are you ready to begin the <strong>{modalTopic?.name}</strong>{" "}
              quiz?
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
  );
};

export default QuizCourse;
