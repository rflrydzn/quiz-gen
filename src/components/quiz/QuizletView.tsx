import * as motion from "motion/react-client";

import React, { useEffect } from "react";
import { quiz, question, QuizletViewProps } from "@/types/types";

import { useState } from "react";

import { Progress } from "../ui/progress";

import QuizNavButtons from "./QuizNavButtons";

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
  onRestart,
  onShuffle,
  onBack,
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
        onRestart={onRestart}
        onBack={onBack}
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

      {progressMode && (
        <div className="flex justify-between w-full mb-8 ">
          <div className="flex justify-center items-center gap-2">
            <h4 className="scroll-m-20 text-xl  tracking-tight border-1 rounded-2xl p-1 px-4 ">
              {Object.keys(knownQuestions).length}
            </h4>
            <h4 className="scroll-m-20 text-xl  tracking-tight">Known</h4>
          </div>

          <div className="flex justify-center items-center gap-2">
            <h4 className="scroll-m-20 text-xl  tracking-tight">
              Still Learning
            </h4>
            <h4 className="scroll-m-20 text-xl  tracking-tight border-1 rounded-2xl p-1 px-4 ">
              {Object.keys(unknownQuestions).length}
            </h4>
          </div>
        </div>
      )}

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

      <QuizNavButtons
        progressMode={progressMode}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onProgressMode={onProgressMode}
        onPrev={prevCard}
        onNext={nextCard}
        onKnown={handleKnown}
        onUnknown={handleUnknown}
        onRestart={onRestart}
        onShuffle={onShuffle}
      />
    </div>
  );
}

export default QuizletView;
