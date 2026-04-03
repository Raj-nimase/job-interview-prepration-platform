import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const JOB_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Other",
];

export default function ResumeLandingPage() {
  const nav = useNavigate();
  const previewImage =
    "https://assets.resume-now.com/blobimages/rna/sem/images/karthikChoudhryResume.png?w=678";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20 relative">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:flex lg:justify-between items-center gap-10 lg:gap-12 flex-1">
        <motion.section
          className="flex-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl text-emerald-500 font-extrabold leading-tight mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
          >
            Build a resume that gets you hired fast.
          </motion.h1>
          <motion.p
            className="text-muted-foreground mb-6 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease: "easeOut" }}
          >
            Choose a recruiter-approved template, fill your information and
            download a professional resume in PDF.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => nav("/resumetemplate")}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Choose Template
            </motion.button>
            <motion.button
              onClick={() => nav("/resume-analyzer")}
              className="border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Analyze Resume
            </motion.button>
          </motion.div>
          <motion.div
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              "ATS Friendly",
              "Download PDF",
              "6 Templates",
              "Fully Responsive",
            ].map((item) => (
              <motion.div
                key={item}
                className="p-3 bg-card rounded-xl border border-border hover:border-emerald-500/30 transition"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.65, ease: "easeOut" }}
        >
          <motion.div
            className="bg-card p-4 rounded-2xl shadow-xl border border-border hover:shadow-2xl hover:border-emerald-500/20 transform hover:scale-[1.02] transition-all duration-300"
            whileHover={{ y: -6 }}
          >
            <img
              src={previewImage}
              alt="Resume Example Preview"
              className="rounded-lg w-full h-auto object-cover"
            />
          </motion.div>
        </motion.section>
      </main>

      <motion.section
        className="max-w-6xl mx-auto px-6 pb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-2xl text-foreground mb-6">Why Choose Our Builder?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "📄 Professional Templates",
            "⚡ Build in Minutes",
            "💼 Recruiter Approved",
          ].map((item) => (
            <motion.div
              key={item}
              className="p-6 bg-card rounded-2xl border border-border hover:border-emerald-500/30 shadow-lg transition"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -4 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="bg-muted/50 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
          <motion.div
            className="flex justify-center gap-1 text-yellow-500 text-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.35 }}
          >
            ★★★★★
          </motion.div>
          <motion.p
            className="text-lg text-foreground"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.05, duration: 0.35 }}
          >
            Rated <strong>4.9/5</strong> by thousands of professionals
          </motion.p>
          <motion.blockquote
            className="italic text-muted-foreground"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.12, duration: 0.35 }}
          >
            “The easiest and fastest way to create a resume that stands out!”
          </motion.blockquote>
        </div>
      </motion.section>
    </div>
  );
}

