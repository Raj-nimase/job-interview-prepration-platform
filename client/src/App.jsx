import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import About from "./pages/About"
import Contact from "./pages/Contact"
import ResumeHub from "./pages/ResumeLanding";
import { ResumeForm } from "./pages/resume-form";
import { ResumePreview } from "./pages/resume-preview";
import QuizHome from "./pages/Quiz/QuizHome";
import QuizPlay from "./pages/Quiz/QuizPlay";
import QuizResult from "./pages/Quiz/QuizResult";
import Navbar from "./components/Navbar";
import InterviewTips from "./pages/Interviewtip";
import QuizCourse from "./pages/Quiz/QuizCourse";
import ResumeTemplate from "./pages/ResumeTemplate";
//mock ai

import { InterviewSummary } from "./components/InterviewSummery";
import { InterviewWorkspace } from "./components/InterviewWorkspace";
import { RoleSelector } from "./components/RoleSelector";

function App() {
  return (
    <BrowserRouter>
       <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/tips" element={<InterviewTips />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/resume" element={<ResumeHub />} />
        <Route path="/resumetemplate" element={<ResumeTemplate />} />
        <Route path="/resumeform" element={<ResumeForm />} />
        <Route path="/resumepreview" element={<ResumePreview />} />
        <Route path="/quiz" element={<QuizHome />} />
        <Route path="/quiz/play" element={<QuizPlay />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        <Route path="/quizcourse" element={<QuizCourse />} />
        <Route path="/selectRole" element={<RoleSelector />} />
        <Route path="/interview" element={<InterviewWorkspace />} />
        <Route path="/summary" element={<InterviewSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
