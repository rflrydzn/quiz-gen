"use client";

import { useState, useEffect } from "react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Props = {
  selectedQuestionTypes: string[];
  onDistributionChange?: (dist: { type: string; count: number }[]) => void;
  onCountChange?: (count: number) => void;
};

const QuestionCount = ({
  selectedQuestionTypes,
  onDistributionChange,
  onCountChange,
}: Props) => {
  const min = 0;
  const max = 15;
  const [count, setCount] = useState<number | "">("");
  const [dividers, setDividers] = useState<number[]>([]);

  // Update dividers when question types or count changes
  useEffect(() => {
    if (selectedQuestionTypes.length <= 1 || typeof count !== "number") {
      setDividers([]);
      return;
    }

    const n = selectedQuestionTypes.length;
    const newDividers = Array.from({ length: n - 1 }, (_, i) =>
      Math.round(((i + 1) * count) / n)
    );

    setDividers(newDividers);
  }, [selectedQuestionTypes, count]);

  // Calculate distribution per type
  const distribution: Record<string, number> = {};

  if (typeof count === "number") {
    if (selectedQuestionTypes.length === 1) {
      distribution[selectedQuestionTypes[0]] = count;
    } else if (selectedQuestionTypes.length > 1) {
      const positions = [0, ...dividers, count];
      selectedQuestionTypes.forEach((type, i) => {
        distribution[type] = positions[i + 1] - positions[i];
      });
    }
  }

  // Notify parent of distribution change
  useEffect(() => {
    const distributionArray = Object.entries(distribution).map(
      ([type, count]) => ({ type, count })
    );
    onDistributionChange?.(distributionArray);
  }, [distribution, onDistributionChange]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setCount("");
    } else if (/^\d+$/.test(val)) {
      const num = parseInt(val, 10);
      const clamped = Math.min(Math.max(num, min), max);
      setCount(clamped);
      onCountChange?.(clamped);
    }
  };

  // Slider change handler
  const handleSliderChange = ([val]: number[]) => {
    setCount(val);
    onCountChange?.(val);
  };

  // Distribution slider change
  const handleDividersChange = (newDivs: number[]) => {
    setDividers(newDivs);
  };

  const totalAssigned = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Total count input */}
      <div className="flex justify-between items-center">
        <Label
          htmlFor="question-count"
          className="scroll-m-20 text-xl font-semibold tracking-tight"
        >
          Total Questions
        </Label>
        <Input
          id="question-count"
          type="number"
          value={count}
          min={min}
          max={max}
          onChange={handleInputChange}
          className="w-20"
        />
      </div>

      {/* Total count slider */}
      <Slider
        value={[typeof count === "number" ? count : min]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={1}
        className="w-full"
        aria-label="Total question count"
      />

      {/* Distribution slider */}
      {selectedQuestionTypes.length > 1 && typeof count === "number" && (
        <>
          <Label>
            Distribute {count} across {selectedQuestionTypes.length} types
          </Label>
          <Slider
            value={dividers}
            onValueChange={handleDividersChange}
            min={0}
            max={count}
            step={1}
            minStepsBetweenThumbs={1}
            className="w-full"
            aria-label="Distribution slider"
          />
        </>
      )}

      {/* Per-type breakdown */}
      {selectedQuestionTypes.length > 0 && (
        <div className="space-y-2">
          {selectedQuestionTypes.map((type) => (
            <div
              key={type}
              className="flex justify-between items-center text-sm"
            >
              <div>{type}</div>
              <div>
                {Number.isFinite(distribution[type]) ? distribution[type] : 0}
              </div>
            </div>
          ))}
          {typeof count === "number" && totalAssigned !== count && (
            <p className="text-red-600 text-xs">
              Warning: total assigned ({totalAssigned}) does not equal total (
              {count})
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCount;
