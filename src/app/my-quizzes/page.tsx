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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Quiz = {
  id: string;
  style: string;
  difficulty: string;
  number_of_items: number;
  created_at: string;
  status: string;
  title: string;
};

export default function MyQuizzes() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");

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

  const filterSearch = quizzes.filter((quiz) =>
    quiz.title?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
  );

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
    <div className="my-16 mx-36">
      <div className="justify-between flex ">
        <h1 className="text-2xl font-bold mb-4">My Quizzes</h1>
        <CreateQuiz />
      </div>
      <div className="relative flex items-center justify-center mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search quizzes..."
          className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filterSearch.length > 0 ? (
          filterSearch.map((quiz) => (
            <div
              key={quiz.id}
              className="group relative border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              onClick={() => router.push(`/quiz/${quiz.id}`)}
            >
              {/* Delete button with tooltip */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-200 hover:text-red-600 transition-colors rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuiz.mutate(quiz.id);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete Quiz</span>
                  </Button>
                  {/* Tooltip */}
                  {/* <div className="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Delete quiz
                  <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div> */}
                </div>
              </div>

              {/* Quiz content */}
              <div className="p-4 pr-12">
                {/* Quiz title - static for now */}
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {quiz.title || "Untitled Quiz"}
                </h3>

                {/* Quiz metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Style: {quiz.style}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {quiz.number_of_items} questions
                  </span>
                </div>

                {/* Status and date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.status === "taken"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {quiz.status === "taken" ? "✓ Completed" : "○ Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(quiz.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 ">
            <Image
              src={EmptyQuizGraphic}
              alt="Empty quiz"
              width={500}
              height={500}
            />
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              No Quiz Found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
