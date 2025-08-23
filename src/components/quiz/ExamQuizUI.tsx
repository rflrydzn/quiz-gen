"use client";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useEffect, useState, useRef, use } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
type quiz = {
  id: string;
  user_id: string;
  created_at: string;
  difficulty: string;
  number_of_items: number;
  source_file_url?: string;
  source_text?: string;
  style: string;
  status: string;
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

const supabase = createClient();

export default function ExamQuizUI({
  quiz,
  questions,
}: {
  quiz: quiz;
  questions: question[];
}) {
  useEffect(() => {
    const loadSavedAnswers = async () => {
      const { data, error } = await supabase
        .from("quiz_answers")
        .select("*")
        .eq("quiz_id", quiz.id)
        .eq("user_id", quiz.user_id);

      if (error) {
        console.error("Error loading saved answers", error);
        return;
      }

      if (data && data.length > 0) {
        const savedUserAnswers: { [key: string]: string } = {};
        const savedFeedback: {
          [questionId: string]: { criteria: string; grade: number };
        } = {};

        let scoreSum = 0;

        for (const answer of data) {
          if (answer.submitted_text !== null) {
            savedUserAnswers[answer.question_id] = answer.submitted_text;
          } else if (answer.selected_choice !== null) {
            savedUserAnswers[answer.question_id] = answer.selected_choice;
          }

          if (answer.ai_feedback) {
            savedFeedback[answer.question_id] = {
              criteria: answer.ai_feedback,
              grade: answer.score ?? 0,
            };
          }

          scoreSum += answer.score ?? 0;
        }

        setUserAnswers(savedUserAnswers);
        setAIFeedback(savedFeedback);
        setScore({
          score: scoreSum,
          totalItems: quiz.number_of_items,
        });
        isSubmitted(true);
      }
    };

    loadSavedAnswers();
  }, [quiz.id, quiz.user_id]);

  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [correctAnswers, setCorrectAnswers] = useState<any>([]);
  const [quizStatus, setQuizStatus] = useState<string>("");
  const [submitted, isSubmitted] = useState(false);
  const [score, setScore] = useState<{
    score: number;
    totalItems: number;
  }>();
  const [aiFeedback, setAIFeedback] = useState<{
    [questionId: string]: {
      criteria: string;
      grade: number;
    };
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
    const newAIFeedback: {
      [questionId: string]: {
        criteria: string;
        grade: number;
      };
    } = {};

    isSubmitted(true);

    // Grade all questions
    const gradingPromises = questions.map(async (q) => {
      const userAnswer = userAnswers[q.id];

      if (q.type === "Open-Ended") {
        const res = await getAIGradedScore(q);
        calculatedScore += res?.grade || 0;

        newAIFeedback[q.id] = {
          criteria: res?.criteria,
          grade: res?.grade,
        };
      } else {
        if (userAnswer === q.answer) {
          calculatedScore += 1;
        }
      }
    });

    await Promise.all(gradingPromises);

    setAIFeedback(newAIFeedback);
    setScore({ score: calculatedScore, totalItems: quiz.number_of_items });

    // Now safe to save to DB
    const responses = questions.map((q) => ({
      quiz_id: quiz.id,
      question_id: q.id,
      user_id: quiz.user_id,
      selected_choice: q.type === "Multiple Choice" ? userAnswers[q.id] : null,
      submitted_text: q.type === "Open-Ended" ? userAnswers[q.id] : null,
      ai_feedback:
        q.type === "Open-Ended" ? newAIFeedback[q.id]?.criteria : null,
      score:
        q.type === "Open-Ended"
          ? newAIFeedback[q.id]?.grade
          : q.answer === userAnswers[q.id]
          ? 1
          : 0,
    }));

    // You can now POST `responses` to your backend
    const supabase = createClient();
    const { error } = await supabase.from("quiz_answers").insert(responses);
    if (error) {
      console.error("Error saving to db", error);
    } else {
      console.log("Saved to db");
    }

    const { error: statusError } = await supabase
      .from("quizzes")
      .update({ status: "taken" })
      .eq("id", quiz.id);
    if (statusError) {
      console.error("Error updating quiz status");
    } else {
      ("Marked quiz as taken");
    }
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
    setAIFeedback((prev) => ({
      ...prev,
      [q.id]: {
        criteria: data?.criteria,
        grade: data?.grade,
      },
    }));

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
        <div key={q.id} className=" p-4  mb-4">
          <p className="font-semibold">
            {index + 1}. {q.question}
          </p>
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
          {/* {q.choices && (
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
          )} */}

          {/* {q.type === "Open-Ended" && (
            <div className="grid w-full gap-3">
              <Textarea
                disabled={quiz.status === "taken"}
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
                {aiFeedback[q.id]?.grade ?? "Your answer will be graded by AI."}
              </p>
            </div>
          )} */}
        </div>
      ))}
      <Button onClick={handleSubmitScore} hidden={submitted}>
        Submit
      </Button>
    </div>
  );
}
