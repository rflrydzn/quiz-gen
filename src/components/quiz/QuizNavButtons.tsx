import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Plus,
  Check,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type QuizletControlsProps = {
  progressMode: boolean;
  currentIndex: number;
  totalQuestions: number;
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
  onProgressMode,
  onPrev,
  onNext,
  onKnown,
  onUnknown,
  onRestart,
  onShuffle,
}: QuizletControlsProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto flex items-center">
      {/* Left corner: Progress Mode Switch */}
      <div className="absolute left-0 flex items-center gap-2">
        <Switch checked={progressMode} onCheckedChange={onProgressMode} />
        <Label>Progress Mode</Label>
      </div>

      {/* Center: Main Nav */}
      <div className="mx-auto flex justify-center gap-2">
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

      {/* Right corner: Restart & Shuffle */}
      <div className="absolute right-0 flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onRestart}
              className="cursor-pointer"
              variant="ghost"
            >
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
              className="cursor-pointer"
              onClick={onShuffle}
              disabled={currentIndex >= 1}
              variant="ghost"
            >
              <Shuffle className={currentIndex >= 1 ? "text-muted" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentIndex >= 1 ? "Restart to shuffle" : "Shuffle Cards"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
