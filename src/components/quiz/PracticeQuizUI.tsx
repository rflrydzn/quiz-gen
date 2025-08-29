"use client";
import { useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
// import questions from "@/../test.json";
import { Label } from "@/components/ui/label";
import PracticeModeSummary from "@/app/quiz/dev/PracticeModeSummary";
import { question } from "@/types/types";
const PracticeQuizUI = ({ questions }: { questions: question[] }) => {
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
  const [currentQuestionInterface, setCurrentQuestionInterface] = useState<
    "mcq" | "input"
  >("mcq");
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [isRoundTwo, setIsRoundTwo] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const currentQuestion = roundQuestions[currentIndex];
  const lastQuestionIndex = roundQuestions.length - 1;
  const correctAnswer = currentQuestion.answer;
  const [isCorrect, setIsCorrect] = useState(false);
  const percentageScore =
    (Object.values(knownAnswer).reduce((acc, curr) => acc + curr, 0) /
      (questions.length * 2)) *
    100;
  const summaryKnownCount = Object.values(knownAnswer).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const isOpenEnded = (questionId: string) => {
    return knownAnswer.hasOwnProperty(questionId);
  };

  const shuffleArray = (array: question[]): question[] => {
    // Fisher-Yates shuffle
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const nextQuestionToaster = () => {
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
    if (currentIndex === lastQuestionIndex && isRoundTwo) {
      setShowSummary(true);
    }
    resetQuestionState();
  };

  const handleKnown = () => {
    if (retryAttempts === 0) {
      setKnownAnswer((prev) => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
      }));
    }

    if (retryAttempts === 1) {
      setKnownAnswer((prev) => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 0,
      }));
    }
    setTimeout(() => nextQuestion(), 1000);
  };

  const handleUnknown = () => {
    setUnknownAnswer((prevUnknown) => {
      if (prevUnknown.includes(currentQuestion.id)) {
        return prevUnknown; // already added, don't duplicate
      }
      return [...prevUnknown, currentQuestion.id];
    });
    setTimeout(() => setWaitingForNext(true), 100);
    nextQuestionToaster();
  };
  const resetQuestionState = () => {
    setUserAnswer("");
    setRetryAttempts(0);
    setWrongAnswers([]);
    setWaitingForNext(false);
    setisSkipped(false); // ✅ reset skip flag
    setIsCorrect(false);
    setFirstInput("");
    setSecondInput("");
  };

  const handleSubmit = () => {
    const attemptValue = retryAttempts === 0 ? firstInput : secondInput;
    const lowercaseInput = attemptValue.toLowerCase();
    const lowercaseAnswer = correctAnswer.toLowerCase();

    if (lowercaseInput === lowercaseAnswer) {
      setIsCorrect(true);
      handleKnown();
    } else {
      setRetryAttempts((prev) => {
        const newCount = prev + 1;
        if (newCount === 2) handleUnknown();
        return newCount;
      });
    }
    firstInputRef.current?.blur(); // optional: remove focus
    secondInputRef.current?.blur();
  };

  const handleContinue = () => {
    const filterRemaining = questions.filter(
      (q: question) => knownAnswer[q.id] !== 2
    );
    const mastered = Object.fromEntries(
      Object.entries(knownAnswer).filter(([id, value]) => value === 2)
    );

    setRoundQuestions(filterRemaining);
    console.log("reset", roundQuestions);
    setShowSummary(false);
    setIsRoundTwo(false);
    setUnknownAnswer([]);
    setCurrentIndex(0);
    setKnownAnswer(mastered);
    console.log("reset", roundQuestions);
  };

  const handleReset = () => {
    setRoundQuestions(questions);
    setShowSummary(false);
    setIsRoundTwo(false);
    setUnknownAnswer([]);
    setKnownAnswer({});
    setCurrentIndex(0);
    toast.dismiss();
  };
  // Check answer when user selects
  useEffect(() => firstInputRef.current?.focus(), [currentIndex]);
  useEffect(() => console.log("known", knownAnswer));
  useEffect(() => console.log("unknown", unknownAnswer));
  useEffect(() => {
    if (retryAttempts === 1) {
      secondInputRef.current?.focus();
    }
  }, [retryAttempts]);

  useEffect(() => {
    if (userAnswer === "") return;

    if (!isOpenEnded(currentQuestion.id)) {
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
    }
  }, [userAnswer, correctAnswer, currentQuestion.id]);

  // Update this in your nextQuestion function or when currentIndex changes
  useEffect(() => {
    // Determine interface type when question loads, before any user interaction
    const shouldShowInput = isOpenEnded(currentQuestion.id) && isRoundTwo;
    setCurrentQuestionInterface(shouldShowInput ? "input" : "mcq");
  }, [currentIndex, isRoundTwo, currentQuestion.id]);

  // Auto-next when waiting and user presses a key
  useEffect(() => {
    if (!waitingForNext) return;
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation(); // stop event bubbling
      nextQuestion();
    };
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
      <PracticeModeSummary
        questions={questions}
        knownAnswer={knownAnswer}
        percentageScore={percentageScore}
        summaryKnownCount={summaryKnownCount}
        onHandleContinue={() => handleContinue()}
        onHandleReset={() => handleReset()}
      />
    );
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-6">
      <div className=" flex flex-col gap-5 w-full max-w-4xl mt-16">
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
        {/* main */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex} // important: triggers animation when index changes
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-semibold"
          >
            <h3 className="text-center scroll-m-20 text-2xl font-semibold tracking-tight my-5">
              {currentQuestion.question}
            </h3>

            <div className="flex flex-col gap-3">
              {currentQuestionInterface === "input" ? (
                <div className="flex flex-col gap-3">
                  <div className="">
                    <Label className="mb-2">
                      {isSkipped && retryAttempts === 1
                        ? "No sweat, you're still learning!"
                        : isCorrect && retryAttempts === 0
                        ? "Good job"
                        : isCorrect && retryAttempts === 1
                        ? "You're getting it! You'll see this again later."
                        : retryAttempts === 2 && !isCorrect
                        ? "Let's keep practicing! You'll see this again later."
                        : retryAttempts >= 2
                        ? "You will see this again later"
                        : isSkipped
                        ? "Give this one a try later"
                        : retryAttempts === 1 && isOpenEnded(currentQuestion.id)
                        ? "Previous answer"
                        : retryAttempts === 1
                        ? "Let's try again"
                        : isOpenEnded(currentQuestion.id)
                        ? "Your Answer"
                        : "Choose an option"}
                    </Label>
                    <div className="relative">
                      <Input
                        onChange={(e) => setFirstInput(e.target.value)}
                        value={firstInput}
                        disabled={retryAttempts !== 0 || isSkipped}
                        className={
                          isCorrect && retryAttempts === 1
                            ? "hidden"
                            : retryAttempts !== 0
                            ? "border-red-300 h-12"
                            : isCorrect
                            ? " border-green-300 h-12"
                            : "h-12"
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSubmit();
                        }}
                        ref={firstInputRef}
                        placeholder={isSkipped ? "Skipped" : ""}
                      />

                      {/* ✅ ❌ animation for first input */}
                      <AnimatePresence mode="wait">
                        {isCorrect && retryAttempts === 0 && (
                          <motion.div
                            key="check"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
                          >
                            <Check size={20} />
                          </motion.div>
                        )}
                        {((!isCorrect && retryAttempts !== 0) ||
                          (isSkipped && retryAttempts === 0)) && (
                          <motion.div
                            key="x"
                            initial={{ opacity: 0, scale: 0, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0, rotate: 45 }}
                            transition={{ duration: 0.25 }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                              isSkipped && retryAttempts === 0
                                ? " text-muted"
                                : "text-red-500"
                            }`}
                          >
                            <X size={20} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* second */}
                  <AnimatePresence initial={false}>
                    {(retryAttempts !== 0 || isSkipped) && (
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <Label
                          className={
                            retryAttempts === 0 && !isSkipped
                              ? "hidden"
                              : "inline mb-2"
                          }
                        >
                          {retryAttempts === 2 || isSkipped
                            ? "Correct Answer"
                            : retryAttempts === 1 && !isCorrect
                            ? "Let's try again"
                            : ""}
                        </Label>
                        <div className="relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`input-state-${
                                isSkipped
                                  ? "skipped"
                                  : retryAttempts === 2
                                  ? "failed"
                                  : "active"
                              }`}
                              initial={
                                isSkipped || retryAttempts === 2
                                  ? { y: -20, opacity: 0 } // Top-to-bottom when showing answer
                                  : { opacity: 1 } // No animation for normal input
                              }
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              <Input
                                className={
                                  retryAttempts === 0 && !isSkipped
                                    ? "hidden"
                                    : `inline h-12 ${
                                        isCorrect ||
                                        isSkipped ||
                                        retryAttempts === 2
                                          ? "border-green-300"
                                          : ""
                                      }`
                                }
                                onChange={(e) => setSecondInput(e.target.value)}
                                value={
                                  isSkipped || retryAttempts === 2
                                    ? correctAnswer
                                    : secondInput ?? ""
                                }
                                disabled={retryAttempts !== 1}
                                ref={secondInputRef}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSubmit();
                                }}
                              />
                            </motion.div>
                          </AnimatePresence>

                          {/* ✅ ❌ animation for second input */}
                          <AnimatePresence mode="wait">
                            {(isCorrect && retryAttempts === 1) ||
                              isSkipped ||
                              (retryAttempts === 2 && (
                                <motion.div
                                  key="check-2"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
                                >
                                  <Check size={20} />
                                </motion.div>
                              ))}
                            {!isCorrect &&
                              retryAttempts === 0 &&
                              !isSkipped && (
                                <motion.div
                                  key="x-2"
                                  initial={{
                                    opacity: 0,
                                    scale: 0,
                                    rotate: -45,
                                  }}
                                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                  exit={{ opacity: 0, scale: 0, rotate: 45 }}
                                  transition={{ duration: 0.25 }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
                                >
                                  <X size={20} />
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    {currentQuestion.choices.map(
                      (choice: string, index: number) => (
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
                      )
                    )}
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
          </motion.div>
        </AnimatePresence>
      </div>
      {/* <Button
        className="fixed left-1/2 top-0"
        onClick={() => {
          const obj = questions.reduce((acc: any, item: any) => {
            acc[item.id] = 2; // set value 2 for each id
            return acc;
          }, {});
          setIsRoundTwo(true);

          setKnownAnswer(obj);
          nextQuestion();
        }}
      >
        Skip to round 2
      </Button> */}
    </div>
  );
};

export default PracticeQuizUI;
