import { useMemo, useState } from "react";
import { getInitialResumeData } from "../services/resumeBuilder.service";

export function useResumeBuilder() {
  const initial = useMemo(() => getInitialResumeData(), []);
  const [resumeData, setResumeData] = useState(initial);

  return { resumeData, setResumeData };
}

