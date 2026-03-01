import { useState } from "react";

import {
  ArrowDown,
  Code2,
  FileText,
  LineChart,
  Map,
  UserPlus,
  NotebookPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../lib/B6A9PNdKG9.json";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";


// Floating gradient orbs for hero background
const FloatingOrbs = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-96 h-96 rounded-full bg-cyan-500/20 dark:bg-cyan-500/30 blur-3xl"
      style={{ top: "20%", left: "10%" }}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 30, 0],
        scale: [1, 1.2, 1, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-80 h-80 rounded-full bg-purple-500/15 dark:bg-purple-500/25 blur-3xl"
      style={{ top: "60%", right: "15%" }}
      animate={{
        x: [0, -60, 40, 0],
        y: [0, 50, -20, 0],
        scale: [1, 1.1, 1, 1],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-64 h-64 rounded-full bg-blue-500/15 dark:bg-blue-500/20 blur-3xl"
      style={{ bottom: "20%", left: "30%" }}
      animate={{
        x: [0, 30, -50, 0],
        y: [0, -30, 40, 0],
        scale: [1, 1.15, 1, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Hero Component
const Hero = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        ease: "easeInOut",
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };



  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-black" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-500/10 via-cyan-500/5 to-transparent dark:from-purple-900/20 dark:via-cyan-500/10 dark:to-transparent blur-3xl" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <FloatingOrbs />

      <motion.div
        className="relative z-10 grid grid-cols-1 gap-8 lg:gap-12 md:grid-cols-2 max-w-7xl px-4 sm:px-6 mx-auto items-center flex-1 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={childVariants}
          className="relative bg-card/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-border shadow-xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
            Ace Your Interviews <br />
            <motion.span
              className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto]"
              animate={{
                backgroundPosition: ["0% center", "200% center", "0% center"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              with Confidence and Skill
            </motion.span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl leading-relaxed">
            Unlock your potential and stand out in the competitive job market.
            Our expert resources and mentorship will guide you every step of the
            way.
          </p>
          <div className="flex gap-3 sm:gap-4 flex-wrap">
            <motion.button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-xl font-semibold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 active:scale-[0.98] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="w-full flex justify-center items-center"
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <Lottie animationData={animationData} loop={true} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [10, 0, 10] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="z-10 mt-5"
      >
        <span className="inline-flex items-center justify-center rounded-full bg-cyan-500/20 dark:bg-cyan-500/30 border border-cyan-400/30 p-2 animate-pulse">
          <ArrowDown className="h-6 w-6 text-cyan-500" />
        </span>
      </motion.div>
    </section>
  );
};

// Features Component
const Features = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <Code2 size={32} />,
      title: "Coding Practice",
      description:
        "Solve real interview coding questions with an interactive code editor.",
    },
    {
      icon: <FileText size={32} />,
      title: "Resume Builder",
      description:
        "Create professional resumes with customizable templates and export as PDF.",
    },
    {
      icon: <LineChart size={32} />,
      title: "Progress Analytics",
      description:
        "Track your quiz performance, consistency, and topic-wise strengths.",
    },
    {
      icon: <Map size={32} />,
      title: "Role-Based Roadmaps",
      description:
        "Follow tailored roadmaps for roles like Frontend, Backend, and SDE.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/50 dark:bg-muted/30 px-4 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-foreground"
        >
          Powerful Tools to{" "}
          <span className="text-emerald-500">Boost Your Preparation</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-12 text-base sm:text-lg"
        >
          Everything you need in one place — designed to help you get
          interview-ready faster and smarter.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-card rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-border p-6 text-left hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300"
            >
              <motion.div
                className="text-emerald-500 mb-4"
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.4 },
                }}
              >
                {f.icon}
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// WhyInterviewPrepX Component
const WhyInterviewPrepX = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const points = [
    {
      title: "🧠 Practice Smart",
      description:
        "Access curated MCQs, coding challenges, and topic-wise quizzes aligned with real-world interviews.",
    },
    {
      title: "📊 Track Your Progress",
      description:
        "Get personalized analytics and insights to help you focus on weak areas and improve over time.",
    },
    {
      title: "📄 Resume Like a Pro",
      description:
        "Use our AI-powered resume builder and analyzer to craft resumes that beat ATS systems.",
    },
    {
      title: "🎯 Role-Based Roadmaps",
      description:
        "Follow tailored preparation paths for roles like frontend developer, data analyst, and more.",
    },
    {
      title: "🔐 Secure & Personalized",
      description:
        "Your data is safe, and your dashboard is uniquely tailored to your career journey.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background px-4 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground"
        >
          Why Choose <span className="text-emerald-500">HireReady</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-10 text-base sm:text-lg"
        >
          HireReady isn’t just another prep tool — it’s your all-in-one career
          readiness platform.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {points.map((p, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -3 }}
              className="bg-card p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-border hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Steps Component
const Steps = () => {
  const navigate = useNavigate();
  const steps = [
    {
      id: 1,
      title: "Sign Up & Set Your Goals",
      icon: <UserPlus className="h-6 w-6 text-blue-400" />,
      description:
        "Create your profile, choose your career path, and let InterviewPrepX personalize your experience.",
    },
    {
      id: 2,
      title: "Practice with Real Questions",
      icon: <NotebookPen className="h-6 w-6 text-green-400" />,
      description:
        "Work through MCQs, coding questions, quizzes, and resume tools tailored to your role.",
    },
    {
      id: 3,
      title: "Track Progress & Improve",
      icon: <LineChart className="h-6 w-6 text-indigo-400" />,
      description:
        "Analyze your strengths and weaknesses with in-depth performance insights and recommendations.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/50 dark:bg-muted/30 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <motion.h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Your Step-by-Step{" "}
          <span className="text-emerald-500">Interview Journey</span>
        </motion.h2>
        <motion.p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
          Follow a clear, guided path from sign-up to success.
        </motion.p>
      </div>

      <motion.div
        className="relative border-l-4 border-dotted border-emerald-500/50 pl-6 sm:pl-8 space-y-10 sm:space-y-12 max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
          },
        }}
      >
        {steps.map((s) => (
          <motion.div
            key={s.id}
            className="relative"
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
          >
            <motion.div
              className="absolute -left-[1.6rem] top-0 bg-emerald-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
            >
              {s.id}
            </motion.div>
            <motion.div
              className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/20 border border-border hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300"
              whileHover={{ x: 8 }}
            >
              <div className="mb-3 text-emerald-500">{s.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="mt-12 flex gap-4 justify-center">
        <motion.button
          onClick={() => navigate("/login")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 active:scale-[0.98] transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Your Journey
        </motion.button>
      </motion.div>
    </section>
  );
};

// FAQ Component
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  const faqs = [
    {
      question: "What is HireReady?",
      answer: "HireReady is a full-stack platform...",
    },
    {
      question: "Do I need to pay?",
      answer: "No, InterviewPrepX is free to use...",
    },
    {
      question: "Can I build and download a resume?",
      answer: "Yes! You can create and export resumes...",
    },
    {
      question: "How does progress tracking work?",
      answer: "Your quiz and coding performance is tracked...",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we never share your data with third parties.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background px-4 sm:px-6 md:px-12">
      <div className="h-[60vh] w-full ">
        <motion.div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Frequently Asked <span className="text-emerald-500">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Find answers to common questions.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                layout
                transition={{ layout: { duration: 0.25, ease: "easeInOut" } }}
                className="bg-card border border-border rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center p-4 sm:p-5 text-left text-foreground hover:text-emerald-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ArrowDown
                    className={`h-5 w-5 text-emerald-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Home Page Wrapper
const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <WhyInterviewPrepX />
      <Steps />
      <FAQ />
      <Footer />
    </>
  );
};

export default Home;
