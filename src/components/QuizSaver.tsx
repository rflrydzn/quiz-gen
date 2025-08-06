// components/QuizSaver.tsx
"use client";
import { Button } from "./ui/button";
import { createClient } from "@/app/utils/supabase/client";

const QuizSaver = ({
  user,
  quizOptions,
  quizData,
}: {
  user: any;
  quizOptions: any;
  quizData: any[];
}) => {
  const supabase = createClient();

  const handleSave = async () => {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    // Insert quiz first
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user.id,
        style: quizOptions.quizStyle,
        difficulty: quizOptions.difficulty.toLowerCase(),
        number_of_items: quizOptions.questionCounts,
        file_url: quizOptions.fileUrl || null,
        text_content: quizOptions.textContent || null,
      })
      .select()
      .single();

    if (quizError) {
      console.error("Error saving quiz:", quizError);
      return;
    }

    console.log("Quiz saved:", quiz);

    // Insert questions
    const formattedQuestions = quizData.map((q: any) => ({
      quiz_id: quiz.id,
      type: q.type,
      question: q.question ?? null,
      difficulty: q.difficulty ?? null,
      choices: q.choices ?? null,
      answer: q.answer ?? null,
      hint: q.hint ?? null,
      explanation: q.explanation ?? null,
      front: q.front ?? null,
      back: q.back ?? null,
    }));

    const { error: questionError } = await supabase
      .from("questions")
      .insert(formattedQuestions);

    if (questionError) {
      console.error("Error saving questions:", questionError);
      return;
    }

    console.log("Questions saved successfully");
  };

  return <Button onClick={handleSave}>Save to Database</Button>;
};

export default QuizSaver;
