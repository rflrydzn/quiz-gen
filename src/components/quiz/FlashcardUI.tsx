import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import React, { useEffect } from "react";
import { quiz, question } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FlashcardVerticalScrollUI from "./FlashcardVertical";
import { Progress } from "../ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuizletView from "./QuizletView";
export default function FlashcardUI({
  quiz,
  questions,
}: {
  quiz: quiz;
  questions: question[];
}) {
  const [verticalLayout, setVerticalLayout] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };
  return (
    <>
      <div className="fixed right-0 m-4 flex items-center gap-2">
        <Label htmlFor="flashcard-layout">
          {verticalLayout ? "Vertical" : "Horizontal"}
        </Label>
        <Switch
          id="flashcard-layout"
          checked={verticalLayout}
          onCheckedChange={() => setVerticalLayout(!verticalLayout)}
        />
      </div>

      {verticalLayout ? (
        <div className="mx-auto my-24 max-w-lg w-full pb-24">
          {questions.map((q, i) => (
            <FlashcardVerticalScrollUI
              i={i}
              front={q.front}
              back={q.back}
              key={q.id}
            />
          ))}
        </div>
      ) : (
        <QuizletView
          questions={questions}
          currentIndex={currentIndex}
          nextCard={nextCard}
          prevCard={prevCard}
        />
      )}
    </>
  );
}
