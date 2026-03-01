import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ResumeForm } from "./resume-form";
import { ResumePreview } from "./resume-preview";
import { Toolbar } from "./toolbar";
import { initialResumeData } from "../lib/initial-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Editor() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "classic";
  const [resumeData, setResumeData] = useState(initialResumeData);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm mt-18 print:hidden">
        <Toolbar onExport={handlePrint} />
      </header>

      {/* Two-column layout with fixed height */}
      <main className="grid grid-cols-1 lg:grid-cols-2 flex-1">
        {/* Form area with independent scroll */}
        <ScrollArea
          id="resume-form-area"
          className="h-[calc(100vh-64px)] border-r border-slate-700 print:hidden"
        >
          <div className="p-8">
            <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          </div>
        </ScrollArea>

        {/* Preview area with independent scroll */}
        <ScrollArea className="h-[calc(100vh-64px)] print:h-auto overflow-visible">
          <div
            id="resume-preview-wrapper"
            className="pt-8 p-4 bg-gray-100 dark:bg-slate-900 print:p-0 print:bg-white" >
            <ResumePreview resumeData={resumeData} templateId={templateId} />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
