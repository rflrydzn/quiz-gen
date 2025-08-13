import React, { useEffect } from "react";
import { quiz, question } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import FlashcardVerticalScrollUI from "./FlashcardVertical";
import QuizletView from "./QuizletView";
import QuizNavButtons from "./QuizNavButtons";
import { useSidebar } from "@/components/ui/sidebar";
import Summary from "./Summary";
export default function FlashcardUI({
  quiz,
  questions,
}: {
  quiz: quiz;
  questions: question[];
}) {
  const { state, isMobile } = useSidebar();
  const sidebarWidth = isMobile
    ? 0 // mobile sidebar is a sheet, nav stays full width
    : state === "expanded"
    ? 256 // 16rem
    : 48; // 3rem icon width
  const [verticalLayout, setVerticalLayout] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flashcard-layout");
      return saved ? JSON.parse(saved) : true;
    }

    return true;
  });
  const [questionsForRound, setQuestionsForRound] = useState(questions);

  const [progressMode, setProgressMode] = useState(false);
  const [knownQuestions, setKnownQuestions] = useState<{
    [questionID: string]: string;
  }>({});
  const [unknownQuestions, setUnknownQuestions] = useState<{
    [questionID: string]: string;
  }>({});
  const totalQuestions = questions.length;
  const [showSummary, setShowSummary] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flashcard-index");
      return saved ? Math.min(JSON.parse(saved), questions.length - 1) : 0;
    }

    return 0;
  });
  const currentQuestion = questions[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const handleBackToLastQuestion = () => {
    const lastIndex = questionsForRound.length - 1;
    const lastQuestion = questionsForRound[lastIndex];
    setKnownQuestions((prev) => {
      const copy = { ...prev };
      delete copy[lastQuestion.id];
      return copy;
    });

    setUnknownQuestions((prev) => {
      const copy = { ...prev };
      delete copy[lastQuestion.id];
      return copy;
    });
    setCurrentIndex(lastIndex);
    setShowSummary(false);
  };

  // Handle card view changes from vertical scroll
  const handleCardInView = (index: number) => {
    setCurrentIndex(index);
  };

  const handleShuffle = () => {
    function shuffleArray<T>(array: T[]): T[] {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    setQuestionsForRound((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    // Optionally, reset known/unknown and answeredInRound if you want a fresh start
    // setKnownQuestions({});
    // setUnknownQuestions({});
    // setAnsweredInRound(new Set());
  };
  const handleRetake = () => {
    const retakeList = questions.filter((q) => unknownQuestions[q.id]);
    setQuestionsForRound(retakeList); // or however you're storing displayed questions
    setUnknownQuestions({}); // start fresh for the new round
    setCurrentIndex(0);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setKnownQuestions({});
    setUnknownQuestions({});
    setShowSummary(false);
    setQuestionsForRound(questions);
    console.log("restart triggered");
  };

  useEffect(() => {
    localStorage.setItem("flashcard-layout", JSON.stringify(verticalLayout));
  }, [verticalLayout]);

  useEffect(() => {
    localStorage.setItem("flashcard-index", JSON.stringify(currentIndex));
  }, [currentIndex]);

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

  useEffect(
    () =>
      console.log({
        "unknown questions: ": unknownQuestions,
        "known questions:": knownQuestions,
      }),
    [knownQuestions, unknownQuestions]
  );

  // Scroll to current card when switching to vertical layout
  useEffect(() => {
    if (verticalLayout && currentIndex > 0) {
      const cardElement = document.querySelector(
        `.card-container-${currentIndex}`
      );
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [verticalLayout, currentIndex]);

  if (showSummary)
    return (
      <Summary
        unknownQuestions={unknownQuestions}
        knownQuestions={knownQuestions}
        questions={questions}
        onRetake={handleRetake}
        totalQuestions={totalQuestions}
        onRestart={handleRestart}
        onBack={handleBackToLastQuestion}
      />
    );

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
        <div className="relative mx-auto my-24 max-w-lg w-full pb-24">
          {questionsForRound.map((q, i) => (
            <FlashcardVerticalScrollUI
              i={i}
              front={q.front}
              back={q.back}
              key={q.id}
              onInView={() => handleCardInView(i)}
              isActive={i === currentIndex}
              showSummary={showSummary}
              questions={questions}
              unknownQuestions={unknownQuestions}
              knownQuestions={knownQuestions}
              onRestart={handleBackToLastQuestion}
              onBack={handleBackToLastQuestion}
              onRetake={handleRetake}
              totalQuestions={totalQuestions}
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
          onRestart={handleRestart}
          onShuffle={handleShuffle}
          onBack={handleBackToLastQuestion}
        />
      )}

      {verticalLayout && (
        <div
          className="fixed bottom-4 z-50 flex justify-center items-center transition-all duration-200"
          style={{
            left: `${sidebarWidth}px`,
            width: `calc(100% - ${sidebarWidth}px)`,
          }}
        >
          <div className="w-full max-w-lg bg-white/20 backdrop-blur-lg shadow-md border border-white/30 p-5 rounded-3xl">
            <QuizNavButtons
              progressMode={progressMode}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              onProgressMode={() => setProgressMode(!progressMode)}
              onNext={nextCard}
              onPrev={prevCard}
              onShuffle={handleShuffle}
              onRestart={handleRestart}
              onKnown={() => {
                setKnownQuestions((prev) => ({
                  ...prev,
                  [currentQuestion.id]: "known",
                }));
                setUnknownQuestions((prev) => {
                  const copy = { ...prev };
                  delete copy[currentQuestion.id];
                  return copy;
                });

                nextCard();
              }}
              onUnknown={() => {
                setUnknownQuestions((prev) => ({
                  ...prev,
                  [currentQuestion.id]: "unknown",
                }));
                nextCard();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
