// components/QuizGenerator.tsx
"use client";
import { Button } from "./ui/button";

const QuizGenerator = ({
  quizOptions,
  onGenerated,
}: {
  quizOptions: any;
  onGenerated: (quizData: any) => void;
}) => {
  const handleGenerate = async () => {
    const res = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizOptions),
    });

    if (!res.ok) {
      console.error("Error generating quiz:", await res.json());
      return;
    }

    const data = await res.json();
    console.log("Quiz generated:", data);
    onGenerated(data);
  };

  return <Button onClick={handleGenerate}>Generate Quiz</Button>;
};

export default QuizGenerator;
