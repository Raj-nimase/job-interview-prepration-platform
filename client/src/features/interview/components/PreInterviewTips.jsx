import { Mic, Volume2, AlertCircle, Keyboard, ListChecks } from "lucide-react";

const TIPS = [
  {
    icon: Mic,
    title: "Good Microphone",
    desc: "Use a quality microphone for better recognition accuracy.",
  },
  {
    icon: Volume2,
    title: "Speak Clearly",
    desc: "Moderate pace ensures accurate Gemini STT transcription.",
  },
  {
    icon: AlertCircle,
    title: "Quiet Environment",
    desc: "Minimize background noise for clean transcription.",
  },
  {
    icon: Keyboard,
    title: "Fallback to Typing",
    desc: "You can always type your answer if voice isn't accurate.",
  },
  {
    icon: ListChecks,
    title: "5 Questions Total",
    desc: "Each answer is analysed by AI and you get detailed feedback.",
  },
];

export function PreInterviewTips({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl backdrop-blur-sm mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-400">
          Before You Start
        </h2>

        <ul className="space-y-5">
          {TIPS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="p-2 bg-emerald-500/10 rounded-full">
                <Icon className="text-emerald-400" size={20} />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </li>
          ))}
        </ul>

      </div>

      <button
        onClick={onStart}
        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-12 py-4 text-lg font-bold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
      >
        Start Interview
      </button>
    </div>
  );
}
