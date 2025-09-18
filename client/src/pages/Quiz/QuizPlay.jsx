import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizPlay() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(60);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    console.log(topic)
    axios
      .get(`http://localhost:4000/api/quiz/questions/${topic}`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [topic]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
    if (timer === 0) {
      handleNext();
    }
  }, [timer]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    setUserAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion._id, selectedOption },
    ]);

    setSelectedOption(null);
    setTimer(60);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.post("http://localhost:4000/api/quiz/submit", {
          userId,
          topic,
          answers: [
            ...userAnswers,
            { questionId: currentQuestion._id, selectedOption },
          ],
        });

        navigate(
          `/quiz-result?score=${res.data.score}&total=${questions.length}`
        );
      } catch (err) {
        console.error("Error submitting quiz:", err);
      }
    }
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex justify-center items-center">
        <p className="text-xl">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10 flex justify-center items-start mt-12">
      <div className="max-w-2xl w-full bg-[#1e293b] rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-300">
          <p>
            Question{" "}
            <span className="font-semibold text-white">
              {currentQuestionIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">{questions.length}</span>
          </p>
          <p className="text-green-400 font-bold">⏳ {timer}s</p>
        </div>

        {/* Question */}
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              className={`w-full text-left px-5 py-3 rounded-lg transition duration-200 border-2 ${
                selectedOption === option
                  ? "border-green-500 bg-green-100/10 text-green-300"
                  : "border-gray-600 hover:border-green-400 hover:bg-white/5"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Next/Finish Button */}
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className={`mt-8 w-full py-3 rounded-lg font-medium text-white transition ${
            selectedOption
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          {currentQuestionIndex + 1 === questions.length
            ? "Finish Quiz"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
