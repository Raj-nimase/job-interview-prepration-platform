export function InterviewWorkspaceTip({ role }) {
  return (
    <div className="mt-10 md:mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      <div className="flex-1 border-t border-border pt-6">
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg italic font-medium max-w-2xl">
          We weigh structure, clarity, and role fit for{" "}
          <span className="not-italic font-semibold text-foreground">
            {role || "your target role"}
          </span>
          . Take a breath, then answer with a clear situation, your actions,
          and the outcome.
        </p>
      </div>
      <div className="w-full lg:w-72 shrink-0">
        <div className="bg-muted/50 p-5 rounded-2xl border border-border/60">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-bold">
            Session quality
          </p>
          <p className="text-sm font-semibold text-foreground mt-2">
            Answer fully before requesting feedback for the best score.
          </p>
        </div>
      </div>
    </div>
  );
}
