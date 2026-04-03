import { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    if (droppedFile && droppedFile.type === "application/pdf") {
      onFileChange(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      onFileChange(selected);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center justify-center gap-3 min-w-0">
            <FileText size={24} className="text-emerald-500 shrink-0" />
            <div className="text-left min-w-0 overflow-hidden">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="ml-2 p-1 rounded-full hover:bg-muted transition-colors shrink-0"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload size={36} className="mx-auto text-muted-foreground" />
            <p className="font-medium text-foreground">
              Drop your resume PDF here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (PDF only, max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Target Role Input */}
      <div className="space-y-2">
        <Label htmlFor="targetRole" className="text-foreground">
          Target Role (optional)
        </Label>
        <Input
          id="targetRole"
          type="text"
          placeholder="e.g. Frontend Developer, Data Scientist, Product Manager..."
          value={targetRole}
          onChange={(e) => onTargetRoleChange(e.target.value)}
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground">
          Providing a target role helps us give more relevant feedback and
          keyword suggestions.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-500 bg-red-500/10 rounded-lg px-4 py-2"
        >
          {error}
        </motion.p>
      )}

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        disabled={!file || isAnalyzing}
        className="w-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 h-12 text-base"
      >
        {isAnalyzing ? (
          <span className="flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Analyzing Resume...
          </span>
        ) : (
          "Analyze Resume"
        )}
      </Button>
    </div>
  );
}
