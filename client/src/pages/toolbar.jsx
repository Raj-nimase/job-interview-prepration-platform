import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, FileText, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export function Toolbar({ onExport, activePanel, setActivePanel }) {
  return (
    <div className="px-4 md:px-6">
      <div className="flex items-center justify-between h-16 gap-4">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-slate-700 border border-slate-600 hover:border-slate-500 shrink-0"
          >
            <Link to="/resumetemplate">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Templates</span>
            </Link>
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-slate-900" />
            </div>
            <span className="text-white font-semibold text-sm truncate">
              Resume Editor
            </span>
          </div>
        </div>

        {/* Center: Mobile panel toggle */}
        <div className="flex lg:hidden items-center bg-slate-800 border border-slate-700 rounded-lg p-1 gap-1">
          <button
            onClick={() => setActivePanel?.("form")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activePanel === "form"
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => setActivePanel?.("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activePanel === "preview"
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="default"
            onClick={onExport}
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-emerald-500/20 gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
