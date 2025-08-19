"use client";
import { PracticeQuizUIProps } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import questions from "@/../test.json";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  // const [userInput, setUserInput] = useState("");
  const [currentQuestionInterface, setCurrentQuestionInterface] = useState<
    "mcq" | "input"
  >("mcq");

  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [isRoundTwo, setIsRoundTwo] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mastered, setMasteredQuestions] = useState<string[]>();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const currentQuestion = roundQuestions[currentIndex];
  const lastQuestionIndex = roundQuestions.length - 1;
  const correctAnswer = currentQuestion.answer;
  const [isCorrect, setIsCorrect] = useState(false);
  const isIncorrect = userAnswer !== correctAnswer;
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

  const showToaster2 = () => {
    return toast("Practice remaining sets.", {
      duration: Infinity,
      action: {
        label: "Continue",
        onClick: () => handleContinue(),
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
      showToaster2();
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
    setIsTransitioning(true); // Add this line
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
    showToaster();
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
    setIsTransitioning(false);
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
    const filterRemaining = questions.filter((q) => knownAnswer[q.id] !== 2);
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

  useEffect(() => console.log("roundques", roundQuestions.length));
  useEffect(() => console.log("index", currentIndex));
  useEffect(() => console.log("round", isRoundTwo));
  if (showSummary)
    return (
      <div className="m-10">
        <div className="space-y-3 flex flex-col">
          <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">
            Going strong, you can do this.
          </h1>
          <Button className="fixed right-0 top-0" onClick={handleContinue}>
            Learn remaining sets
          </Button>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Total set progress:{" "}
            {(Object.values(knownAnswer).reduce((acc, curr) => acc + curr, 0) /
              (questions.length * 2)) *
              100}{" "}
            %
          </h4>
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
          <div className="flex justify-between">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Correct
            </h4>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Total questions
            </h4>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col space-y-5">
          {Object.values(knownAnswer).includes(2) && (
            <div className="space-y-2">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Mastered:
              </h4>
              {questions
                .filter((q) => knownAnswer[q.id] === 2)
                .map((q) => (
                  <div
                    className="w-full  flex border rounded-lg p-4  bg-background"
                    key={q.id}
                  >
                    <div className="w-1/4 p-3">
                      <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {q.answer}
                      </p>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="w-3/4 p-3">
                      <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {q.question}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {Object.values(knownAnswer).includes(1) && (
            <div className="space-y-2">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Partial Understanding:
              </h4>
              {questions
                .filter((q) => knownAnswer[q.id] === 1)
                .map((q) => (
                  <div
                    className="w-full  flex border rounded-lg p-4  bg-background"
                    key={q.id}
                  >
                    <div className="w-1/4 p-3">
                      <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {q.answer}
                      </p>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="w-3/4 p-3">
                      <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {q.question}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {questions
            .filter((q) => !(q.id in knownAnswer))
            .map((question) => (
              <div className="space-y-2" key={question.id}>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  Needs Review:
                </h4>

                <div
                  className="w-full  flex border rounded-lg p-4  bg-background"
                  key={question.id}
                >
                  <div className="w-1/4 p-3">
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      {question.answer}
                    </p>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="w-3/4 p-3">
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      {question.question}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  return (
    <div className=" w-full h-screen items-center justify-center flex">
      <div className="fixed top-0 left-1/2">
        <Button
          className=""
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
        </Button>
        <Button
          onClick={() => {
            setIsRoundTwo(true);

            setKnownAnswer({
              "55f97acc-4e37-4c77-9a2e-864e61555be5": 2,
              "faa83f9d-df95-42ff-82cc-1014a47e8515": 2,
              "00951171-419c-44d0-8474-c0a49486bb95": 1,
              "147d9840-0b6b-4aa9-8298-f7dc3221675a": 1,
            });
            setUnknownAnswer([
              "83fafbf3-f28c-4e9e-93e4-a3a3f97ee5e7",
              "147d9840-0b6b-4aa9-8298-f7dc3221675a",
              "00951171-419c-44d0-8474-c0a49486bb95",
            ]);
            setShowSummary(true);
            showToaster2();
          }}
        >
          Skip to summary
        </Button>
      </div>

      <div className=" flex flex-col gap-5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-5">
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
                <Input
                  onChange={(e) => setFirstInput(e.target.value)}
                  value={firstInput}
                  disabled={retryAttempts !== 0 || isSkipped}
                  className={
                    isCorrect && retryAttempts === 1
                      ? "hidden"
                      : retryAttempts !== 0
                      ? "border-red-300"
                      : isCorrect
                      ? " border-green-300"
                      : ""
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  ref={firstInputRef}
                  placeholder={isSkipped ? "Skipped" : ""}
                />
              </div>

              <div className="">
                <Label
                  className={
                    retryAttempts === 0 && !isSkipped ? "hidden" : "inline mb-2"
                  }
                >
                  Let's try again
                </Label>
                <Input
                  className={
                    retryAttempts === 0 && !isSkipped
                      ? "hidden"
                      : `inline ${
                          isCorrect || isSkipped || retryAttempts === 2
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
              </div>
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
      </div>
    </div>
  );
};

export default PracticeQuizUI;
