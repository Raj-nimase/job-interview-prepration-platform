import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hook/useInterview";
import { InterviewSetupHero } from "../components/InterviewSetupHero";
import { InterviewRolePicker } from "../components/InterviewRolePicker";
import { InterviewExperienceGrid } from "../components/InterviewExperienceGrid";
import { InterviewSetupSidebar } from "../components/InterviewSetupSidebar";

import {
  SETUP_ROLE_CHIPS,
  SETUP_EXPERIENCE_LEVELS,
} from "../constants/interviewSetup.constants";

export function RoleSelector() {
  const [roleDraft, setRoleDraft] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const { setRole, setExperience, setHistory, beginInterview } = useInterview();
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
            <div className="lg:col-span-8 space-y-6">
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
