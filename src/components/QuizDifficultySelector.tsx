import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
const difficulties = ["Easy", "Medium", "Hard"];
export function QuestionDifficultySelector({
  onSelectedDifficulty,
}: {
  onSelectedDifficulty: (difficulty: string) => void;
}) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<string>("Medium");
  useEffect(() => {
    console.log("Selected difficulty:", selectedDifficulty);
  }, [selectedDifficulty]);
  return (
    <div className="w-1/2 space-y-2">
      <Label className="scroll-m-20 text-xl font-semibold tracking-tight">
        Difficulty
      </Label>
      <ToggleGroup
        type="single"
        value={selectedDifficulty}
        onValueChange={(value) => {
          if (value) {
            setSelectedDifficulty(value);
            onSelectedDifficulty(value);
          }
        }}
      >
        {difficulties.map((difficulty) => (
          <ToggleGroupItem
            key={difficulty}
            value={difficulty}
            aria-label={`Select ${difficulty} difficulty`}
            className="px-4 py-2 text-sm rounded-2xl"
            variant="outline"
          >
            {difficulty}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export default QuestionDifficultySelector;
