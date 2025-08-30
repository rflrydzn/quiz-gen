"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import FlashcardBW from "@/../public/flashcard.svg";
import ExamModeIcon from "@/../public/exam.svg";
import PracticeModeIcon from "@/../public/practice.svg";
import AIicon from "@/../public/ai.svg";
import ManualIcon from "@/../public/manual.svg";
import { Card, CardTitle } from "./ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CreateQuiz = () => {
  const [step, setStep] = useState<"style" | "flashcard" | "practice" | "exam">(
    "style"
  );
  const router = useRouter();

  const handleSelectStyle = (style: string) => {
    if (style === "Flashcard") {
      setStep("flashcard");
    } else if (style === "Practice") {
      // Direct redirect for other styles
      setStep("practice");
    } else if (style === "Exam") {
      setStep("exam");
    }
  };

  const handleFlashcardChoice = (type: "ai" | "manual") => {
    if (type === "manual") router.push(`/create/flashcard`);
    else {
      router.push("/ai-generate/flashcard");
    }
  };

  const handlePracticeChoice = (type: "ai" | "manual") => {
    if (type === "manual") router.push(`/create/practice`);
    else {
      router.push("/ai-generate/practice");
    }
  };

  const handleExamChoice = (type: "ai" | "manual") => {
    if (type === "manual") router.push(`/create/exam`);
    else {
      router.push("/ai-generate/exam");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          New Quiz
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {step === "style" && (
          <>
            <DialogHeader>
              <DialogTitle>Select a quiz style</DialogTitle>
              <DialogDescription>
                Choose your preferred quiz format.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-2">
              <Card
                onClick={() => handleSelectStyle("Flashcard")}
                className="flex flex-col items-center justify-center p-4 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={FlashcardBW} alt="Flashcard Illustration" />

                <CardTitle className="text-center text-sm font-medium">
                  Flashcard
                </CardTitle>
              </Card>

              <Card
                onClick={() => handleSelectStyle("Practice")}
                className="flex flex-col items-center justify-center p-4 border hover:shadow-lg cursor-pointer transition"
              >
                <Image
                  src={PracticeModeIcon}
                  alt="Practice Mode Illustration"
                />
                <CardTitle className="text-center text-sm font-medium">
                  Practice
                </CardTitle>
              </Card>

              <Card
                onClick={() => handleSelectStyle("Exam")}
                className="flex flex-col items-center justify-center p-4 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={ExamModeIcon} alt="Exam Illustration" />
                <CardTitle className="text-center text-sm font-medium">
                  Exam
                </CardTitle>
              </Card>
            </div>
          </>
        )}

        {step === "flashcard" && (
          <>
            <DialogHeader className="flex flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("style")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>Flashcard Creation</DialogTitle>
                <DialogDescription>
                  Choose how you want to create your flashcards.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Card
                onClick={() => handleFlashcardChoice("ai")}
                className="flex flex-col items-center justify-center p-6 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={AIicon} alt="AI Illustration" />
                <CardTitle className="text-center text-sm font-medium">
                  AI Generated
                </CardTitle>
              </Card>

              <Card
                onClick={() => handleFlashcardChoice("manual")}
                className="flex flex-col items-center justify-center p-6 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={ManualIcon} alt="Manual Create Illustration" />
                <CardTitle className="text-center text-sm font-medium ">
                  Create Yourself
                </CardTitle>
              </Card>
            </div>
          </>
        )}

        {step === "practice" && (
          <>
            <DialogHeader className="flex flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("style")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>Flashcard Creation</DialogTitle>
                <DialogDescription>
                  Choose how you want to create your practice quiz.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Card
                onClick={() => handlePracticeChoice("ai")}
                className="flex flex-col items-center justify-center p-6 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={AIicon} alt="AI Illustration" />
                <CardTitle className="text-center text-sm font-medium">
                  AI Generated
                </CardTitle>
              </Card>

              <Card
                onClick={() => handlePracticeChoice("manual")}
                className="flex flex-col items-center justify-center p-6 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={ManualIcon} alt="Manual Create Illustration" />
                <CardTitle className="text-center text-sm font-medium ">
                  Create Yourself
                </CardTitle>
              </Card>
            </div>
          </>
        )}

        {step === "exam" && (
          <>
            <DialogHeader className="flex flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("style")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>Flashcard Creation</DialogTitle>
                <DialogDescription>
                  Choose how you want to create your practice quiz.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Card
                onClick={() => handleExamChoice("ai")}
                className="flex flex-col items-center justify-center p-6 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={AIicon} alt="AI Illustration" />
                <CardTitle className="text-center text-sm font-medium">
                  AI Generated
                </CardTitle>
              </Card>

              <Card
                onClick={() => handleExamChoice("manual")}
                className="flex flex-col items-center justify-center p-6 border hover:shadow-lg cursor-pointer transition"
              >
                <Image src={ManualIcon} alt="Manual Create Illustration" />
                <CardTitle className="text-center text-sm font-medium ">
                  Create Yourself
                </CardTitle>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuiz;
