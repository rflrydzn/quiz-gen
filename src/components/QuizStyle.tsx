import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
const quizStyles = ["Exam Style", "Flashcard", "Pratice Mode"];
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
  );
}

export default QuizStyle;
