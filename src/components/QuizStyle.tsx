import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
const quizStyles = ["Exam Style", "Flashcard", "Practice Mode"];
export function QuizStyle({
  onSelectedStyle,
}: {
  onSelectedStyle: (style: string) => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState<string>("Exam Style");
  useEffect(() => {
    console.log("Selected style:", selectedStyle);
  }, [selectedStyle]);
  return (
    <div>
      <Label>Quiz Style</Label>
      <ToggleGroup type="single">
        {quizStyles.map((style) => (
          <ToggleGroupItem
            key={style}
            value={style}
            onClick={() => {
              setSelectedStyle(style);
              onSelectedStyle(style);
            }}
            aria-label={`Select ${style} style`}
            className="px-4 py-2 text-sm rounded-2xl"
            variant="outline"
          >
            {style}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export default QuizStyle;
