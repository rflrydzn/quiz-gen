"use client";
import { PracticeQuizUIProps } from "@/types/types";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import questions from "@/../test.json";
const PracticeQuizUI = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [knownAnswer, setKnownAnswer] = useState<{
    [questionId: string]: number;
  }>({});
  const [unknownAnswer, setUnknownAnswer] = useState<string[]>([]);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [isSkipped, setisSkipped] = useState(false);
  const [roundQuestions, setRoundQuestions] = useState(questions);
  const [userInput, setUserInput] = useState("");
  const [isRoundTwo, setIsRoundTwo] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mastered, setMasteredQuestions] = useState<string[]>();
  const currentQuestion = roundQuestions[currentIndex];
  const lastQuestionIndex = questions.length - 1;
  const correctAnswer = currentQuestion.answer;
  const isCorrect = userAnswer === correctAnswer;
  const knownCount = Object.keys(knownAnswer).length;
  const unknownCount = unknownAnswer.length;
  const percentageScore =
    (Object.values(knownAnswer).reduce((acc, curr) => acc + curr, 0) /
      (questions.length * 2)) *
    100;
  const summaryKnownCount = Object.values(knownAnswer).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const filterunknown = questions.filter((q, i) =>
    unknownAnswer.includes(q.id)
  );

  const isOpenEnded = (questionId: string) => {
    return knownAnswer.hasOwnProperty(questionId);
  };

  const shuffleArray = (array: any[]) => {
    // Fisher-Yates shuffle
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const showToaster = () => {
    return toast("Press any key to continue.", {
      action: {
        label: "Continue",
        onClick: () => nextQuestion(),
      },
    });
  };
  const nextQuestion = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (currentIndex === lastQuestionIndex) {
      const shuffled = shuffleArray(roundQuestions);
      setRoundQuestions(shuffled);
      setIsRoundTwo(true);
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, lastQuestionIndex));
    }

    resetQuestionState();
  };

  const prevQuestion = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    resetQuestionState();
  };

  const handleKnown = () => {
    setKnownAnswer((prev) => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
    }));
    setWaitingForNext(true);
    showToaster();
  };

  const handleUnknown = () => {
    setUnknownAnswer((prevUnknown) => {
      if (prevUnknown.includes(currentQuestion.id)) {
        return prevUnknown; // already added, don't duplicate
      }
      return [...prevUnknown, currentQuestion.id];
    });
    setWaitingForNext(true);
    showToaster();
  };
  const resetQuestionState = () => {
    setUserAnswer("");
    setRetryAttempts(0);
    setWrongAnswers([]);
    setWaitingForNext(false);
    setisSkipped(false); // ✅ reset skip flag
  };

  const handleSubmit = () => {
    if (userInput === correctAnswer) {
      handleKnown();
    }

    if (userInput !== correctAnswer) {
      setRetryAttempts(retryAttempts + 1);
    }
  };
  // Check answer when user selects
  useEffect(() => console.log("retry attempts", retryAttempts));

  const getSummary = () => {
    const filterMastered = Object.keys(knownAnswer).filter(
      (qid) => knownAnswer[qid]
    );
    setMasteredQuestions(filterMastered);
    setShowSummary(true);
  };
  useEffect(() => {
    if (userAnswer === "") return;

    if (userAnswer !== correctAnswer) {
      setWrongAnswers((prev) => [...prev, userAnswer]);
      setRetryAttempts((prev) => {
        const newCount = prev + 1;
        if (newCount >= 2) {
          handleUnknown();
        }
        return newCount;
      });
    } else if (userAnswer === correctAnswer) {
      if (retryAttempts <= 1) {
        handleKnown();
      }
    }
  }, [userAnswer, correctAnswer, currentQuestion.id]);

  // Auto-next when waiting and user presses a key
  useEffect(() => {
    if (!waitingForNext) return;
    const handleKeyPress = () => nextQuestion();
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [waitingForNext]);

  const renderChoices = (choice: string) => {
    switch (true) {
      // Keep wrong answers red
      case wrongAnswers.includes(choice):
        return "border-red-400";

      // Correct answer green if selected OR after 2 wrongs
      case choice === correctAnswer &&
        (userAnswer === correctAnswer || wrongAnswers.length >= 2):
        return "border-green-400";
      case choice === correctAnswer && isSkipped:
        return "border-green-400";
      default:
        return "";
    }
  };

  if (showSummary)
    return (
      <div>
        <p>
          total set progress:{" "}
          {(Object.values(knownAnswer).reduce((acc, curr) => acc + curr, 0) /
            (questions.length * 2)) *
            100}
        </p>
        <div>
          <div className="w-full flex items-center justify-center">
            {/* Progress bar */}
            <div className="relative w-full">
              <Progress value={percentageScore} className="h-4" />

              {/* Circle count at the end of the progress */}
              <div
                className="absolute -top-2  flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shadow-md transition-all"
                style={{ left: `calc(${percentageScore}% - 16px)` }} // -16px centers the circle
              >
                {summaryKnownCount}
              </div>
            </div>

            <div className="rounded-full bg-black text-white h-8 w-8 items-center justify-center flex ml-2">
              {questions.length * 2}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          mastered:{" "}
          {questions
            .filter((q) => knownAnswer[q.id] === 2)
            .map((q) => (
              <div className="w-full border-2 flex">
                <div className="w-1/3">{q.question}</div>
                <div className="w-2/3">{q.answer}</div>
              </div>
            ))}
        </div>
      </div>
    );
  return (
    <div className=" w-full h-screen items-center justify-center flex">
      <div className=" flex flex-col gap-5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-5">
          {currentQuestion.question}
        </h3>

        <div className="flex flex-col gap-3">
          <span className="">
            {isSkipped && retryAttempts === 1
              ? "No sweat, you're still learning!"
              : isCorrect && retryAttempts === 0
              ? "Good job"
              : isCorrect && retryAttempts === 1
              ? "You're getting it! You'll see this again later."
              : retryAttempts >= 2
              ? "You will see this again later"
              : isSkipped
              ? "Give this one a try later"
              : retryAttempts === 1
              ? "Let's try again"
              : isOpenEnded(currentQuestion.id)
              ? "Your Answer"
              : "Choose an option"}
          </span>
          {isOpenEnded(currentQuestion.id) && isRoundTwo ? (
            <div className="flex flex-col gap-3">
              <Input
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                disabled={retryAttempts !== 0}
              />
              <Input
                className={retryAttempts === 0 ? "hidden" : "inline"}
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                disabled={retryAttempts !== 1}
              />
              <div className="self-end">
                <Button onClick={handleSubmit}>Submit</Button>
                <Button
                  onClick={() => {
                    setisSkipped(true);
                    handleUnknown();
                  }}
                  variant="ghost"
                  className="self-end"
                >
                  {retryAttempts === 0 ? "Don't know?" : "Skip"}
                </Button>
              </div>
              {/* <Button onClick={getSummary}>GET summary</Button> */}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <ToggleGroup
                type="single"
                value={userAnswer}
                className="grid grid-cols-2 gap-3"
              >
                {currentQuestion.choices.map((choice, index) => (
                  <ToggleGroupItem
                    variant="outline"
                    value={choice}
                    aria-label={choice}
                    key={index}
                    onClick={() => setUserAnswer(choice)}
                    className={
                      renderChoices(choice) +
                      " scroll-m-20 text-xl font-semibold tracking-tight p-6 "
                    }
                  >
                    {choice}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Button
                onClick={() => {
                  setisSkipped(true);
                  handleUnknown();
                }}
                variant="ghost"
                className="self-end"
              >
                {retryAttempts === 0 ? "Don't know?" : "Skip"}
              </Button>
            </div>
          )}
        </div>

        {/* <div className="mt-4 flex gap-2">
          <Button onClick={prevQuestion} disabled={currentIndex === 0}>
            Previous
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={currentIndex === lastQuestionIndex}
          >
            Next
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default PracticeQuizUI;
