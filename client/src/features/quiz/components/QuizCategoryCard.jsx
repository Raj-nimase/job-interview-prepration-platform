export function QuizCategoryCard({ topic, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${topic.color} relative p-6 rounded-xl shadow-xl cursor-pointer transition-transform hover:scale-105 group overflow-hidden`}
    >
      <div className="mb-4">{topic.icon}</div>
      <h2 className="text-white text-2xl font-semibold">{topic.name}</h2>
      <div className="absolute inset-0 rounded-xl bg-white opacity-10 blur-xl group-hover:opacity-20 transition-all duration-500 pointer-events-none" />
    </div>
  );
}

