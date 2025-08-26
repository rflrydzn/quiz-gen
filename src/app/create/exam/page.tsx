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
  BookOpen,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  question: string;
  type: string;
  choices: string[];
  answer: string;
  index: number;
}

const ExamStyleCreator = () => {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("Untitled Exam");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<any>(null);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: generateId(),
      question: "",
      type: "Multiple Choice",
      choices: ["", "", "", ""],
      answer: "",
      index: 1,
    },
    {
      id: generateId(),
      question: "",
      type: "Multiple Choice",
      choices: ["", "", "", ""],
      answer: "",
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
        type: "Multiple Choice",
        choices: ["", "", "", ""],
        answer: "",
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
              answer: q.answer === q.choices[choiceIndex] ? "" : q.answer,
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
    if (question.type === "Multiple Choice") {
      const validChoices = question.choices.filter((c) => c.trim());
      return validChoices.length >= 2 && validChoices.includes(question.answer);
    }
    return true;
  };

  const createExam = async () => {
    const validQuestions = questions.filter(isQuestionValid);

    if (validQuestions.length === 0) {
      alert("Please complete at least one question with all required fields.");
      return;
    }

    const examSet = {
      title,
      description,
      questions: validQuestions.map((q) => ({
        question: q.question,
        type: q.type,
        choices:
          q.type === "Open-Ended" ? [] : q.choices.filter((c) => c.trim()),
        answer: q.answer,
      })),
      createdAt: new Date().toISOString(),
    };

    console.log("Creating exam set:", examSet);

    // Save to localStorage for demo
    const savedSets = JSON.parse(localStorage.getItem("examSets") || "[]");
    savedSets.push(examSet);
    localStorage.setItem("examSets", JSON.stringify(savedSets));

    alert(`Exam "${title}" created with ${validQuestions.length} questions!`);

    // Save quiz metadata in Supabase
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user?.id,
        style: "Exam Style",
        difficulty: "Medium",
        number_of_items: examSet.questions.length,
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

    // Format and save questions using quiz.id
    const formattedQuestions = examSet.questions.map((q: any) => ({
      quiz_id: quiz.id,
      type: q.type,
      question: q.question ?? null,
      difficulty: null,
      choices: q.choices,
      answer: q.answer,
      hint: null,
      explanation: null,
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
    setTitle("Untitled Exam");
    setDescription("");
    setQuestions([
      {
        id: generateId(),
        question: "",
        type: "Multiple Choice",
        choices: ["", "", "", ""],
        answer: "",
        index: 1,
      },
      {
        id: generateId(),
        question: "",
        type: "Multiple Choice",
        choices: ["", "", "", ""],
        answer: "",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Create Exam
            </h1>
          </div>

          {/* Exam Info */}
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
                placeholder="Enter a title for your exam"
              />
            </div>
            <div>
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
            </div>
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
                  ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50"
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
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        placeholder="Enter your question"
                        className="min-h-[80px] resize-none border-2 focus:border-blue-500 transition-colors"
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
                        <SelectTrigger className="border-2 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Multiple Choice">
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value="True/False">True/False</SelectItem>
                          <SelectItem value="Fill in the Blank">
                            Fill in the Blank
                          </SelectItem>
                          <SelectItem value="Open-Ended">Open Ended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Choices (for multiple choice) */}
                    {question.type === "Multiple Choice" && (
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (choice.trim()) {
                                    updateQuestion(
                                      question.id,
                                      "answer",
                                      choice
                                    );
                                  }
                                }}
                                onFocus={(e) => e.stopPropagation()}
                                placeholder={`Choice ${index + 1}`}
                                className={`border-2 transition-colors cursor-pointer ${
                                  question.answer === choice && choice.trim()
                                    ? "border-green-500 bg-green-50"
                                    : "focus:border-blue-500"
                                }`}
                              />
                              {question.choices.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeChoice(question.id, index);
                                  }}
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
                    {question.type === "True/False" && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Correct Answer *
                        </Label>
                        <div
                          className="flex gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            type="button"
                            variant={
                              question.answer === "True" ? "default" : "outline"
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuestion(question.id, "answer", "True");
                              updateQuestion(question.id, "choices", [
                                "True",
                                "False",
                              ]);
                            }}
                            className={
                              question.answer === "True"
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "hover:bg-green-50"
                            }
                          >
                            True
                          </Button>
                          <Button
                            type="button"
                            variant={
                              question.answer === "False"
                                ? "default"
                                : "outline"
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuestion(question.id, "answer", "False");
                              updateQuestion(question.id, "choices", [
                                "True",
                                "False",
                              ]);
                            }}
                            className={
                              question.answer === "False"
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "hover:bg-green-50"
                            }
                          >
                            False
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Fill in the Blank Answer */}
                    {question.type === "Fill in the Blank" && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Correct Answer *
                        </Label>
                        <Input
                          type="text"
                          value={question.answer}
                          onChange={(e) => {
                            updateQuestion(
                              question.id,
                              "answer",
                              e.target.value
                            );
                            updateQuestion(question.id, "choices", []);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          placeholder="Enter the correct answer"
                          className="border-2 focus:border-green-500 transition-colors"
                        />
                      </div>
                    )}

                    {/* Open Ended Answer */}
                    {question.type === "Open-Ended" && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">
                          Sample Answer / Answer Key *
                        </Label>
                        <Textarea
                          value={question.answer}
                          onChange={(e) => {
                            updateQuestion(
                              question.id,
                              "answer",
                              e.target.value
                            );
                            updateQuestion(question.id, "choices", []);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          placeholder="Provide a sample answer or answer key for grading reference"
                          className="min-h-[100px] resize-none border-2 focus:border-green-500 transition-colors"
                          rows={4}
                        />
                      </div>
                    )}
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
            className="w-full sm:w-auto border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500 transition-colors"
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
              onClick={createExam}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 transition-all duration-200"
            >
              <Save size={18} className="mr-2" />
              Create Exam
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

export default ExamStyleCreator;
