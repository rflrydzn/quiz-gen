import * as motion from "motion/react-client";
import React, { useEffect } from "react";
import { quiz, question, QuizletViewProps, Material } from "@/types/types";
import { useState } from "react";
import { Progress } from "../ui/progress";
import QuizNavButtons from "./QuizNavButtons";
import {
  Check,
  Share2,
  Star,
  X,
  Search,
  BookOpen,
  ExternalLink,
  Clock,
  User,
} from "lucide-react";
import { Share } from "lucide-react";
import Quiz from "../Quiz";
import { Input } from "../ui/input";

// Mock data for materials - replace with your actual data structure
// Mock data for materials - generic placeholders
const mockMaterials = [
  {
    id: 1,
    title: "Understanding Core Concepts",
    type: "article",
    author: "Author One",
    readTime: "5 min read",
    excerpt:
      "An introductory overview of fundamental concepts with practical examples.",
    url: "#",
    thumbnail: "/api/placeholder/300/200",
    tags: ["Concepts", "Basics"],
  },
  {
    id: 2,
    title: "Exploring Advanced Techniques",
    type: "blog",
    author: "Author Two",
    readTime: "10 min read",
    excerpt:
      "Dive into advanced techniques and patterns commonly used in practice.",
    url: "#",
    thumbnail: "/api/placeholder/300/200",
    tags: ["Advanced", "Techniques"],
  },
  {
    id: 3,
    title: "Step-by-Step Guide",
    type: "tutorial",
    author: "Author Three",
    readTime: "8 min read",
    excerpt:
      "A hands-on tutorial that walks through essential steps and methods.",
    url: "#",
    thumbnail: "/api/placeholder/300/200",
    tags: ["Guide", "Tutorial"],
  },
  {
    id: 4,
    title: "Best Practices to Remember",
    type: "article",
    author: "Author Four",
    readTime: "12 min read",
    excerpt:
      "A collection of best practices and recommendations to follow consistently.",
    url: "#",
    thumbnail: "/api/placeholder/300/200",
    tags: ["Best Practices", "Tips"],
  },
];

function MaterialCard({ material }: { material: Material }) {
  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden hover:shadow-md duration-200 cursor-pointer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 capitalize">
            {material.type}
          </span>
        </div>
        <div className="absolute bottom-2 right-2">
          <ExternalLink className="w-4 h-4 text-white/80" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
          {material.title}
        </h3>

        <p className="text-gray-600 text-xs line-clamp-2 mb-3">
          {material.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{material.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{material.readTime}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {material.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
          {material.tags.length > 2 && (
            <span className="text-xs text-gray-400">
              +{material.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function QuizletView({
  title,
  questions,
  currentIndex,
  nextCard,
  prevCard,
  onProgressMode,
  onMarkKnown,
  onMarkUnknown,
  unknownQuestions,
  knownQuestions,
  progressMode,
  onRestart,
  onShuffle,
}: QuizletViewProps) {
  const [flipped, setFlipped] = useState(false);
  const [materialsView, setMaterialsView] = useState("all");
  const currentQuestion = questions[currentIndex];

  const handleKnown = () => {
    onMarkKnown(currentQuestion.id);
    nextCard();
  };

  const handleUnknown = () => {
    onMarkUnknown(currentQuestion.id);
    nextCard();
  };

  // Reset flip when changing cards
  useEffect(() => {
    setFlipped(false);
  }, [currentIndex]);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white  border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 truncate">
              {title}
            </h1>

            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search flashcards"
                  className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Star className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search flashcards"
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 lg:w-2/3">
            <div className=" p-6">
              {progressMode && (
                <div className="flex justify-between items-center mb-8  rounded-lg p-4">
                  {/* Known */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.keys(knownQuestions).length}
                      </div>
                      <div className="text-sm text-gray-600">Known</div>
                    </div>
                  </div>

                  {/* Still Learning */}
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.keys(unknownQuestions).length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Still Learning
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Main card */}
              <div className="w-full max-w-4xl mx-auto h-64 sm:h-80 lg:h-96 mb-8">
                <motion.div
                  className="relative w-full h-full cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                  onClick={() => setFlipped(!flipped)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute w-full h-full top-0 left-0 flex justify-center items-center rounded-xl bg-white border"
                    style={{ backfaceVisibility: "hidden" }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                  >
                    <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center h-full w-full">
                      <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-800 leading-relaxed mb-4 max-w-full overflow-hidden">
                        {currentQuestion.front}
                      </div>
                      <div className="text-sm text-gray-400 opacity-80 italic mt-auto">
                        Click to reveal answer
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute w-full h-full top-0 left-0 flex justify-center items-center rounded-xl bg-slate-50 border"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                    animate={{ rotateY: flipped ? 0 : -180 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                  >
                    <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center h-full w-full">
                      <div className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-800 leading-relaxed mb-4 max-w-full overflow-hidden">
                        {currentQuestion.back}
                      </div>
                      <div className="text-sm text-gray-400 opacity-80 italic mt-auto">
                        Click to show question
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Navigation */}
              <QuizNavButtons
                progressMode={progressMode}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                onProgressMode={onProgressMode}
                onPrev={prevCard}
                onNext={nextCard}
                onKnown={handleKnown}
                onUnknown={handleUnknown}
                onRestart={onRestart}
                onShuffle={onShuffle}
                roundQuestionLength={questions.length}
                hint={questions[currentIndex].hint}
              />
            </div>
          </div>

          {/* Materials Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl  border overflow-hidden sticky top-24">
              {/* Materials Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Related Materials
                  </h2>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {["all", "articles", "tutorials", "blogs"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMaterialsView(tab)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                        materialsView === tab
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials List */}
              <div className="max-h-[600px] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {mockMaterials
                    .filter(
                      (material) =>
                        materialsView === "all" ||
                        material.type === materialsView
                    )
                    .map((material) => (
                      <MaterialCard key={material.id} material={material} />
                    ))}
                </div>

                {/* Load more button */}
                <div className="p-4 border-t border-gray-100">
                  <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Load more materials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizletView;
