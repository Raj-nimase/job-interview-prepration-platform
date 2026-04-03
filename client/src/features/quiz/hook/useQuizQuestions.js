import { useEffect, useState } from "react";
import { fetchQuizQuestions } from "../services/quiz.api";

export function useQuizQuestions(topic) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!topic) {
        if (!mounted) return;
        setLoading(false);
        setQuestions([]);
        setError("No topic selected. Please go back and select a topic.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuizQuestions(topic);
        if (!mounted) return;
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        console.error("[QuizPlay] Error fetching questions:", err);
        setError(err?.response?.data?.message || "Failed to load questions");
        setQuestions([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [topic]);

  return { questions, loading, error };
}

