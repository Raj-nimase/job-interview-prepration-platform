import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-emerald-600/70 text-white px-6 md:px-12 py-10"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Logo & Brief */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">HireReady</h2>
          <p className="text-sm ">
            Your all-in-one platform for mastering interviews. Practice MCQs, coding challenges, build your resume, and track your progress.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-300">Home</a></li>
            <li><a href="/mcqs" className="hover:text-blue-300">MCQ Practice</a></li>
            <li><a href="/quizzes" className="hover:text-blue-300">Quizzes</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <span className="font-semibold text-white mb-2">Connect with us</span>
          <div className="flex gap-4">
            <a href="#" className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"><FaLinkedinIn /></a>
            <a href="#" className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"><FaGithub /></a>
            <a href="#" className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"><FaTwitter /></a>
            <a href="#" className="bg-white/10 rounded-full p-2 text-2xl shadow-md transition-transform duration-200 hover:scale-110 hover:bg-blue-800 hover:text-blue-300"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white mt-10 pt-5 flex flex-col md:flex-row items-center justify-between text-sm text-blue-200 gap-3">
        <p>&copy; 2025 HireReady. All rights reserved.</p>
        <span className="italic">Empowering your career journey.</span>
        <a href="mailto:support@interviewprepx.com" className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold transition-colors duration-200 hover:bg-blue-700">
          <FiMail className="text-lg" />
          Get in Touch
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;
