import { useCallback, useState } from "react";
import * as authApi from "../../auth/services/auth.api";
import { submitQuizAttempt } from "../services/quiz.api";

export function useQuizSubmission(topic) {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (answers) => {
      setSubmitting(true);
      try {
        const me = await authApi.getMe();
        const res = await submitQuizAttempt({
          userId: me?.user?.id,
          topic,
          answers,
        });
        return res;
      } finally {
        setSubmitting(false);
      }
    },
    [topic]
  );

  return { submit, submitting };
}

