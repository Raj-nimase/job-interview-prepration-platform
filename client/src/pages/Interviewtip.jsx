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
    <div className="min-h-screen bg-background text-foreground pt-24 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 text-emerald-500"
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
              className="bg-card border border-border p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-muted/50 p-2 rounded-xl">{tip.icon}</div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">{tip.title}</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{tip.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          Remember: Interviews are a two-way street. Be honest, stay calm, and let your skills shine!
        </div>
      </div>
    </div>
  );
};

export default InterviewTips;
