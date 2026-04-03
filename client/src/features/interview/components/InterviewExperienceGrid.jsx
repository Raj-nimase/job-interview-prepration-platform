import { BarChart3, Check } from "lucide-react";

export function InterviewExperienceGrid({
  options,
  selectedValue,
  onSelect,
}) {
  return (
    <div className="space-y-4">
      <label className="text-xl font-bold flex items-center gap-2 text-foreground font-headline">
        <BarChart3 className="w-6 h-6 text-emerald-600 shrink-0" />
        Experience level
      </label>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {options.map(({ value, title, subtitle, Icon }) => {
          const selected = selectedValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                selected
                  ? "border-2 border-emerald-600 bg-emerald-500/5 shadow-sm"
                  : "border-border bg-card hover:border-emerald-500/40"
              }`}
            >
              {selected && (
                <div className="absolute -top-px -right-px">
                  <div className="bg-emerald-600 text-white p-1 rounded-bl-lg rounded-tr-xl">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                </div>
              )}
              <div
                className={
                  selected
                    ? "text-emerald-600 mb-2"
                    : "text-muted-foreground group-hover:text-emerald-600 mb-2"
                }
              >
                <Icon className="w-8 h-8" strokeWidth={1.75} />
              </div>
              <h4
                className={`font-bold text-base ${selected ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}
              >
                {title}
              </h4>
              <p
                className={`text-xs sm:text-sm mt-0.5 ${selected ? "text-emerald-600/80" : "text-muted-foreground"}`}
              >
                {subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
