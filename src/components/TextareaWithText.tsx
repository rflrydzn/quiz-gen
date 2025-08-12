"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUp } from "lucide-react";
type Props = {
  value: string;
  onChange: (value: string) => void;
  onUpload?: (url: string) => void;
};
import { useRef, useState } from "react";
import { Button } from "./ui/button";
export function TextareaWithLabel({ value, onChange, onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string>("");

  const handleExampleClick = () => {
    const exampleText = `The solar system consists of the Sun and all celestial bodies bound to it by gravity,
including eight planets—Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and
Neptune—along with their moons, dwarf planets like Pluto, and countless
asteroids, comets, and meteoroids. The Sun, a massive star at the center, provides
the light and heat that sustain life on Earth and drives the dynamic processes of
the system. The planets orbit the Sun in elliptical paths, with the inner rocky
planets closer and the outer gas and ice giants farther away. Surrounding the solar
system is the Kuiper Belt and the distant Oort Cloud, regions filled with icy bodies
and remnants from its formation about 4.6 billion years ago.`;
    onChange(exampleText);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://rddizon.pythonanywhere.com/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("File upload failed");
      const data = await res.json();
      console.log("File uploaded successfully:", data);

      onUpload?.(data.url);
      console.log("File URL:", data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div className="grid w-full gap-3">
      <Label htmlFor="message">Content</Label>
      <Textarea
        id="message"
        placeholder="Type your message here."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="overflow-y-auto resize-none h-32"
      />
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
        id="file-upload"
      />
      <div className="flex items-center gap-2">
        <button onClick={() => inputRef.current?.click()}>
          <FileUp />
        </button>
        <Button variant="outline" onClick={handleExampleClick}>
          Example
        </Button>
      </div>

      {filename && <span className="text-sm text-gray-500">{filename}</span>}
    </div>
  );
}
