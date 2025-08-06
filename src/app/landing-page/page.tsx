"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  return (
    <div className="flex">
      {/* Left section */}
      <div className="w-1/2 items-center justify-center flex h-screen">
        <div className="space-y-3">
          <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight text-balance">
            QuizGenie
          </h1>
          <p className="max-w-xl text-muted-foreground lg:text-xl">
            Create quizzes from your notes, PDFs, or text. Choose flashcards,
            practice mode, or exam-style quizzes — all generated instantly to
            help you study smarter.
          </p>
          <div className="flex space-x-3">
            <Button
              className="flex items-center gap-2"
              onClick={() => router.push("/login")}
            >
              <ArrowRight className="h-4 w-4" />
              Get Started
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              Try Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="relative bg-[#f4f4f5] w-1/2 flex items-center justify-center h-screen">
        {/* Single grouped design */}
        <div className="relative w-[480px] h-[520px]">
          {/* Exam style card (middle) */}
          <div className="border-1 absolute top-20 left-20 bg-white  w-[300px] h-[400px] rounded-lg p-4 space-y-3">
            <div className="h-6 bg-slate-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div>
            <div className="h-8 bg-slate-200 rounded w-1/3 mt-4 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
          </div>

          {/* Flashcard style (top-right) */}
          <div className="border-1 absolute top-0 right-0 bg-white w-[150px] h-[150px] rounded-lg p-3 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/3 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-2/6 animate-pulse"></div>
          </div>

          {/* Practice mode style (bottom) */}
          <div className="border-1 absolute bottom-0 left-0 bg-white w-[250px] h-[170px] rounded-lg p-3 space-y-3 ">
            {/* Question line */}
            <div className="h-4 bg-slate-300 rounded w-6/6 animate-pulse"></div>
            <div className="h-4 bg-slate-300 rounded w-3/6 animate-pulse"></div>
            {/* 2x2 choices */}
            <div className="grid grid-cols-2 gap-2 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="mt-2 h-8 bg-slate-200 rounded w-full"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Margin guide lines */}
        <div className="absolute left-16 top-0 w-px h-full bg-slate-200"></div>
        <div className="absolute right-16 top-0 w-px h-full bg-slate-200"></div>
        <div className="absolute top-16 left-0 w-full h-px bg-slate-200"></div>
        <div className="absolute bottom-16 left-0 w-full h-px bg-slate-200"></div>
      </div>
    </div>
  );
};

export default LandingPage;
