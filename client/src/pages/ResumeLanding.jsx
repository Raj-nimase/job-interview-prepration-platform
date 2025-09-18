import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeLanding() {
  const nav = useNavigate();
  const previewImage = "https://assets.resume-now.com/blobimages/rna/sem/images/karthikChoudhryResume.png?w=678";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 lg:flex lg:justify-between items-center gap-12">
        <section className="flex-1 animate-fadeInUp">
          <h1 className="text-4xl lg:text-5xl text-blue-400 font-extrabold leading-tight mb-4">
            Build a resume that gets you hired fast.
          </h1>
          <p className="text-slate-200 mb-6 max-w-xl">
            Choose a recruiter-approved template, fill your information and download a professional resume in PDF.
          </p>
          <button
            onClick={() => nav("/resumetemplate")}
            className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition"
          >
            Choose Template
          </button>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-300">
            <div className="p-3 bg-white/5 rounded hover:bg-white/10 transition">ATS Friendly</div>
            <div className="p-3 bg-white/5 rounded hover:bg-white/10 transition">Download PDF</div>
            <div className="p-3 bg-white/5 rounded hover:bg-white/10 transition">6 Templates</div>
            <div className="p-3 bg-white/5 rounded hover:bg-white/10 transition">Fully Responsive</div>
          </div>
        </section>

        {/* Image Preview */}
        <section className="w-full lg:w-1/2 animate-fadeIn">
          <div className="bg-white/5 p-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition">
            <img
              src={previewImage}
              alt="Resume Example Preview"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </section>
      </main>

      {/* Advantages Section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl text-white/90 mb-6">Why Choose Our Builder?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition">📄 Professional Templates</div>
          <div className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition">⚡ Build in Minutes</div>
          <div className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition">💼 Recruiter Approved</div>
        </div>
      </section>

      {/* Ratings */}
      <section className="bg-white/5 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex justify-center gap-1 text-yellow-400 text-xl">
            ★★★★★
          </div>
          <p className="text-lg">Rated <strong>4.9/5</strong> by thousands of professionals</p>
          <blockquote className="italic text-slate-300">
            “The easiest and fastest way to create a resume that stands out!”
          </blockquote>
        </div>
      </section>
      
      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
