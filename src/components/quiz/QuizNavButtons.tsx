import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Lightbulb,
  Plus,
  Check,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "../ui/progress";
type QuizletControlsProps = {
  progressMode: boolean;
  currentIndex: number;
  totalQuestions: number;
  roundQuestionLength: number;
  isVerticalLayout?: boolean;
  hint: string;
  onProgressMode: () => void;
  onPrev: () => void;
  onNext: () => void;
  onKnown: () => void;
  onUnknown: () => void;
  onRestart: () => void;
  onShuffle: () => void;
};

export default function QuizNavButtons({
  progressMode,
  currentIndex,
  totalQuestions,
  roundQuestionLength,
  isVerticalLayout,
  hint,
  onProgressMode,
  onPrev,
  onNext,
  onKnown,
  onUnknown,
  onRestart,
  onShuffle,
}: QuizletControlsProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Nav Bar */}
      <div className="w-full max-w-2xl mx-auto">
        {/* md+: Single row justify-between */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Progress Mode */}
          <div className="flex items-center gap-2">
            <Switch checked={progressMode} onCheckedChange={onProgressMode} />
            <Label className="text-sm">Progress Mode</Label>
          </div>

          {/* Center: Main Nav */}
          <div className="flex justify-center items-center gap-3">
            {progressMode ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={onKnown}>
                      <Check />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as known</p>
                  </TooltipContent>
                </Tooltip>

                <span className="flex items-center justify-center text-sm font-medium text-gray-600">
                  {currentIndex + 1}/{roundQuestionLength}
                </span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={onUnknown}>
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as unknown</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={onPrev} disabled={currentIndex === 0}>
                      <ChevronLeft />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Previous</p>
                  </TooltipContent>
                </Tooltip>

                <span className="flex items-center justify-center text-sm font-medium text-gray-600">
                  {currentIndex + 1}/{totalQuestions}
                </span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onNext}
                      disabled={currentIndex === totalQuestions - 1}
                    >
                      <ChevronRight />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>

          {/* Right: Hint & Restart & Shuffle */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">
                  <Lightbulb />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hint}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onRestart} variant="ghost">
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restart</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onShuffle}
                  disabled={currentIndex >= 1}
                  variant="ghost"
                >
                  <Shuffle className={currentIndex >= 1 ? "text-muted" : ""} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {currentIndex >= 1 ? "Restart to shuffle" : "Shuffle Cards"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* mobile: stacked layout */}
        <div className="flex flex-col gap-3 md:hidden">
          {/* Row 1: Main Nav */}
          <div className="flex justify-center items-center gap-3">
            {progressMode ? (
              <>
                <Button onClick={onKnown}>
                  <Check />
                </Button>
                <span className="text-sm font-medium text-gray-600">
                  {currentIndex + 1}/{roundQuestionLength}
                </span>
                <Button onClick={onUnknown}>
                  <X />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onPrev} disabled={currentIndex === 0}>
                  <ChevronLeft />
                </Button>
                <span className="text-sm font-medium text-gray-600">
                  {currentIndex + 1}/{totalQuestions}
                </span>
                <Button
                  onClick={onNext}
                  disabled={currentIndex === totalQuestions - 1}
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>

          {/* Row 2: Progress Mode + Hint/Reset/Shuffle */}
          <div className="flex justify-between items-center">
            {/* Left: Progress Mode */}
            <div className="flex items-center gap-2">
              <Switch checked={progressMode} onCheckedChange={onProgressMode} />
              <Label className="text-sm">Progress Mode</Label>
            </div>

            {/* Right: Hint/Reset/Shuffle */}
            <div className="flex items-center gap-2">
              <Button variant="ghost">
                <Lightbulb />
              </Button>
              <Button onClick={onRestart} variant="ghost">
                <RotateCcw />
              </Button>
              <Button
                onClick={onShuffle}
                disabled={currentIndex >= 1}
                variant="ghost"
              >
                <Shuffle className={currentIndex >= 1 ? "text-muted" : ""} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar below Nav */}
      <div className="w-full max-w-2xl mx-auto text-center">
        <Progress value={((currentIndex + 1) / totalQuestions) * 100} />
      </div>
    </div>
  );
}
