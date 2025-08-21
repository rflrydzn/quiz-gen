import { UploadCloudIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onUpload?: (url: string) => void;
};

export function TabsDemo({ value, onChange, onUpload }: Props) {
  const [text, setText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxChars = 10000;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      const url = URL.createObjectURL(file); // temporary preview URL
      onUpload(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onUpload) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };
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
    setText(exampleText);
  };
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Paste text</TabsTrigger>
          <TabsTrigger value="password">Upload file</TabsTrigger>
        </TabsList>

        {/* Paste text tab */}
        <TabsContent value="account" className="w-full">
          <Textarea
            placeholder="Put your notes here. We'll do the rest."
            className="overflow-y-auto resize-none w-full h-52"
            value={value}
            maxLength={maxChars}
            onChange={(e) => {
              onChange(e.target.value);
              setText(e.target.value);
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-muted-foreground text-sm">
              {text.length} / {maxChars} characters
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleExampleClick()}
            >
              Example
            </Button>
          </div>
        </TabsContent>

        {/* Upload file tab */}
        <TabsContent value="password" className="w-full h-52">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-52 p-4 cursor-pointer transition-colors ${
              dragActive
                ? "border-primary bg-muted/50"
                : "border-muted-foreground/25"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloudIcon className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag & drop your file here, or click to browse
            </p>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
