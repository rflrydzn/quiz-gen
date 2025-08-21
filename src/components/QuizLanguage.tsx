"use client";
import { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QuizLanguage = () => {
  // language list with flag + value
  const languages = [
    { label: "🇺🇸 English", value: "english" },
    { label: "🇵🇭 Filipino", value: "filipino" },
    { label: "🇪🇸 Spanish", value: "spanish" },
    { label: "🇫🇷 French", value: "french" },
    { label: "🇩🇪 German", value: "german" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);

  return (
    <div className="flex flex-col w-1/2 gap-2">
      <Label
        htmlFor="language-select"
        className="scroll-m-20 text-xl font-semibold tracking-tight"
      >
        Language
      </Label>

      <Select
        value={selectedLanguage}
        onValueChange={setSelectedLanguage}
        disabled
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuizLanguage;
