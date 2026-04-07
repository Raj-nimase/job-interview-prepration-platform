import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/pages/Login";
import Dashboard from "./features/dashboard/pages/DashboardPage";
import Editor from "./features/resume-builder/pages/ResumeEditorPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResumeHub from "./features/resume-builder/pages/ResumeLandingPage";
import QuizHome from "./features/quiz/pages/QuizHomePage";
import QuizPlay from "./features/quiz/pages/QuizPlayPage";
import QuizResult from "./features/quiz/pages/QuizResultPage";
import Navbar from "./components/Navbar";
import InterviewTips from "./pages/Interviewtip";
import QuizCourse from "./features/quiz/pages/QuizCoursePage";
import ResumeTemplate from "./features/resume-builder/pages/ResumeTemplatePage";
import PastInterviewReport from "./features/interview/pages/PastInterviewReport";

// toast notifications
import { Toaster } from "react-hot-toast";

import { InterviewSummary } from "./features/interview/pages/InterviewSummary";
import { InterviewWorkspace } from "./features/interview/pages/InterviewWorkspace";
import { RoleSelector } from "./features/interview/pages/RoleSelector";

import { AuthProvider } from "./features/auth/context/auth.context";
import { InterviewProvider } from "./features/interview/context/interview.context";
import { ResumeAnalyzerProvider } from "./features/resume-analyzer/context/resume-analyzer.context";
import { ResumeAnalyzer } from "./features/resume-analyzer/pages/ResumeAnalyzer";
import { ActionPlanPage } from "./features/resume-analyzer/pages/ActionPlanPage";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/tips" element={<InterviewTips />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/resume" element={<ResumeHub />} />
          <Route path="/resumetemplate" element={<ResumeTemplate />} />
          <Route
            path="/resume-analyzer"
            element={
              <ResumeAnalyzerProvider>
                <ResumeAnalyzer />
              </ResumeAnalyzerProvider>
            }
          />
          <Route
            path="/resume-analyzer/action-plan"
            element={
              <ResumeAnalyzerProvider>
                <ActionPlanPage />
              </ResumeAnalyzerProvider>
            }
          />
          {/* <Route path="/resumeform" element={<ResumeForm />} />
          <Route path="/resumepreview" element={<ResumePreview />} /> */}
          <Route path="/quiz" element={<QuizHome />} />
          <Route path="/quiz/play" element={<QuizPlay />} />
          <Route path="/quiz-result" element={<QuizResult />} />
          <Route path="/quizcourse" element={<QuizCourse />} />
          {/* Interview routes - wrapped in shared InterviewLayout to preserve state */}
          <Route element={<InterviewLayout />}>
            <Route path="/selectRole" element={<RoleSelector />} />
            <Route path="/interview" element={<InterviewWorkspace />} />
            <Route path="/summary" element={<InterviewSummary />} />
          </Route>
          <Route
            path="/interview-report/:id"
            element={<PastInterviewReport />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
