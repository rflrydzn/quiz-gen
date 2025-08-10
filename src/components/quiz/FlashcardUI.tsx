import React, { useEffect } from "react";
import { quiz, question } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import FlashcardVerticalScrollUI from "./FlashcardVertical";
import QuizletView from "./QuizletView";

export default function FlashcardUI({
  quiz,
  questions,
}: {
  quiz: quiz;
  questions: question[];
}) {
  const [verticalLayout, setVerticalLayout] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flashcard-layout");
      return saved ? JSON.parse(saved) : true;
    }

    return true;
  });

  useEffect(() => {
    localStorage.setItem("flashcard-layout", JSON.stringify(verticalLayout));
  }, [verticalLayout]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flashcard-index");
      return saved ? Math.min(JSON.parse(saved), questions.length - 1) : 0;
    }

    return 0;
  });

  useEffect(() => {
    localStorage.setItem("flashcard-index", JSON.stringify(currentIndex));
  }, [currentIndex]);
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  // Handle card view changes from vertical scroll
  const handleCardInView = (index: number) => {
    setCurrentIndex(index);
  };

  // Scroll to current card when switching to vertical layout
  useEffect(() => {
    if (verticalLayout && currentIndex > 0) {
      const cardElement = document.querySelector(
        `.card-container-${currentIndex}`
      );
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      }
    }
  }, [verticalLayout, currentIndex]);

  return (
    <>
      <div className="fixed right-0 m-4 flex items-center gap-2 z-10">
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
              onInView={() => handleCardInView(i)}
              isActive={i === currentIndex}
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
