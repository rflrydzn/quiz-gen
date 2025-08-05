"use client";
import { useState } from "react";
import { Label } from "./ui/label";

const QuizLanguage = () => {
  const languages = ["🇺🇸 English NIGGA", "Spanish", "French", "German"];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div className="flex flex-col  space-x-4">
      <Label htmlFor="language-select">Language</Label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="border rounded p-2"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QuizLanguage;
