import { motion } from "framer-motion";
import { Lightbulb, Smile, ClipboardList, Users, Clock, MessageSquare } from "lucide-react";

const tips = [
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
    title: "Research the Company",
    content:
      "Understand the company’s mission, products, and recent news. Be ready to explain why you want to work there.",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-teal-400" />,
    title: "Understand the Job Role",
    content:
      "Carefully read the job description and relate your skills and experience to what’s required.",
  },
  {
    icon: <Smile className="w-6 h-6 text-green-400" />,
    title: "Practice Confidence",
    content:
      "Maintain eye contact, smile, and speak clearly. Confidence matters just as much as your answers.",
  },
  {
    icon: <Users className="w-6 h-6 text-pink-400" />,
    title: "Behavioral Questions",
    content:
      "Use the STAR method (Situation, Task, Action, Result) to answer questions about past experiences.",
  },
  {
    icon: <Clock className="w-6 h-6 text-indigo-400" />,
    title: "Ask Smart Questions",
    content:
      "At the end, ask thoughtful questions about the role, team culture, or company vision.",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-orange-400" />,
    title: "Follow Up",
    content:
      "Send a thank-you email after the interview. It shows professionalism and interest in the role.",
  },
];

const InterviewTips = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-10 text-cyan-300"
        >
          💼 Interview Tips for Success
        </motion.h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }} // Removed index delay for smooth movement
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow hover:border-cyan-400 hover:shadow-cyan-500/30 transition-all duration-100"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-white/10 p-2 rounded-full">{tip.icon}</div>
                <h2 className="text-xl font-semibold text-white">{tip.title}</h2>
              </div>
              <p className="text-gray-300 text-sm">{tip.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="mt-12 text-center text-sm text-gray-400">
          Remember: Interviews are a two-way street. Be honest, stay calm, and let your skills shine!
        </div>
      </div>
    </div>
  );
};

export default InterviewTips;
