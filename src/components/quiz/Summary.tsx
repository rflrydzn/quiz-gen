import { question } from "@/types/types";
import * as React from "react";
import { Pie, PieChart, Label } from "recharts";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "../ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { useRef, useEffect } from "react";
interface SummaryProps {
  unknownQuestions: { [questionId: string]: string };
  knownQuestions: { [questionId: string]: string };
  questions: question[];
  onRetake: () => void;
  onRestart: () => void;
  totalQuestions: number;
  onBack: () => void;
}

const Summary: React.FC<SummaryProps> = ({
  unknownQuestions,
  knownQuestions,
  questions,
  onRetake,
  onRestart,
  onBack,
  totalQuestions,
}) => {
  const total = totalQuestions;
  const unknownCount = Object.keys(unknownQuestions).length;
  const knownCount = Object.keys(knownQuestions).length;
  const confettiRef = useRef<ConfettiRef>(null);

  const knownPercentage = Math.floor((knownCount / total) * 100);
  const isPerfect = unknownCount === 0;

  const chartData = [
    { name: "Known", value: knownCount, fill: "var(--color-primary)" },
    { name: "Unknown", value: unknownCount, fill: "var(--muted)" },
    {
      name: "Remaining",
      value: total - (knownCount + unknownCount),
      fill: "var(--color-muted)",
    },
  ];

  const chartConfig: ChartConfig = {
    value: { label: "Count" },
  };

  const getScoreHeading = (score: number) => {
    if (score === 100) return "Perfect! You’ve mastered everything 🎯";
    if (score >= 80) return "Amazing! You’re almost there 🚀";
    if (score >= 60) return "Great progress! Keep pushing 💪";
    if (score >= 40) return "You’re getting the hang of it 📈";
    if (score >= 20) return "Good start! Let’s build on it 🌱";
    if (score > 0) return "Just getting started — keep going! 🔥";
    return "Let’s begin your learning journey 📚";
  };

  useEffect(() => {
    if (unknownCount === 0) {
      confettiRef.current?.fire({});
    }
  }, [unknownCount]);

  return (
    <div className="h-4/6  p-10 ">
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full pointer-events-none"
        manualstart={true}
      />
      <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">
        {getScoreHeading(knownPercentage)}
      </h1>
      <div className="flex p-5 h-full ">
        {/* LEFT SIDE */}
        <div className="w-1/2 p-5 flex flex-col justify-between ">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            How you’re doing
          </h2>
          <div>
            <div className="flex items-stretch h-full ">
              <ChartContainer
                config={chartConfig}
                className=" aspect-square w-3/6 "
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {`${knownPercentage}%`}
                              </tspan>
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="w-3/4 flex flex-col justify-between p-5">
                <div className="flex justify-between border rounded-3xl px-4 py-2">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Know
                  </h4>
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {knownCount}
                  </h4>
                </div>
                <div className="flex justify-between border rounded-3xl px-4 py-2">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Still Learning
                  </h4>
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {unknownCount}
                  </h4>
                </div>
                <div className="flex justify-between border rounded-3xl px-4 py-2">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Terms left
                  </h4>
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    0
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button variant="link" className="" onClick={onBack}>
              <ChevronLeft />
              Back to last question
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 p-5 flex flex-col justify-between ">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Next Steps
          </h2>
          <div className="flex flex-col  h-52 gap-7">
            <Button className="w-full flex-1 rounded-4xl text-lg">
              Practice with Questions
            </Button>
            <Button
              className="w-full flex-1 rounded-4xl text-lg"
              variant="secondary"
              onClick={!isPerfect ? onRetake : onRestart}
            >
              {isPerfect
                ? "Restart Flashcards"
                : `Focus on ${unknownCount} still learning card`}
            </Button>
          </div>
          <div>
            {!isPerfect && (
              <Button variant="link" className="" onClick={onRestart}>
                <RotateCcw />
                Restart Flashcards
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
