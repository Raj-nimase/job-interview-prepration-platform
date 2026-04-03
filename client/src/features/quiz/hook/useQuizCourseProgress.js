import { useEffect, useState } from "react";

export function useQuizCourseProgress(defaultLevel = 1) {
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem("unlockedLevel");
    const parsed = saved ? parseInt(saved, 10) : defaultLevel;
    return Number.isFinite(parsed) ? parsed : defaultLevel;
  });

  useEffect(() => {
    localStorage.setItem("unlockedLevel", unlockedLevel);
  }, [unlockedLevel]);

  return { unlockedLevel, setUnlockedLevel };
}

