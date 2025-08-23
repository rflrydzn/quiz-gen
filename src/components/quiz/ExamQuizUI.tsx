"use client";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useEffect, useState, useRef, use } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
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
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isTaken, setIsTaken] = useState(false);

  useEffect(() => {
    const loadSavedAnswers = async () => {
      const { data, error } = await supabase
        .from("quiz_answers")
        .select("*")
        .eq("quiz_id", quiz.id)
        .eq("user_id", quiz.user_id);

      const { data: quizdata, error: quizerror } = await supabase
        .from("quizzes")
        .select("status")
        .eq("id", quiz.id)
        .single();
      console.log("data", quizdata);
      if (quizdata?.status === "taken") setIsTaken(true);
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
  const [correctAnswers, setCorrectAnswers] = useState<{
    [questionId: string]: string;
  }>({});
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
    // const answers = questions.map((q) => q.answer);
    const answers = questions.map((q) =>
      setCorrectAnswers((prev) => ({ ...prev, [q.id]: q.answer }))
    );
    // setCorrectAnswers(prev => ({...prev, [q.]})));
    console.log("corectt", answers);
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

      // Choices (Multiple Choice & True/False)
      selected_choice:
        q.type === "Multiple Choice" || q.type === "True/False"
          ? userAnswers[q.id]
          : null,

      // Text answers (Open-Ended & Fill in the Blank)
      submitted_text:
        q.type === "Open-Ended" || q.type === "Fill in the Blank"
          ? userAnswers[q.id]
          : null,

      ai_feedback:
        q.type === "Open-Ended" ? newAIFeedback[q.id]?.criteria : null,

      score:
        q.type === "Open-Ended"
          ? newAIFeedback[q.id]?.grade
          : userAnswers[q.id] === q.answer
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

  const scrollToNextUnanswered = () => {
    const unansweredIndex = questions.findIndex((q) => !userAnswers[q.id]);
    if (unansweredIndex !== -1 && questionRefs.current[unansweredIndex]) {
      questionRefs.current[unansweredIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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
    <div className="flex flex-col min-h-screen">
      <div className="grid grid-cols-3 items-center border-b p-4">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Solar system practice exam
          </h3>
          {score?.score}
        </div>
        <div className="flex justify-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {Object.keys(userAnswers).length} / {questions.length} &middot;
            20:00
          </h3>
        </div>
        <div className="flex justify-end">
          <Button variant="ghost">
            <X />
          </Button>
        </div>
      </div>

      <div className="mx-32 my-10 ">
        {questions.map((q: any, index: number) => (
          <div key={q.id} className=" p-4  mb-6">
            <p className="font-semibold mb-3">
              {index + 1}. {q.question}
            </p>

            {/* Multiple Choice */}
            {q.type === "Multiple Choice" && q.choices.length > 0 && (
              <RadioGroup
                disabled={isTaken}
                value={userAnswers[q.id] || ""}
                onValueChange={(value) =>
                  setUserAnswers((prev) => ({
                    ...prev,
                    [q.id]: value,
                  }))
                }
                className="space-y-2"
              >
                {q.choices.map((choice: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <RadioGroupItem value={choice} id={choice} />
                    <Label
                      htmlFor={choice}
                      className={`${
                        isTaken && choice === correctAnswers[q.id]
                          ? "text-green-500"
                          : ""
                      }`}
                    >
                      {choice}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* True / False */}
            {q.type === "True/False" && (
              <RadioGroup
                disabled={isTaken}
                value={userAnswers[q.id] || ""}
                onValueChange={(value) =>
                  setUserAnswers((prev) => ({
                    ...prev,
                    [q.id]: value,
                  }))
                }
                className="space-y-2"
              >
                {["True", "False"].map((val) => {
                  const choiceId = `${q.id}-${val}`;
                  const userAnswer = userAnswers[q.id];
                  const correctAnswer = correctAnswers[q.id];
                  let labelClass = "";

                  if (isTaken) {
                    if (val === correctAnswer && userAnswer === correctAnswer) {
                      labelClass = "text-green-600 font-semibold"; // correct selected
                    } else if (
                      val === userAnswer &&
                      userAnswer !== correctAnswer
                    ) {
                      labelClass = "text-red-600 font-semibold"; // wrong selected
                    }
                  }

                  return (
                    <div key={val} className="flex items-center gap-3">
                      <RadioGroupItem value={val} id={choiceId} />
                      <Label htmlFor={choiceId} className={labelClass}>
                        {val}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}
            {/* Fill in the Blank */}
            {q.type === "Fill in the Blank" && (
              <div className="mt-3">
                <Textarea
                  disabled={isTaken}
                  placeholder="Enter your answer..."
                  value={userAnswers[q.id] || ""}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  className={`w-full ${
                    submitted && userAnswers[q.id] === correctAnswers[q.id]
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                />

                {/* Show correct answer if user's answer is wrong */}
                {submitted &&
                  userAnswers[q.id] &&
                  userAnswers[q.id] !== correctAnswers[q.id] && (
                    <div className="mt-2">
                      <Label>Correct answer</Label>
                      <Textarea
                        value={correctAnswers[q.id]}
                        disabled
                        className="border-green-500"
                      />
                    </div>
                  )}
              </div>
            )}
            {/* Open-Ended */}
            {q.type === "Open-Ended" && (
              <div className="mt-3">
                <Textarea
                  disabled={isTaken}
                  placeholder="Write your detailed answer..."
                  value={userAnswers[q.id] || ""}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {aiFeedback[q.id]?.grade ??
                    "Your answer will be graded by AI."}
                </p>

                {submitted &&
                  userAnswers[q.id] &&
                  userAnswers[q.id] !== correctAnswers[q.id] && (
                    <div className="mt-2">
                      <Label>Correct answer</Label>
                      <Textarea
                        value={correctAnswers[q.id]}
                        disabled
                        className="border-green-500"
                      />
                    </div>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 justify-between flex w-full  border-t bg-background p-4">
        <Button onClick={handleSubmitScore} size="lg">
          Submit test
        </Button>
        <Button
          onClick={scrollToNextUnanswered}
          hidden={submitted}
          variant="outline"
          size="lg"
        >
          Next unanswered question
        </Button>
      </div>
    </div>
  );
}
