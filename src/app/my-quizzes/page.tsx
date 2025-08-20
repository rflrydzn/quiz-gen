"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import EmptyQuizGraphic from "@/../public/empty-quiz.svg";
import Image from "next/image";
type Quiz = {
  id: string;
  style: string;
  difficulty: string;
  number_of_items: number;
  created_at: string;
  status: string;
};

export default function MyQuizzes() {
  const supabase = createClient();
  const router = useRouter();
  const fetchQuizzes = async () => {
    const {
      data: { user },
      error: useError,
    } = await supabase.auth.getUser();

    if (useError || !user)
      throw new Error(useError?.message || "User not logged in");

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  };
  const {
    data: quizzes = [],
    error,
    isLoading,
  } = useQuery<Quiz[] | undefined>({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
    retry: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (quizzes?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-screen">
        <Image
          src={EmptyQuizGraphic}
          alt="Empty quiz"
          width={500}
          height={500}
          className="text-black"
        />
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          No Quiz Found
        </h3>
        <Button>Generate</Button>
      </div>
    );
  if (error) return <p className="text-red-600">{(error as Error).message}</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Quizzes</h1>
      <div className="space-y-3">
        {quizzes?.map((quiz) => (
          <div
            key={quiz.id}
            className="border p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/quiz/${quiz.id}`)}
          >
            <div>
              <p className="font-semibold">{quiz.style}</p>
              <p className="text-sm text-gray-600">
                Difficulty: {quiz.difficulty} | {quiz.number_of_items} questions
              </p>
              <p className="text-xs text-gray-500">
                Created: {new Date(quiz.created_at).toLocaleString()}
              </p>
              <p>{quiz.status === "taken" ? "Taken" : "Not Taken"}</p>
            </div>
            <Button variant="outline">Open</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
