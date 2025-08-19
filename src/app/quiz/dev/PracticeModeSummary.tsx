import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@radix-ui/react-separator";
import { PracticeModeSummaryProps } from "@/types/types";

const PracticeModeSummary = ({
  knownAnswer,
  questions,
  onHandleContinue,
  percentageScore,
  summaryKnownCount,
}: PracticeModeSummaryProps) => {
  return (
    <div className="m-10">
      <div className="space-y-3 flex flex-col">
        <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">
          Going strong, you can do this.
        </h1>
        {/* <Button className="fixed right-0 top-0" onClick={onHandleContinue}>
          Learn remaining sets
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
};

export default PracticeModeSummary;
