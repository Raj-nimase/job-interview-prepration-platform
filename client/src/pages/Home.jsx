import { useEffect, useRef, useCallback, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  motion,
  AnimatePresence,
} from "framer-motion";
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
import { FiMail } from "react-icons/fi";
import { FaLinkedinIn, FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";

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
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-900/20 via-cyan-500/10 to-transparent blur-3xl" />

      <motion.div
        className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-7xl px-6 mx-auto items-center flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={childVariants}
          className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-snug">
            Ace Your Interviews <br />
            <span className="text-blue-400">with Confidence and Skill</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl">
            Unlock your potential and stand out in the competitive job market.
            Our expert resources and mentorship will guide you every step of the
            way.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-md font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="w-full flex justify-center items-center"
        >
          <Lottie animationData={animationData} loop={true} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [10, 0, 10] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="z-10 mt-5"
      >
        <span className="inline-flex items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/30 p-2 animate-pulse">
          <ArrowDown className="h-6 w-6 text-cyan-400" />
        </span>
      </motion.div>
    </section>
  );
};

// Features Component
const Features = () => {
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
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-blue-400"
        >
          Powerful Tools to Boost Your Preparation
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-gray-300 max-w-2xl mx-auto mb-12"
        >
          Everything you need in one place — designed to help you get
          interview-ready faster and smarter.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-blue-900 rounded-2xl shadow-lg p-6 text-left hover:bg-blue-800 transition"
            >
              <div className="text-blue-400 mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {f.title}
              </h3>
              <p className="text-gray-300 text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// WhyInterviewPrepX Component
const WhyInterviewPrepX = () => {
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
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Why Choose <span className="text-blue-400">HireReady</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-blue-200 max-w-2xl mx-auto mb-10"
        >
          HireReady isn’t just another prep tool — it’s your all-in-one career
          readiness platform.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {points.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-white/20"
            >
              <h3 className="font-semibold text-lg mb-2 text-blue-300">
                {p.title}
              </h3>
              <p className="text-sm text-blue-100">{p.description}</p>
            </motion.div>
          ))}
        </div>
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
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">
          Your Step-by-Step Interview Journey
        </motion.h2>
        <motion.p className="text-gray-300 max-w-2xl mx-auto">
          Follow a clear, guided path from sign-up to success.
        </motion.p>
      </div>

      <div className="relative border-l-4 border-dotted border-blue-700 pl-6 space-y-12 max-w-3xl mx-auto">
        {steps.map((s) => (
          <motion.div key={s.id} className="relative">
            <div className="absolute -left-[1.6rem] top-0 bg-blue-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              {s.id}
            </div>
            <div className="bg-[#111827] rounded-xl p-6 shadow-lg border border-gray-700 hover:shadow-blue-500/30 transition">
              <div className="mb-3">{s.icon}</div>
              <h3 className="text-lg font-semibold mb-1 text-blue-300">
                {s.title}
              </h3>
              <p className="text-gray-400 text-sm">{s.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="mt-12 flex gap-4 justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-emerald-400 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Start Your Journey
        </button>
      </motion.div>
    </section>
  );
};

// FAQ Component
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

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
    <section className="py-20 bg-gray-900 text-white px-6 md:px-12">
      <motion.div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400">Find answers to common questions.</p>
      </motion.div>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            className="bg-white/5 border border-white/10 rounded-lg shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center p-4 text-left text-gray-200 hover:text-white"
            >
              <span>{faq.question}</span>
              <ArrowDown
                className={`h-5 w-5 text-blue-400 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="px-4 pb-4 text-gray-400 overflow-hidden"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <motion.footer
      className="bg-emerald-600/70 text-white px-6 md:px-12 py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Logo & Brief */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">HireReady</h2>
          <p className="text-sm ">
            Your all-in-one platform for mastering interviews. Practice MCQs,
            coding challenges, build your resume, and track your progress.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-300">
                Home
              </a>
            </li>
            <li>
              <a href="/mcqs" className="hover:text-blue-300">
                MCQ Practice
              </a>
            </li>
            <li>
              <a href="/quizzes" className="hover:text-blue-300">
                Quizzes
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <span className="font-semibold text-white mb-2">Connect with us</span>
          <div className="flex gap-4">
            <a
              href="#"
              className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="#"
              className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"
            >
              <FaGithub />
            </a>
            <a
              href="#"
              className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white mt-10 pt-5 flex flex-col md:flex-row items-center justify-between text-sm text-blue-200 gap-3">
        <p>&copy; 2025 HireReady. All rights reserved.</p>
        <span className="italic">Empowering your career journey.</span>
        <a
          href="mailto:support@interviewprepx.com"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold transition-colors duration-200 hover:bg-blue-700"
        >
          <FiMail className="text-lg" />
          Get in Touch
        </a>
      </div>
    </motion.footer>
  );
};

// Home Page Wrapper
const Home = () => {
  const scrollRef = useRef(null);

  // useEffect(() => {
  //   const scroll = new LocomotiveScroll({
  //     el: scrollRef.current,
  //     smooth: true,
  //   });

  //   return () => {
  //     scroll.destroy();
  //   };
  // }, []);

  return (
    // <div ref={scrollRef}>
    //   <LazyMotion features={domAnimation}>
    <>
      <Hero />
      <Features />
      <WhyInterviewPrepX />
      <Steps />
      <FAQ />
      <Footer />
    </>
    //   </LazyMotion>
    // </div>
  );
};

export default Home;
