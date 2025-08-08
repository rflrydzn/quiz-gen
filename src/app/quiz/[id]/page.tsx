"use client";

import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ExamQuizUI from "@/components/quiz/ExamQuizUI";
import QuizRenderer from "@/components/quizRenderer";
// import FlashcardUI from "@/components/quiz/FlashcardUI";
// import PracticeQuizUI from "@/components/quiz/PracticeQuizUI";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  console.log("id param:", id);
  if (!id) return <p>Missing ID</p>;

  return <QuizRenderer quizId={id} />;
}
