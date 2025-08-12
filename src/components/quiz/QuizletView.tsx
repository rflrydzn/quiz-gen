import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import React, { useEffect } from "react";
import { quiz, question, QuizletViewProps } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import FlashcardVerticalScrollUI from "./FlashcardVertical";
import { Progress } from "../ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Summary from "./Summary";
function QuizletView({
  questions,
  currentIndex,
  nextCard,
  prevCard,
  onProgressMode,
  onMarkKnown,
  onMarkUnknown,
  showSummary,
  unknownQuestions,
  knownQuestions,
  progressMode,
  onRetake,
  totalQuestions,
}: QuizletViewProps) {
  const [flipped, setFlipped] = useState(false);
  const currentQuestion = questions[currentIndex];
  const [showSummaryQuizlet, setShowSummaryQuizlet] = useState(false);
  const handleKnown = () => {
    onMarkKnown(currentQuestion.id);
    nextCard();
  };

  const handleUnknown = () => {
    onMarkUnknown(currentQuestion.id);
    nextCard();
  };
  // Reset flip when changing cards
  useEffect(() => {
    setFlipped(false);
  }, [currentIndex]);
  useEffect(() => setShowSummaryQuizlet(showSummary), [showSummary]);
  if (showSummaryQuizlet)
    return (
      <Summary
        unknownQuestions={unknownQuestions}
        knownQuestions={knownQuestions}
        questions={questions}
        onRetake={onRetake}
        totalQuestions={totalQuestions}
      />
    );
  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="w-full mb-8 text-center">
        <span className="block text-sm text-gray-600 mb-2">
          {currentIndex + 1} of {questions.length}
        </span>
        <Progress value={((currentIndex + 1) / questions.length) * 100} />
      </div>
      {/* Main card */}
      <div className="w-full max-w-2xl h-96 mb-10">
        <motion.div
          className="relative w-full h-full cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setFlipped(!flipped)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute w-full h-full top-0 left-0 flex justify-center items-center rounded-2xl bg-white shadow-lg border-2 border-gray-200"
            style={{ backfaceVisibility: "hidden" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          >
            <div className="flex flex-col items-center justify-center p-10 text-center h-full w-full">
              <div className="text-2xl font-medium text-gray-800 leading-relaxed mb-5 max-w-lg">
                {currentQuestion.front}
              </div>
              <div className="text-sm text-gray-400 opacity-80 italic mt-auto">
                Click to reveal answer
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute w-full h-full top-0 left-0 flex justify-center items-center rounded-2xl bg-slate-50 shadow-lg border-2 border-gray-200"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            animate={{ rotateY: flipped ? 0 : -180 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          >
            <div className="flex flex-col items-center justify-center p-10 text-center h-full w-full">
              <div className="text-2xl font-medium text-gray-800 leading-relaxed mb-5 max-w-lg">
                {currentQuestion.back}
              </div>
              <div className="text-sm text-gray-400 opacity-80 italic mt-auto">
                Click to show question
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Navigation */}

      {progressMode ? (
        <div className="flex justify-between items-center max-w-md gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleKnown}>
                <Check />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as known</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a Card</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleUnknown}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as unknown</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="flex justify-between items-center max-w-md gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={prevCard} disabled={currentIndex === 0}>
                <ChevronLeft />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a Card</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={nextCard}
                disabled={currentIndex == questions.length - 1}
              >
                <ChevronRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Next</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center justify-center m-2">
          <Switch
            checked={progressMode}
            onCheckedChange={() => {
              onProgressMode();
            }}
          />
          Track Progress
        </div>
        <div className="flex justify-center items-center">
          <RotateCcw />
        </div>
      </div>
    </div>
  );
}

export default QuizletView;
