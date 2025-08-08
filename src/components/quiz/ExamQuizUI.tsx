"use client";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
type quiz = {
  id: string;
  user_id: string;
  created_at: string;
  difficulty: string;
  number_of_items: number;
  source_file_url?: string;
  source_text?: string;
  style: string;
};

type question = {
  id: string;
  quiz_id: string;
  answer: string;
  back: string;
  choices: string[];
  created_at: string;
  difficulty: string;
  explanation: string;
  front: string;
  hint: string;
  question: string;
  type: string;
};
export default function ExamQuizUI({
  quiz,
  questions,
}: {
  quiz: quiz;
  questions: question[];
}) {
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [correctAnswers, setCorrectAnswers] = useState<any>([]);
  const [submitted, isSubmitted] = useState(false);
  const [score, setScore] = useState<{
    score: number;
    totalItems: number;
  }>();
  const [aiFeedback, setAIFeedback] = useState<{
    [questionId: string]: string;
  }>({});

  const inputRef = useRef<HTMLInputElement>(null);
  console.log("quiz types", quiz);
  console.log("questions types", questions);
  useEffect(() => {
    const answers = questions.map((q) => q.answer);
    setCorrectAnswers(answers);
  }, [questions]);

  useEffect(() => console.log("user answ", userAnswers), [userAnswers]);

  console.log("answ", correctAnswers);

  const handleSubmitScore = async () => {
    let calculatedScore = 0;

    const aiGrading = questions.map(async (q) => {
      isSubmitted(true);
      if (q.type === "Open-Ended") {
        const res = await getAIGradedScore(q);
        calculatedScore += res?.grade;
      } else {
        if (userAnswers[q.id] === q.answer) {
          calculatedScore += 1;
        }
      }
    });

    await Promise.all(aiGrading);

    setScore({ score: calculatedScore, totalItems: quiz.number_of_items });
  };

  const getAIGradedScore = async (q: any) => {
    console.log();
    const res = await fetch("/api/grade-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: q.question,
        userAnswer: userAnswers[q.id],
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      console.error("Error generating quiz:", error);
      return;
    }
    const data = await res.json();
    setAIFeedback((prev) => ({ ...prev, [q.id]: data?.criteria }));
    console.log("dataaa", data);
    return data;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">{quiz.style} Quiz</h2>{" "}
        <h2>
          {score?.score}/{score?.totalItems}
        </h2>
      </div>

      {questions.map((q: any, index: number) => (
        <div key={q.id} className="border p-4 rounded-lg mb-4">
          <p className="font-semibold">
            {index + 1}. {q.question}
          </p>

          {q.choices && (
            <ToggleGroup
              type="single"
              variant="outline"
              value={userAnswers[q.id] || ""}
              onValueChange={(value) => {
                if (value) {
                  setUserAnswers((prev) => ({ ...prev, [q.id]: value }));
                }
              }}
              className="grid grid-cols-2 gap-4"
            >
              {q.choices.map((choice: string, index: number) => (
                <ToggleGroupItem
                  value={choice}
                  key={index}
                  disabled={submitted && userAnswers[q.id] !== choice}
                  className={cn(
                    submitted && choice === q.answer
                      ? "bg-gray-300 text-accent-foreground " // highlight correct
                      : "",
                    submitted &&
                      userAnswers[q.id] === choice &&
                      choice !== q.answer
                      ? "" // show wrong selection
                      : ""
                  )}
                >
                  {choice}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}

          {q.type === "Open-Ended" && (
            <div className="grid w-full gap-3">
              <Textarea
                placeholder="Type your message here."
                id={q.id}
                value={userAnswers[q.id] || ""}
                onChange={(e) =>
                  setUserAnswers((prev) => ({
                    ...prev,
                    [q.id]: e.target.value,
                  }))
                }
              />
              <p className="text-muted-foreground text-sm">
                {aiFeedback[q.id] ?? "Your answer will be graded by AI."}
              </p>
            </div>
          )}
        </div>
      ))}
      <Button onClick={handleSubmitScore}>Submit</Button>
    </div>
  );
}
