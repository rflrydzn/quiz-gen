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
      {/* Top: Progress Bar */}

      {isVerticalLayout && (
        <div className="w-full text-center">
          <Progress value={((currentIndex + 1) / roundQuestionLength) * 100} />
        </div>
      )}

      {/* Nav Buttons */}
      <div className="relative w-full max-w-2xl mx-auto flex items-center">
        {/* Left: Progress Mode */}
        <div className="absolute left-0 flex items-center gap-2">
          <Switch checked={progressMode} onCheckedChange={onProgressMode} />
          <Label>Progress Mode</Label>
        </div>

        {/* Center: Main Nav */}
        <div className="mx-auto flex justify-center gap-3">
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled>
                    <Plus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a Card: Coming soon</p>
                </TooltipContent>
              </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled>
                    <Plus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a Card: Coming soon</p>
                </TooltipContent>
              </Tooltip>
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

        {/* Right: Restart & Shuffle */}
        <div className="absolute right-0 flex gap-2">
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
    </div>
  );
}
