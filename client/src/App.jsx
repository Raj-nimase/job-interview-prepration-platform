import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/pages/Login";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResumeLandingPage from "./features/resume-builder/pages/ResumeLandingPage";
import QuizHomePage from "./features/quiz/pages/QuizHomePage";
import QuizPlayPage from "./features/quiz/pages/QuizPlayPage";
import QuizResultPage from "./features/quiz/pages/QuizResultPage";
import Navbar from "./components/Navbar";
import InterviewTips from "./pages/Interviewtip";
import QuizCoursePage from "./features/quiz/pages/QuizCoursePage";
import ResumeTemplatePage from "./features/resume-builder/pages/ResumeTemplatePage";
import ResumeEditorPage from "./features/resume-builder/pages/ResumeEditorPage";

// toast notifications
import { Toaster } from "react-hot-toast";

import { InterviewSummary } from "./features/interview/pages/InterviewSummary";
import { InterviewWorkspace } from "./features/interview/pages/InterviewWorkspace";
import { RoleSelector } from "./features/interview/pages/RoleSelector";

import { AuthProvider } from "./features/auth/context/auth.context";
import { InterviewProvider } from "./features/interview/context/interview.context";
import { ResumeAnalyzerProvider } from "./features/resume-analyzer/context/resume-analyzer.context";
import { ResumeAnalyzer } from "./features/resume-analyzer/pages/ResumeAnalyzer";

// Layout wrapper to share InterviewProvider across all interview routes
function InterviewLayout() {
  return (
    <InterviewProvider>
      <Outlet />
    </InterviewProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/tips" element={<InterviewTips />} />
          <Route path="/editor" element={<ResumeEditorPage />} />
          <Route path="/resume" element={<ResumeLandingPage />} />
          <Route path="/resumetemplate" element={<ResumeTemplatePage />} />
          <Route
            path="/resume-analyzer"
            element={
              <ResumeAnalyzerProvider>
                <ResumeAnalyzer />
              </ResumeAnalyzerProvider>
            }
          />
          {/* <Route path="/resumeform" element={<ResumeForm />} />
          <Route path="/resumepreview" element={<ResumePreview />} /> */}
          <Route path="/quiz" element={<QuizHomePage />} />
          <Route path="/quiz/play" element={<QuizPlayPage />} />
          <Route path="/quiz-result" element={<QuizResultPage />} />
          <Route path="/quizcourse" element={<QuizCoursePage />} />
          {/* Interview routes - wrapped in shared InterviewLayout to preserve state */}
          <Route element={<InterviewLayout />}>
            <Route path="/selectRole" element={<RoleSelector />} />
            <Route path="/interview" element={<InterviewWorkspace />} />
            <Route path="/summary" element={<InterviewSummary />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
