import React, { useEffect } from "react";
import { quiz, question } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import FlashcardVerticalScrollUI from "./FlashcardVertical";
import QuizletView from "./QuizletView";
import { object } from "motion/react-client";

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
  const [questionsForRound, setQuestionsForRound] = useState(questions);

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
  const [knownQuestions, setKnownQuestions] = useState<{
    [questionID: string]: string;
  }>({});

  const totalQuestions = questions.length;
  const [unknownQuestions, setUnknownQuestions] = useState<{
    [questionID: string]: string;
  }>({});
  useEffect(() => console.log("unknown questions: ", unknownQuestions));
  const [progressMode, setProgressMode] = useState(false);

  const [showSummary, setShowSummary] = useState(false);
  useEffect(() => {
    const knownCount = Object.keys(knownQuestions).length;
    const unknownCount = Object.keys(unknownQuestions).length;

    if (knownCount + unknownCount === questions.length && progressMode) {
      setShowSummary(true);
      console.log("showing summary");
    } else {
      setShowSummary(false);
    }
  }, [knownQuestions, unknownQuestions, progressMode, questions.length]);

  const handleRetake = () => {
    const retakeList = questions.filter((q) => unknownQuestions[q.id]);
    setQuestionsForRound(retakeList); // or however you're storing displayed questions
    setUnknownQuestions({}); // start fresh for the new round
    setCurrentIndex(0);
  };

  return (
    <>
      {!showSummary && (
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
      )}

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
          totalQuestions={totalQuestions}
          questions={questionsForRound}
          currentIndex={currentIndex}
          nextCard={nextCard}
          prevCard={prevCard}
          onProgressMode={() => setProgressMode(!progressMode)}
          onMarkKnown={(questionId) => {
            setKnownQuestions((prev) => ({
              ...prev,
              [questionId]: "known",
            }));
            setUnknownQuestions((prev) => {
              const copy = { ...prev };
              delete copy[questionId];
              return copy;
            });
          }}
          onMarkUnknown={(questionId) =>
            setUnknownQuestions((prev) => ({
              ...prev,
              [questionId]: "unknown",
            }))
          }
          showSummary={showSummary}
          unknownQuestions={unknownQuestions}
          knownQuestions={knownQuestions}
          progressMode={progressMode}
          onRetake={handleRetake}
        />
      )}
    </>
  );
}
