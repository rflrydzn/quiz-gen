"use client";

import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ExamQuizUI from "@/components/quiz/ExamQuizUI";
// import FlashcardUI from "@/components/quiz/FlashcardUI";
// import PracticeQuizUI from "@/components/quiz/PracticeQuizUI";

const supabase = createClient();

const fetchQuizWithQuestions = async (quizId: string) => {
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();
  if (quizError) throw new Error(quizError.message);

  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId);
  if (qError) throw new Error(qError.message);

  return { quiz, questions };
};

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => fetchQuizWithQuestions(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{(error as Error).message}</p>;
  if (!data) return <p>Quiz not found</p>;

  const { quiz, questions } = data;

  // Render UI based on quiz.style
  switch (quiz.style) {
    case "Exam Style":
      return <ExamQuizUI quiz={quiz} questions={questions} />;
    // case "Flashcard":
    //   return <FlashcardUI quiz={quiz} questions={questions} />;
    // case "Practice Mode":
    //   return <PracticeQuizUI quiz={quiz} questions={questions} />;
    default:
      return <p>Unknown quiz style</p>;
  }
}
