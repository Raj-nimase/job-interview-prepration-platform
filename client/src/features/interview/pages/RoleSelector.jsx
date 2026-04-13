import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hook/useInterview";
import { InterviewSetupHero } from "../components/InterviewSetupHero";
import { InterviewRolePicker } from "../components/InterviewRolePicker";
import { InterviewExperienceGrid } from "../components/InterviewExperienceGrid";
import { InterviewSetupSidebar } from "../components/InterviewSetupSidebar";
import { Map, Users, Target, Building2, Briefcase, Bookmark } from "lucide-react";

import {
  SETUP_ROLE_CHIPS,
  SETUP_EXPERIENCE_LEVELS,
} from "../constants/interviewSetup.constants";

export function RoleSelector() {
  const [roleDraft, setRoleDraft] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const {
    setRole, setExperience, setHistory, beginInterview,
    interviewType, setInterviewType,
    personaStyle, setPersonaStyle,
    jobDescription, setJobDescription,
    targetCompany, setTargetCompany,
    includeBookmarked, setIncludeBookmarked,
    questionCount, setQuestionCount,
  } = useInterview();
  const nav = useNavigate();

  const handleStartInterview = async () => {
    const r = roleDraft.trim();
    if (!r || !selectedExperience) return;

    setIsStarting(true);
    setRole(r);
    setExperience(selectedExperience);
    setHistory([]);

    localStorage.removeItem("interviewHistory");
    localStorage.setItem("interviewRole", r);
    localStorage.setItem("interviewExperience", selectedExperience);
    localStorage.setItem("interviewType", interviewType);
    localStorage.setItem("interviewPersona", personaStyle);
    localStorage.setItem("interviewJD", jobDescription);
    localStorage.setItem("interviewCompany", targetCompany);

    await beginInterview(r, selectedExperience);
    nav("/interview");
  };

  const isReady = roleDraft.trim() && selectedExperience;

  return (
    <div className="min-h-screen w-screen bg-background text-foreground">
      <section className="flex-1 overflow-y-auto px-5 md:px-12 lg:px-30 py-10 md:pt-20">
        <div className="max-w-full mx-auto">
          <InterviewSetupHero />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-8 space-y-10">
              
              {/* Step 1 & 2: Role and Experience */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2 font-headline text-lg font-bold">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">1</span>
                  Select your role & level
                </div>
                <InterviewRolePicker
                  value={roleDraft}
                  onChange={setRoleDraft}
                  chips={SETUP_ROLE_CHIPS}
                  onChipSelect={(r) => setRoleDraft(r)}
                />
                <InterviewExperienceGrid
                  options={SETUP_EXPERIENCE_LEVELS}
                  selectedValue={selectedExperience}
                  onSelect={setSelectedExperience}
                />
              </div>

              {/* Step 3: Interview Type & Persona */}
              <div className="space-y-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2 font-headline text-lg font-bold">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">2</span>
                  Customize the environment
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Interview Type */}
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4" /> Interview type
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {["Technical", "Behavioral", "Mixed"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setInterviewType(type)}
                          className={`px-4 py-3 rounded-xl border text-left flex items-start flex-col gap-1 transition-all ${interviewType === type ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 shadow-sm" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}
                        >
                          <span className="font-bold text-sm tracking-wide">{type}</span>
                          <span className="text-xs opacity-80">
                            {type === "Technical" && "Domain-specific hard skills."}
                            {type === "Behavioral" && "STAR-method narrative questions."}
                            {type === "Mixed" && "A balance of technical & behavioral."}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Persona */}
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4" /> Interviewer persona
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {["Friendly", "Neutral", "Skeptical"].map((style) => (
                        <button
                          key={style}
                          onClick={() => setPersonaStyle(style)}
                          className={`px-4 py-3 rounded-xl border text-left flex items-start flex-col gap-1 transition-all ${personaStyle === style ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 shadow-sm" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}
                        >
                          <span className="font-bold text-sm tracking-wide">{style}</span>
                          <span className="text-xs opacity-80">
                            {style === "Friendly" && "Supportive, gives hints."}
                            {style === "Neutral" && "Standard, professional tone."}
                            {style === "Skeptical" && "Challenges your answers."}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Context Input & Advanced Settings */}
              <div className="space-y-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-headline text-lg font-bold flex-1">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">3</span>
                    <span className="truncate">Target context & settings <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span></span>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4" /> Target company
                    </label>
                    <input
                      type="text"
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="e.g. Google, Stripe, local startup..."
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4" /> Job description
                    </label>
                    <textarea
                      placeholder="Paste the requirements from the job posting (helps tailor questions)..."
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      maxLength={3000}
                    />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {jobDescription.length} / 3000
                    </div>
                  </div>
                  
                  {/* Bookmarks Toggle */}
                  <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={includeBookmarked}
                          onChange={(e) => setIncludeBookmarked(e.target.checked)}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${includeBookmarked ? "bg-emerald-500" : "bg-muted-foreground/30"}`}>
                          <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${includeBookmarked ? "left-5" : "left-1"}`} />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-amber-500" />
                        Include bookmarked
                      </span>
                    </label>

                    <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                          Questions
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Starting limit</span>
                      </div>
                      <div className="flex gap-1">
                        {[5, 10, 15].map(q => (
                          <button
                            key={q}
                            onClick={() => setQuestionCount(q)}
                            className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${questionCount === q ? "bg-emerald-600 text-white shadow-md" : "bg-muted hover:bg-border text-muted-foreground"}`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Sidebar */}
            <InterviewSetupSidebar
              onStart={handleStartInterview}
              disabled={!isReady}
              isStarting={isStarting}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
