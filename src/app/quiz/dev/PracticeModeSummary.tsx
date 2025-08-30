import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@radix-ui/react-separator";
import { PracticeModeSummaryProps } from "@/types/types";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { ChevronRight, RotateCcw } from "lucide-react";

const PracticeModeSummary = ({
  knownAnswer,
  questions,
  onHandleContinue,
  percentageScore,
  summaryKnownCount,
  onHandleReset,
}: PracticeModeSummaryProps) => {
  const confettiRef = useRef<ConfettiRef>(null);
  const firedRef = useRef(false);
  const masteredCount = Object.values(knownAnswer).filter(
    (v) => v === 2
  ).length;
  const remainingCount =
    Object.values(knownAnswer).length -
    masteredCount +
    questions.length -
    Object.keys(knownAnswer).length;
  const missing = questions.filter((q) => !(q.id in knownAnswer));
  useEffect(
    () => console.log("missing", missing),
    [knownAnswer, missing, questions]
  );

  const handleResetToaster = () => {
    toast(
      <div className="flex justify-center items-center">
        <RotateCcw className="mx-2" />
        You’ve mastered all questions.
      </div>,
      {
        duration: Infinity,
        action: {
          label: "Reset",
          onClick: onHandleReset,
        },
      }
    );
  };

  const handleContinueToaster = () => {
    toast(
      <div className="flex justify-center items-center">
        <ChevronRight />
        Study the remaining {remainingCount}{" "}
        {remainingCount === 1 ? "term" : "terms"}
      </div>,
      {
        duration: Infinity,
        action: {
          label: "Continue",
          onClick: onHandleContinue,
        },
      }
    );
  };
  const isPerfect = summaryKnownCount === questions.length * 2;
  useEffect(() => {
    if (isPerfect) confettiRef.current?.fire({});
    if (firedRef.current) return; // already fired once
    firedRef.current = true;
    if (isPerfect) {
      handleResetToaster();
    } else {
      handleContinueToaster();
    }
  }, [isPerfect]);

  return (
    <div className="m-20">
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full pointer-events-none"
        manualstart={true}
      />
      <div className="space-y-3 flex flex-col">
        <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">
          Going strong, you can do this.
        </h1>
        {/* <Button className="fixed right-0 top-0" onClick={onHandleReset}>
          Reset
        </Button> */}
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
        {(Object.values(knownAnswer).includes(0) || missing.length > 0) && (
          <div className="space-y-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Needs Review:
            </h4>
            {[
              ...questions.filter((q) => knownAnswer[q.id] === 0),
              ...missing,
            ].map((q) => (
              <div
                className="w-full flex border rounded-lg p-4 bg-background"
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
      </div>
    </div>
  );
};

export default PracticeModeSummary;
