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
export function TextareaWithLabel({ value, onChange, onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string>("");

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
      />
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
        id="file-upload"
      />
      <button onClick={() => inputRef.current?.click()}>
        <FileUp />
      </button>
      {filename && <span className="text-sm text-gray-500">{filename}</span>}
    </div>
  );
}
