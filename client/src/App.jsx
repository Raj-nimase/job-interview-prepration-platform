import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/pages/Login";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResumeHub from "./pages/ResumeLanding";
import { ResumeForm } from "./pages/Resume-form";
import { ResumePreview } from "./pages/Resume-preview";
import QuizHome from "./pages/Quiz/QuizHome";
import QuizPlay from "./pages/Quiz/QuizPlay";
import QuizResult from "./pages/Quiz/QuizResult";
import Navbar from "./components/Navbar";
import InterviewTips from "./pages/Interviewtip";
import QuizCourse from "./pages/Quiz/QuizCourse";
import ResumeTemplate from "./pages/ResumeTemplate";

// toast notifications
import { Toaster } from "react-hot-toast";

import { InterviewSummary } from "./features/interview/pages/InterviewSummary";
import { InterviewWorkspace } from "./features/interview/pages/InterviewWorkspace";
import { RoleSelector } from "./features/interview/pages/RoleSelector";

import { AuthProvider } from "./features/auth/context/auth.context";
import { InterviewProvider } from "./features/interview/context/interview.context";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/tips" element={<InterviewTips />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/resume" element={<ResumeHub />} />
          <Route path="/resumetemplate" element={<ResumeTemplate />} />
          {/* <Route path="/resumeform" element={<ResumeForm />} />
          <Route path="/resumepreview" element={<ResumePreview />} /> */}
          <Route path="/quiz" element={<QuizHome />} />
          <Route path="/quiz/play" element={<QuizPlay />} />
          <Route path="/quiz-result" element={<QuizResult />} />
          <Route path="/quizcourse" element={<QuizCourse />} />
          <Route
            path="/selectRole"
            element={
              <InterviewProvider>
                <RoleSelector />
              </InterviewProvider>
            }
          />
          <Route
            path="/interview"
            element={
              <InterviewProvider>
                <InterviewWorkspace />
              </InterviewProvider>
            }
          />
          <Route
            path="/summary"
            element={
              <InterviewProvider>
                <InterviewSummary />
              </InterviewProvider>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
