"use client";
import { TextareaWithLabel } from "./TextareaWithText";
import QuestionType from "./QuestionType";
import QuestionCount from "./QuestionCount";
import { useEffect, useState } from "react";
import QuestionDifficultySelector from "./QuizDifficultySelector";
import QuizStyle from "./QuizStyle";
import QuizLanguage from "./QuizLanguage";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

type QuizOptions = {
  questionCounts: number;
  quizStyle?: string;
  questionTypes: string[];
  difficulty: string;
  fileUrl: string;
  textContent: string;
  distribution: { type: string; count: number }[];
};
const QuizSettings = ({ onGenerate }: { onGenerate: (data: any) => void }) => {
  const [user, setUser] = useState<any>(null);
  const [quizoptions, setQuizOptions] = useState<QuizOptions>({
    questionCounts: 5,
    quizStyle: "",
    questionTypes: [],
    difficulty: "medium",
    fileUrl: "",
    textContent: "",
    distribution: [{ type: "Multiple Choice", count: 10 }],
  });
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log("Fetched user:", user);
    };
    fetchUser();
  }, []);
  const handleClick = async () => {
    const res = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileUrl: quizoptions.fileUrl,
        textContent: quizoptions.textContent,
        quizStyle: quizoptions.quizStyle,
        difficulty: quizoptions.difficulty,
        numberOfItems: quizoptions.questionCounts,
        types: quizoptions.distribution.map((item) => ({
          type: item.type,
          count: item.count,
        })),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error generating quiz:", error);
      return;
    }

    console.log("Quiz generated successfully");
    const data = await res.json();
    console.log("Quiz data:", data);
    onGenerate(data);

    // 2. Save quiz metadata in Supabase
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user?.id,
        style: quizoptions.quizStyle,
        difficulty: quizoptions.difficulty,
        number_of_items: quizoptions.questionCounts,
        source_file_url: quizoptions.fileUrl || null,
        source_text: quizoptions.textContent || null,
      })
      .select("id")
      .single();

    if (quizError) {
      console.error("Error saving quiz:", quizError);
      return;
    }

    console.log("Quiz saved successfully:", quiz);

    // 3. Format and save questions using quiz.id
    const formattedQuestions = data.map((q: any) => ({
      quiz_id: quiz.id, // use Supabase quiz ID, not q.id
      type: q.type,
      question: q.question ?? null,
      difficulty: q.difficulty ?? null,
      choices: q.choices ?? [],
      answer: q.answer ?? null,
      hint: q.hint ?? null,
      explanation: q.explanation ?? null,
      front: q.front ?? null,
      back: q.back ?? null,
    }));

    console.log("Formatted questions:", formattedQuestions);

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(formattedQuestions);

    if (questionsError) {
      console.error("Error saving questions:", questionsError);
      return;
    }

    console.log("Questions saved successfully");
  };
  useEffect(() => {
    console.log("Quiz options updated:", quizoptions);
  }, [quizoptions]);
  return (
    <div className="border-2 p-5 gap-5 flex flex-col">
      <TextareaWithLabel
        onUpload={(url) => setQuizOptions({ ...quizoptions, fileUrl: url })}
        value={quizoptions.textContent}
        onChange={(newText) =>
          setQuizOptions({ ...quizoptions, textContent: newText })
        }
      />
      <QuizStyle
        onSelectedStyle={(style) =>
          setQuizOptions({ ...quizoptions, quizStyle: style })
        }
      />
      <QuestionType
        quizStyle={quizoptions.quizStyle!}
        onSelectedQuestionType={(selected) =>
          setQuizOptions({
            ...quizoptions,
            questionTypes: selected,
          })
        }
      />
      <QuestionCount
        onDistributionChange={(distribution) => {
          // Prevent unnecessary updates to avoid infinite loop
          const current = quizoptions.distribution;

          const isSame =
            distribution.length === current.length &&
            distribution.every((item, i) => {
              return (
                item.type === current[i].type && item.count === current[i].count
              );
            });

          if (!isSame) {
            setQuizOptions({ ...quizoptions, distribution });
          }
        }}
        selectedQuestionTypes={quizoptions.questionTypes}
        onCountChange={(count) =>
          setQuizOptions({ ...quizoptions, questionCounts: count })
        }
      />
      <QuestionDifficultySelector
        onSelectedDifficulty={(difficulty) =>
          setQuizOptions({ ...quizoptions, difficulty: difficulty })
        }
      />

      <QuizLanguage />
      <Button onClick={handleClick}>Generate</Button>
    </div>
  );
};
export default QuizSettings;
