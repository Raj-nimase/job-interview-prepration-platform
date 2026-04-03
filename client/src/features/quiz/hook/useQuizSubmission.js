import { useCallback, useState } from "react";
import * as authApi from "../../auth/services/auth.api";
import { submitQuizAttempt } from "../services/quiz.api";

export function useQuizSubmission(topic, level) {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (answers) => {
      setSubmitting(true);
      try {
        const me = await authApi.getMe();
        const res = await submitQuizAttempt({
          userId: me?.user?.id,
          topic,
          level,
          answers,
        });
        return res;
      } finally {
        setSubmitting(false);
      }
    },
    [topic, level]
  );

  return { submit, submitting };
}
