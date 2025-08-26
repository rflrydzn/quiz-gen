"use client";
import { TextareaWithLabel } from "@/components/TextareaWithText";
import QuestionType from "@/components/QuestionType";
import QuestionCount from "@/components/QuestionCount";
import { useEffect, useState } from "react";
import QuestionDifficultySelector from "@/components/QuizDifficultySelector";
import QuizStyle from "@/components/QuizStyle";
import QuizLanguage from "@/components/QuizLanguage";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { TabsDemo } from "@/components/ContextTabs";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type QuizOptions = {
  questionCounts: number;
  quizStyle?: string;
  questionTypes: string[];
  difficulty: string;
  fileUrl: string;
  textContent: string;
  distribution: { type: string; count: number }[];
  title: string;
};

const QuizSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ style: string }>();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quizoptions, setQuizOptions] = useState<QuizOptions>({
    title: "",
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

  // const downloadJSON = (data: any, filename: string) => {
  //   const blob = new Blob([JSON.stringify(data, null, 2)], {
  //     type: "application/json",
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = filename;
  //   link.click();
  //   URL.revokeObjectURL(url);
  // };

  const handleClick = async () => {
    try {
      console.log("Starting quiz generation...");
      console.log("options", quizoptions);
      setIsLoading(true);
      console.log("isLoading set to true");

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
          title: quizoptions.title || "Untitled Quiz",
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
      const exportData = {
        quiz,
        questions: formattedQuestions,
      };

      // Download as file
      // downloadJSON(exportData, `quiz-${quiz.id}.json`);

      router.push(`/quiz/${quiz.id}`);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      // This ensures isLoading is always set back to false
      console.log("Setting isLoading back to false");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (params?.style) {
      const styleMap: Record<string, string> = {
        flashcard: "Flashcard",
        practice: "Practice Mode",
        exam: "Exam Style",
      };

      setQuizOptions((prev) => ({
        ...prev,
        quizStyle: styleMap[params.style] || "Default",
      }));
    }
  }, [params?.style]);

  useEffect(() => {
    console.log("Quiz options updated:", quizoptions);
  }, [quizoptions]);

  useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);

  return (
    <div className=" flex flex-col gap-7 w-full max-w-5xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        Generate {quizoptions.quizStyle}
      </h1>
      <TabsDemo
        value={quizoptions.textContent}
        onChange={(newText) =>
          setQuizOptions({ ...quizoptions, textContent: newText })
        }
        onUpload={(url) => setQuizOptions({ ...quizoptions, fileUrl: url })}
      />

      {/* <QuizStyle
        onSelectedStyle={(style) =>
          setQuizOptions({ ...quizoptions, quizStyle: style })
        }
      /> */}
      <div>
        <Label className="scroll-m-20 text-xl font-semibold tracking-tight">
          Title
        </Label>
        <Input
          placeholder="Untitled Quiz"
          value={quizoptions.title}
          onChange={(e) =>
            setQuizOptions((prev) => ({ ...prev, title: e.target.value }))
          }
        ></Input>
      </div>

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
      <div className="flex w-full gap-7 items-center justify-center">
        <QuestionDifficultySelector
          onSelectedDifficulty={(difficulty) =>
            setQuizOptions({ ...quizoptions, difficulty: difficulty })
          }
        />

        <QuizLanguage />
      </div>
      <div className="flex justify-between py-10">
        <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-2xl">
          This product is enhanced by AI and may provide incorrect or
          problematic content. Do not enter personal data.
        </p>
        <Button onClick={handleClick} size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
    </div>
  );
};
export default QuizSettings;
