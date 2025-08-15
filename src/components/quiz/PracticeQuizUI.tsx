import { PracticeQuizUIProps } from "@/types/types";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Button } from "../ui/button";
import { toast } from "sonner";
const PracticeQuizUI = ({ questions }: PracticeQuizUIProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [knownAnswer, setKnownAnswer] = useState<string[]>([]);
  const [unknownAnswer, setUnknownAnswer] = useState<string[]>([]);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [isSkipped, setisSkipped] = useState(false);
  const currentQuestion = questions[currentIndex];
  const lastQuestionIndex = questions.length - 1;
  const correctAnswer = currentQuestion.answer;

  const showToaster = () => {
    return toast("Press any key to continue.", {
      action: {
        label: "Continue",
        onClick: () => nextQuestion(),
      },
    });
  };
  const nextQuestion = () => {
    // Remove focus from any currently focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setCurrentIndex((prev) => Math.min(prev + 1, lastQuestionIndex));
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
    setKnownAnswer((prev) => [...prev, currentQuestion.id]);
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

  // Check answer when user selects
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

  useEffect(() => console.log("wrong", wrongAnswers), [wrongAnswers]);
  useEffect(() => console.log("knownAnswer", knownAnswer), [knownAnswer]);
  useEffect(() => console.log("unknownAnswer", unknownAnswer), [unknownAnswer]);
  useEffect(() => console.log("retry", retryAttempts), [retryAttempts]);
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

  return (
    <div>
      <p>{currentQuestion.question}</p>
      <span>
        {retryAttempts === 1
          ? "Let's try again"
          : retryAttempts >= 2
          ? "You will see this again later"
          : ""}
      </span>

      <ToggleGroup type="single" value={userAnswer}>
        {currentQuestion.choices.map((choice, index) => (
          <ToggleGroupItem
            variant="outline"
            value={choice}
            aria-label={choice}
            key={index}
            onClick={() => setUserAnswer(choice)}
            // className={
            //   wrongAnswers.length >= 2 && choice === correctAnswer
            //     ? "border-green-400"
            //     : wrongAnswers.includes(choice) &&
            //       !wrongAnswers.includes(correctAnswer)
            //     ? "border-red-400"
            //     : ""
            // }
            className={renderChoices(choice)}
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
      >
        Dont know
      </Button>
      <div className="mt-4 flex gap-2">
        <Button onClick={prevQuestion} disabled={currentIndex === 0}>
          Previous
        </Button>
        <Button
          onClick={nextQuestion}
          disabled={currentIndex === lastQuestionIndex}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PracticeQuizUI;
