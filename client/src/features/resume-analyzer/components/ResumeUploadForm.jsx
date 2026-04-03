import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  Briefcase,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const MotionP = motion.p;
const MotionButton = motion.button;

export function ResumeUploadForm({
  file,
  onFileChange,
  targetRole,
  onTargetRoleChange,
  onSubmit,
  isAnalyzing,
  error,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    const isPdf =
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.name?.toLowerCase().endsWith(".pdf"));
    if (isPdf) {
      onFileChange(droppedFile);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileChange(selected);
    // Reset input so selecting the same file again still triggers onChange.
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex h-48 items-center justify-center rounded-2xl border-2 border-dashed transition ${
          file
            ? "border-emerald-500/60 bg-emerald-500/5"
            : "border-border hover:border-emerald-500/60 hover:bg-emerald-500/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        {file ? (
          <div className="z-[1] flex items-center gap-3 px-4">
            <FileText size={28} className="text-emerald-500" />
            <div className="text-left min-w-0">
              <p className="font-semibold text-foreground truncate max-w-[220px] sm:max-w-[340px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB · PDF
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="z-20 h-7 w-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 pointer-events-none">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Upload size={28} />
            </div>
            <p className="text-base font-semibold text-foreground">
              Drag &amp; drop your PDF
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse files (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Target Role */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="target-role"
        >
          Target Role
        </label>
        <div className="relative rounded-md border border-input bg-background focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20">
          <Briefcase
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="target-role"
            type="text"
            placeholder="e.g. Senior Product Manager"
            value={targetRole}
            onChange={(e) => onTargetRoleChange(e.target.value)}
            className="h-11 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <MotionP
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
        >
          <AlertCircle size={16} />
          {error}
        </MotionP>
      )}

      {/* Submit */}
      <MotionButton
        onClick={onSubmit}
        disabled={!file || isAnalyzing}
        whileTap={{ scale: 0.98 }}
        className="h-12 w-full rounded-md bg-emerald-500 text-emerald-950 font-semibold inline-flex items-center justify-center gap-2 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Analyze Resume</span>
        <ArrowRight size={16} />
      </MotionButton>
    </div>
  );
}
