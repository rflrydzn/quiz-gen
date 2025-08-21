"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EmptyQuizGraphic from "@/../public/empty-quiz.svg";
import Image from "next/image";
import { Trash } from "lucide-react";
import CreateQuiz from "@/components/CreateQuiz";

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
  const queryClient = useQueryClient();

  // Fetch quizzes
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
  } = useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
    retry: false,
  });

  // Mutation for delete
  const deleteQuiz = useMutation({
    mutationFn: async (quizId: string) => {
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", quizId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // invalidate cache → refetch quizzes
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
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
        />
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          No Quiz Found
        </h3>
        <CreateQuiz />
      </div>
    );

  if (error) return <p className="text-red-600">{(error as Error).message}</p>;

  return (
    <div className="p-6">
      <div className="justify-between flex items-center">
        <h1 className="text-2xl font-bold mb-4">My Quizzes</h1>
        <CreateQuiz />
      </div>

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/quiz/${quiz.id}`);
                }}
              >
                Open
              </Button>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening quiz
                  deleteQuiz.mutate(quiz.id);
                }}
              >
                <Trash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
