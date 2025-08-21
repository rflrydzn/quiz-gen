"use client";
import { useState, useEffect } from "react";
import { Toggle } from "./ui/toggle";
import { Label } from "./ui/label";

const allowedTypesByStyle: Record<string, string[]> = {
  "Exam Style": [
    "Multiple Choice",
    "True/False",
    "Open-Ended",
    "Fill in the Blank",
  ],
  Flashcard: [
    "Term and Definition",
    "Definition and Term",
    "Fill in the Blank",
    "True/False",
  ],
  "Practice Mode": [
    "Multiple Choice",
    "True/False",
    "Open-Ended",
    "Fill in the Blank",
  ], // same as Exam
};

const QuestionType = ({
  quizStyle,
  onSelectedQuestionType,
}: {
  quizStyle: string;
  onSelectedQuestionType: (selected: string[]) => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const allowedTypes = allowedTypesByStyle[quizStyle] || [];

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
    "Term and Definition",
    "Definition and Term",
  ];

  // When quizStyle changes, drop any types that are not allowed
  useEffect(() => {
    setSelected((prev) => prev.filter((type) => allowedTypes.includes(type)));
  }, [quizStyle]);

  useEffect(() => onSelectedQuestionType(selected), [selected]);

  return (
    <div className="w-full flex flex-col gap-2">
      <Label className="scroll-m-20 text-xl font-semibold tracking-tight">
        Question Type
      </Label>
      <div className="flex gap-3 flex-wrap">
        {options.map((option) => (
          <Toggle
            variant="outline"
            key={option}
            pressed={selected.includes(option)}
            onPressedChange={() => toggleOption(option)}
            className="px-4 py-2 text-sm rounded-2xl"
            disabled={!allowedTypes.includes(option)}
          >
            {option}
          </Toggle>
        ))}
      </div>
    </div>
  );
};

export default QuestionType;
