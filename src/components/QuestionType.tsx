"use client";
import { useState, useEffect } from "react";
import { Toggle } from "./ui/toggle";
import { Label } from "./ui/label";
const QuestionType = ({
  onSelectedQuestionType,
}: {
  onSelectedQuestionType: (selected: string[]) => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const options = [
    "Multiple Choice",
    "True/False",
    "Fill in the Blank",
    "Open-Ended",
  ];

  useEffect(() => onSelectedQuestionType(selected), [selected]);
  return (
    <div>
      <Label>Question Type</Label>
      {options.map((option) => (
        <Toggle
          variant="outline"
          key={option}
          pressed={selected.includes(option)}
          onPressedChange={() => toggleOption(option)}
          className="px-4 py-2 text-sm rounded-2xl"
        >
          {option}
        </Toggle>
      ))}
    </div>
  );
};

export default QuestionType;
