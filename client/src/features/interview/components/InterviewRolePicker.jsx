import { Input } from "@/components/ui/input";
import { Search, Briefcase } from "lucide-react";

export function InterviewRolePicker({ value, onChange, chips, onChipSelect }) {
  return (
    <div className="space-y-4">
      <label className="text-xl font-bold flex items-center gap-2 text-foreground font-headline">
        <Briefcase className="w-6 h-6 text-emerald-600 shrink-0" />
        Role selection
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <Input
          className="w-full pl-12 pr-4 py-4 h-auto text-lg rounded-t-xl border-0 border-b-2 border-border bg-muted/40 focus-visible:border-emerald-500 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
          placeholder="e.g. Senior Software Architect"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {chips.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onChipSelect(role)}
            className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-transparent hover:border-emerald-500/30"
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
