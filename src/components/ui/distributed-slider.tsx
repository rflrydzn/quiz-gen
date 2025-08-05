"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type DistributedSliderProps = {
  selectedTypes: string[]; // e.g. ["Multiple Choice", "True/False"]
  distribution: number[];
  setDistribution: (newDist: number[]) => void;
};

const typeColors: Record<string, string> = {
  "Multiple Choice": "#3b82f6", // blue
  "True/False": "#10b981", // green
  "Short Answer": "#f59e0b", // amber
  "Open-Ended": "#ef4444", // red
};

export function DistributedSlider({
  selectedTypes,
  distribution,
  setDistribution,
}: DistributedSliderProps) {
  const handleChange = (values: number[]) => {
    const full = [0, ...values, 100];
    const newDist = [];
    for (let i = 0; i < full.length - 1; i++) {
      newDist.push(full[i + 1] - full[i]);
    }
    setDistribution(newDist);
  };

  const thumbs = [];
  for (let i = 1; i < selectedTypes.length; i++) {
    thumbs.push(distribution.slice(0, i).reduce((a, b) => a + b, 0));
  }

  const segments = [];
  let offset = 0;
  for (let i = 0; i < selectedTypes.length; i++) {
    const width = distribution[i] ?? 0;
    const color = typeColors[selectedTypes[i]] ?? "#ccc";
    segments.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${offset}%`,
          width: `${width}%`,
          height: "100%",
          backgroundColor: color,
        }}
      />
    );
    offset += width;
  }

  return (
    <div className="relative w-full h-6 mt-4">
      {/* Colored segments */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-muted overflow-hidden">
        {segments}
      </div>

      {/* Slider */}
      <SliderPrimitive.Root
        value={thumbs}
        onValueChange={handleChange}
        min={0}
        max={100}
        step={1}
        className="relative flex w-full touch-none items-center select-none"
      >
        <SliderPrimitive.Track className="bg-transparent absolute h-1.5 w-full rounded-full" />
        {thumbs.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="z-10 border-primary bg-white ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}
