export function QuizTopicTile({ topic, index, unlockedLevel, onSelect }) {
  const isLocked = index + 1 > unlockedLevel;

  return (
    <div
      onClick={() => onSelect(topic.name, index)}
      className={`relative cursor-pointer w-72 bg-gradient-to-br ${topic.color} text-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-transparent ${
        isLocked ? "opacity-40 cursor-not-allowed" : "hover:border-yellow-400"
      } group`}
    >
      <div className="p-6 flex flex-col items-center">
        <div className="text-4xl mb-4">{topic.icon}</div>
        <h3 className="text-2xl font-bold mb-2 text-center">{topic.name}</h3>
        <div className="flex justify-between w-full text-sm text-gray-200">
          <div>
            <span className="font-semibold">{topic.articles}</span> Articles
          </div>
          <div>
            <span className="font-semibold">{topic.problems}</span> Problems
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 text-black group-hover:scale-110 transition-transform">
          ▶️
        </div>
      </div>
    </div>
  );
}

