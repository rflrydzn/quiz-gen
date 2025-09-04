import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TabsDemo } from "./ContextTabs";
import { useState } from "react";
import { question, QuizOptions } from "@/types/types";
import { Loader2Icon } from "lucide-react";

export function SheetDemo({
  onGenerate,
}: {
  onGenerate: (data: question[]) => void;
}) {
  const [quizoptions, setQuizOptions] = useState<QuizOptions>({
    questionCounts: 4,
    quizStyle: "Exam Style",
    questionTypes: ["Multiple Choice", "Fill in the Blank", "Open-Ended"],
    difficulty: "Easy",
    fileUrl: "",
    textContent: "",
    distribution: [
      { type: "Multiple Choice", count: 2 },
      { type: "Fill in the Blank", count: 1 },
      { type: "Open-Ended", count: 1 },
    ],
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: null,
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

      const data = await res.json();

      const order = [
        "Fill in the Blank",
        "Multiple Choice",
        "Multiple Choice",
        "Open-Ended",
      ];

      const sorted = data.sort((a: any, b: any) => {
        return order.indexOf(a.type) - order.indexOf(b.type);
      });

      onGenerate(sorted);
      console.log("sorted", sorted); // ✅ This should show now
      setOpen(false);
      setLoading(false);
    } catch (err) {
      console.log("Error generated quiz", err);
    }
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Live Demo</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Live Demo Settings</SheetTitle>
          <SheetDescription>
            Review and adjust the quiz settings for the live demo session.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <TabsDemo
            value={quizoptions.textContent}
            onChange={(newText) =>
              setQuizOptions({ ...quizoptions, textContent: newText })
            }
          />

          {/* Summary of predefined settings */}
          <div className="text-sm  space-y-2">
            <p className="font-semibold">Live Demo Predefined Settings:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-medium">Exam Style:</span> 1 Multiple
                Choice Question, 1 Open-Ended Question
              </li>
              <li>
                <span className="font-medium">Flashcard:</span> 1
                Fill-in-the-Blank
              </li>
              <li>
                <span className="font-medium">Practice Mode:</span> 1 Multiple
                Choice Question
              </li>
              <li>
                <span className="font-medium">Difficulty:</span> Easy
              </li>
              <li>
                <span className="font-medium">Language:</span> English
              </li>
            </ul>
          </div>
        </div>

        <SheetFooter>
          {/* <Button type="submit" onClick={handleClick}>
            Generate
          </Button> */}

          <Button onClick={handleClick} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Generate"
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
