import { useEffect, useState } from "react";
import { fetchUserProgress } from "../services/quiz.api";

export function useQuizCourseProgress(userId, topic) {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProgress = async () => {
      if (!userId || !topic) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchUserProgress(userId, topic);
        if (!mounted) return;
        setUnlockedLevel(data.unlockedLevel || 1);
      } catch (err) {
        console.error("[QuizCourse] Error fetching progress:", err);
        if (!mounted) return;
        // Fallback to level 1
        setUnlockedLevel(1);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    loadProgress();
    return () => { mounted = false; };
  }, [userId, topic]);

  return { unlockedLevel, setUnlockedLevel, loading };
}
