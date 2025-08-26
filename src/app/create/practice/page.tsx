"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  X,
  Plus,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  question: string;
  type: string;
  choices: string[];
  answer: string;
  hint: string;
  explanation: string;
  index: number;
}

const PracticeModeCreator = () => {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("Untitled Practice Set");
  // const [description, setDescription] = useState("");
  const [user, setUser] = useState<any>(null);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: generateId(),
      question: "",
      type: "multiple-choice",
      choices: ["", "", "", ""],
      answer: "",
      hint: "",
      explanation: "",
      index: 1,
    },
    {
      id: generateId(),
      question: "",
      type: "multiple-choice",
      choices: ["", "", "", ""],
      answer: "",
      hint: "",
      explanation: "",
      index: 2,
    },
  ]);
  const [draggedQuestion, setDraggedQuestion] = useState<Question | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const dragCounter = useRef(0);

  function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  const addQuestion = () => {
    const newId = generateId();
    setQuestions([
      ...questions,
      {
        id: newId,
        question: "",
        type: "multiple-choice",
        choices: ["", "", "", ""],
        answer: "",
        hint: "",
        explanation: "",
        index: questions.length + 1,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 2) return;
    const newQuestions = questions
      .filter((q) => q.id !== id)
      .map((q, index) => ({ ...q, index: index + 1 }));
    setQuestions(newQuestions);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateChoice = (id: string, choiceIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              choices: q.choices.map((choice, index) =>
                index === choiceIndex ? value : choice
              ),
            }
          : q
      )
    );
  };

  const addChoice = (id: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id && q.choices.length < 6
          ? {
              ...q,
              choices: [...q.choices, ""],
            }
          : q
      )
    );
  };

  const removeChoice = (id: string, choiceIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id && q.choices.length > 2
          ? {
              ...q,
              choices: q.choices.filter((_, index) => index !== choiceIndex),
              answer: q.answer === q.choices[choiceIndex] ? "" : q.answer, // Clear answer if it was the removed choice
            }
          : q
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, question: Question) => {
    setDraggedQuestion(question);
    e.dataTransfer.effectAllowed = "move";
    dragCounter.current = 0;
  };

  const handleDragEnter = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverIndex(null);

    if (!draggedQuestion || draggedQuestion.index === targetIndex) {
      setDraggedQuestion(null);
      return;
    }

    const newQuestions = [...questions];
    const draggedIndex = newQuestions.findIndex(
      (q) => q.id === draggedQuestion.id
    );
    const targetIdx = newQuestions.findIndex((q) => q.index === targetIndex);

    const [movedQuestion] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIdx, 0, movedQuestion);

    const reindexedQuestions = newQuestions.map((q, index) => ({
      ...q,
      index: index + 1,
    }));

    setQuestions(reindexedQuestions);
    setDraggedQuestion(null);
  };

  const isQuestionValid = (question: Question): boolean => {
    if (!question.question.trim() || !question.answer.trim()) return false;
    if (question.type === "multiple-choice") {
      const validChoices = question.choices.filter((c) => c.trim());
      return validChoices.length >= 2 && validChoices.includes(question.answer);
    }
    return true;
  };

  const createPracticeSet = async () => {
    const validQuestions = questions.filter(isQuestionValid);

    if (validQuestions.length === 0) {
      alert("Please complete at least one question with all required fields.");
      return;
    }

    const practiceSet = {
      title,
      // description,
      questions: validQuestions.map((q) => ({
        question: q.question,
        type: q.type,
        choices: q.choices.filter((c) => c.trim()),
        answer: q.answer,
        hint: q.hint,
        explanation: q.explanation,
      })),
      createdAt: new Date().toISOString(),
    };

    console.log("Creating practice set:", practiceSet);

    // Save to localStorage for demo
    const savedSets = JSON.parse(localStorage.getItem("practiceSets") || "[]");
    savedSets.push(practiceSet);
    localStorage.setItem("practiceSets", JSON.stringify(savedSets));

    alert(
      `Practice set "${title}" created with ${validQuestions.length} questions!`
    );

    // 2. Save quiz metadata in Supabase
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user?.id,
        style: "Practice Mode",
        difficulty: "Easy",
        number_of_items: practiceSet.questions.length,
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
    const formattedQuestions = practiceSet.questions.map((q: any) => ({
      quiz_id: quiz.id, // use Supabase quiz ID, not q.id
      type: q.type,
      question: q.question ?? null,
      difficulty: null,
      choices: q.choices,
      answer: q.answer,
      hint: q.hint ?? null,
      explanation: q.explanation ?? null,
      front: null,
      back: null,
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
    setTitle("Untitled Practice Set");
    // setDescription("");
    setQuestions([
      {
        id: generateId(),
        question: "",
        type: "multiple-choice",
        choices: ["", "", "", ""],
        answer: "",
        hint: "",
        explanation: "",
        index: 1,
      },
      {
        id: generateId(),
        question: "",
        type: "multiple-choice",
        choices: ["", "", "", ""],
        answer: "",
        hint: "",
        explanation: "",
        index: 2,
      },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Practice Set
            </h1>
          </div>

          {/* Practice Set Info */}
          <div className="space-y-4 mb-8">
            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold border-2 focus:border-purple-500 transition-colors"
                placeholder="Enter a title for your practice set"
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
                className="resize-none border-2 focus:border-purple-500 transition-colors"
                placeholder="Add a description..."
                rows={2}
              />
            </div> */}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((question) => (
            <Card
              key={question.id}
              className={`transition-all duration-200 ${
                draggedQuestion?.id === question.id
                  ? "opacity-50 scale-95"
                  : dragOverIndex === question.index
                  ? "ring-2 ring-purple-500 ring-opacity-50 bg-purple-50"
                  : "hover:shadow-lg"
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, question)}
              onDragEnter={(e) => handleDragEnter(e, question.index)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, question.index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Drag Handle & Index */}
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        isQuestionValid(question)
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isQuestionValid(question) ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        question.index
                      )}
                    </div>
                    <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors">
                      <GripVertical size={16} className="text-gray-400" />
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 space-y-4">
                    {/* Question Text */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-700">
                        Question *
                      </Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "question",
                            e.target.value
                          )
                        }
                        placeholder="Enter your question"
                        className="min-h-[80px] resize-none border-2 focus:border-purple-500 transition-colors"
                        rows={3}
                      />
                    </div>

                    {/* Question Type */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-700">
                        Question Type
                      </Label>
                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          updateQuestion(question.id, "type", value)
                        }
                      >
                        <SelectTrigger className="border-2 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="fill-in-blank">
                            Fill in the Blank
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Choices (for multiple choice) */}
                    {question.type === "multiple-choice" && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Choices * (Click on a choice to set as correct answer)
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.choices.map((choice, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={choice}
                                onChange={(e) =>
                                  updateChoice(
                                    question.id,
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder={`Choice ${index + 1}`}
                                className={`border-2 transition-colors ${
                                  question.answer === choice && choice.trim()
                                    ? "border-green-500 bg-green-50"
                                    : "focus:border-purple-500"
                                }`}
                                onClick={() => {
                                  if (choice.trim()) {
                                    updateQuestion(
                                      question.id,
                                      "answer",
                                      choice
                                    );
                                  }
                                }}
                              />
                              {question.choices.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeChoice(question.id, index)
                                  }
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        {question.choices.length < 6 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addChoice(question.id)}
                            className="mt-2"
                          >
                            <Plus size={16} className="mr-1" />
                            Add Choice
                          </Button>
                        )}
                      </div>
                    )}

                    {/* True/False Choices */}
                    {question.type === "true-false" && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Correct Answer *
                        </Label>
                        <div className="flex gap-3">
                          <Button
                            variant={
                              question.answer === "True" ? "default" : "outline"
                            }
                            onClick={() => {
                              updateQuestion(question.id, "answer", "True");
                              updateQuestion(question.id, "choices", [
                                "True",
                                "False",
                              ]);
                            }}
                            className={
                              question.answer === "True"
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                          >
                            True
                          </Button>
                          <Button
                            variant={
                              question.answer === "False"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => {
                              updateQuestion(question.id, "answer", "False");
                              updateQuestion(question.id, "choices", [
                                "True",
                                "False",
                              ]);
                            }}
                            className={
                              question.answer === "False"
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                          >
                            False
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Fill in the Blank Answer */}
                    {question.type === "fill-in-blank" && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Correct Answer *
                        </Label>
                        <Input
                          value={question.answer}
                          onChange={(e) => {
                            updateQuestion(
                              question.id,
                              "answer",
                              e.target.value
                            );
                            updateQuestion(question.id, "choices", []);
                          }}
                          placeholder="Enter the correct answer"
                          className="border-2 focus:border-green-500 transition-colors"
                        />
                      </div>
                    )}

                    {/* Hint and Explanation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Hint (optional)
                        </Label>
                        <Textarea
                          value={question.hint}
                          onChange={(e) =>
                            updateQuestion(question.id, "hint", e.target.value)
                          }
                          placeholder="Add a helpful hint"
                          className="min-h-[80px] resize-none border-2 focus:border-yellow-500 transition-colors"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Explanation (optional)
                        </Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "explanation",
                              e.target.value
                            )
                          }
                          placeholder="Explain the answer"
                          className="min-h-[80px] resize-none border-2 focus:border-blue-500 transition-colors"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                    disabled={questions.length <= 2}
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
            onClick={addQuestion}
            variant="outline"
            className="w-full sm:w-auto border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-500 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Question
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
              onClick={createPracticeSet}
              className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
            >
              <Save size={18} className="mr-2" />
              Create Practice Set
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total questions: {questions.length}</span>
            <span>
              Valid questions: {questions.filter(isQuestionValid).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeModeCreator;
