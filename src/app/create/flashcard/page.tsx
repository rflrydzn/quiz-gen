"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, X, Plus, Save, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

type Card = {
  id: number;
  front: string;
  back: string;
  index: number;
  hint: string;
};

const FlashcardCreator = () => {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [title, setTitle] = useState("Untitled Study Set");
  // const [description, setDescription] = useState("");
  const [cards, setCards] = useState<
    { id: number; front: string; back: string; index: number; hint: string }[]
  >([
    { id: 1, front: "", back: "", index: 1, hint: "No hint provided" },
    { id: 2, front: "", back: "", index: 2, hint: "No hint provided" },
  ]);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const dragCounter = useRef(0);

  const addCard = () => {
    const newId = Math.max(...cards.map((c) => c.id)) + 1;
    setCards([
      ...cards,
      {
        id: newId,
        front: "",
        back: "",
        index: cards.length + 1,
        hint: "No hint provided",
      },
    ]);
  };

  const removeCard = (id: number) => {
    if (cards.length <= 2) return; // Minimum 2 cards
    const newCards = cards
      .filter((card) => card.id !== id)
      .map((card, index) => ({ ...card, index: index + 1 }));
    setCards(newCards);
  };

  const updateCard = (id: number, field: keyof Card, value: string) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
    dragCounter.current = 0;
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverIndex(null);

    if (!draggedCard || draggedCard.index === targetIndex) {
      setDraggedCard(null);
      return;
    }

    const newCards = [...cards];
    const draggedIndex = newCards.findIndex(
      (card) => card.id === draggedCard.id
    );
    const targetIdx = newCards.findIndex((card) => card.index === targetIndex);

    // Remove dragged card and insert at new position
    const [movedCard] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIdx, 0, movedCard);

    // Update indices
    const reindexedCards = newCards.map((card, index) => ({
      ...card,
      index: index + 1,
    }));

    setCards(reindexedCards);
    setDraggedCard(null);
  };

  const saveStudySet = async () => {
    const studySet = {
      title,
      // description,
      cards: cards.filter((card) => card.front.trim() && card.back.trim()),
      createdAt: new Date().toISOString(),
    };

    if (studySet.cards.length === 0) {
      toast.warning("Please complete at least one card.", {
        position: "bottom-right",
        richColors: false, // turn off auto dark styling
        style: {
          background: "#FFD93D", // nice yellow
          color: "#000000", // black text for readability
        },
      });
      return;
    }

    // Here you would typically send to your backend
    console.log("Saving study set:", studySet);
    console.log("count", studySet.cards.length);

    // For demo, save to localStorage
    const savedSets = JSON.parse(localStorage.getItem("studySets") || "[]");
    savedSets.push(studySet);
    localStorage.setItem("studySets", JSON.stringify(savedSets));

    alert(`Study set "${title}" saved with ${studySet.cards.length} cards!`);

    // 2. Save quiz metadata in Supabase
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user?.id,
        style: "Flashcard",
        difficulty: "Easy",
        number_of_items: studySet.cards.length,
        source_file_url: null,
        source_text: null,
        title: title,
      })
      .select("id")
      .single();

    if (quizError) {
      console.error("Error saving quiz:", quizError);
      return;
    }

    console.log("Quiz saved successfully:", quiz);

    // 3. Format and save questions using quiz.id
    const formattedQuestions = studySet.cards.map((q: any) => ({
      quiz_id: quiz.id, // use Supabase quiz ID, not q.id
      type: "Flashcard",
      question: null,
      difficulty: null,
      choices: [],
      answer: null,
      hint: q.hint ?? null,
      explanation: null,
      front: q.front ?? null,
      back: q.back ?? null,
    }));

    console.log("Formatted questions:", formattedQuestions);

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(formattedQuestions);

    if (questionsError) {
      console.error("Error saving questions:", questionsError);
      return;
    }

    console.log("Questions saved successfully");

    router.push(`/quiz/${quiz.id}`);
  };

  const resetAll = () => {
    setTitle("Untitled Study Set");
    // setDescription("");
    setCards([
      { id: 1, front: "", back: "", index: 1, hint: "No hint provided" },
    ]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log("Fetched user:", user);
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen mx-28 my-14">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12  rounded-xl flex items-center justify-center bg-primary">
              <Plus className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold ">Create Study Set</h1>
          </div>

          {/* Study Set Info */}
          <div className="space-y-4 mb-8">
            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold border-2 focus:border-blue-500 transition-colors"
                placeholder="Enter a title for your study set"
              />
            </div>
            {/* <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium mb-2 block"
              >
                Description (optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none border-2 focus:border-blue-500 transition-colors"
                placeholder="Add a description..."
                rows={2}
              />
            </div> */}
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-8">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`transition-all duration-200 ${
                draggedCard?.id === card.id
                  ? "opacity-50 scale-95"
                  : dragOverIndex === card.index
                  ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50"
                  : "hover:shadow-lg"
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              onDragEnter={(e) => handleDragEnter(e, card.index)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, card.index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Drag Handle & Index */}
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                      {card.index}
                    </div>
                    <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors">
                      <GripVertical size={16} className="text-gray-400" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Front */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-700">
                        Front
                      </Label>
                      <Textarea
                        value={card.front}
                        onChange={(e) =>
                          updateCard(card.id, "front", e.target.value)
                        }
                        placeholder="Enter the front of your flashcard"
                        className="min-h-[100px] resize-none border-2 focus:border-blue-500 transition-colors"
                        rows={4}
                      />
                    </div>

                    {/* Back */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-700">
                        Back
                      </Label>
                      <Textarea
                        value={card.back}
                        onChange={(e) =>
                          updateCard(card.id, "back", e.target.value)
                        }
                        placeholder="Enter the back of your flashcard"
                        className="min-h-[100px] resize-none border-2 focus:border-green-500 transition-colors"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCard(card.id)}
                    disabled={cards.length <= 2}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Button
            onClick={addCard}
            variant="outline"
            className="w-full sm:w-auto border-2 border-dashed  transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Card
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={resetAll}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <RotateCcw size={18} className="mr-2" />
              Reset
            </Button>
            <Button
              onClick={saveStudySet}
              className="flex-1 sm:flex-none  transition-all duration-200"
            >
              <Save size={18} className="mr-2" />
              Save Study Set
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total cards: {cards.length}</span>
            <span>
              Completed cards:{" "}
              {
                cards.filter((card) => card.front.trim() && card.back.trim())
                  .length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCreator;
