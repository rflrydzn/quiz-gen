"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TypingAnimation } from "@/components/ui/typing-animation";
import hero from "@/../public/hero.png";
import heroFone from "@/../public/hero-fone.png";
import Image from "next/image";
import logo from "@/app/icon.png";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar1 } from "@/components/blocks/shadcnblocks-com-navbar1";
import { BentoGridThirdDemo } from "@/components/BentoGrid";
import Pricing from "@/components/ui/pricing";
import { StackedCircularFooter as Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { SheetDemo } from "@/components/LiveDemo";
import { question } from "@/types/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const LandingPage = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<question[] | null>(null);
  const slides = [
    {
      id: "exam",
      element: (
        <ExamCard
          question1={questions?.[2]}
          question2={questions?.[3]}
          hasQuestions={!!questions}
        />
      ),
    },
    {
      id: "practice",
      element: (
        <PracticePreview question={questions?.[1]} hasQuestions={!!questions} />
      ),
    },
    { id: "flashcard", element: <Flashcard question={questions?.[0]} /> },
  ];

  return (
    <div>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <Navbar1 {...demoData} />
      </header>

      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-28 relative">
          <AnimatedGridPattern
            numSquares={200}
            maxOpacity={0.3}
            duration={3}
            repeatDelay={1}
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            )}
          />
          {/* Text Section */}
          <div className="max-w-2xl relative z-10 mb-12">
            <h1 className="text-6xl font-extrabold tracking-tight mb-6">
              Everything You Need to Ace Your Exams
            </h1>
            <p className="max-w-xl mx-auto text-muted-foreground text-lg mb-8">
              Create smarter quizzes, track your progress, and study with
              confidence—all in one place.
            </p>

            <div className="flex justify-center gap-4">
              <Button
                className="flex items-center gap-2 hover:scale-105 transition-transform"
                onClick={() => router.push("/login")}
              >
                <ArrowRight className="h-4 w-4" />
                Get Started
              </Button>
              <SheetDemo onGenerate={(data) => setQuestions(data)} />
            </div>
          </div>

          <Carousel
            className={`${
              questions ? "inline " : "hidden "
            } mb-7 w-full max-w-xs xl:hidden`}
          >
            <CarouselContent>
              {slides.map((e) => (
                <CarouselItem key={e.id}>
                  <div className="p-1 flex items-center justify-center h-full">
                    {e.element}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <Image
              src={hero}
              alt="Hero Image"
              width={900}
              className="hidden sm:block border rounded-lg shadow-2xl"
            />

            {/* Small screens (sm and below) */}
            <Image
              src={heroFone}
              alt="Hero Mobile Image"
              width={400}
              className="block sm:hidden border rounded-lg shadow-2xl"
            />
          </motion.div>
        </section>

        <section className=" p-24 space-y-7">
          <div>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
              🔑 Tools That Work for You
            </h1>
            <p className="text-center leading-7 ">
              From smart quizzes to progress tracking, explore features designed
              to make studying easier.
            </p>
          </div>

          <BentoGridThirdDemo />
        </section>

        <section>
          <Pricing />
        </section>

        <Footer />

        <div className="absolute inset-0 pointer-events-none hidden xl:inline">
          <div className="absolute pointer-events-auto xl:top-28 xl:left-8 ">
            <ExamCard
              question1={questions?.[2]}
              question2={questions?.[3]}
              hasQuestions={!!questions}
            />
          </div>
          <div className="absolute pointer-events-auto xl:right-8 xl:top-28">
            <Flashcard question={questions?.[0]} />
          </div>
          <div className="absolute pointer-events-auto xl:right-20 xl:top-80">
            <PracticePreview
              question={questions?.[1]}
              hasQuestions={!!questions}
            />
          </div>
        </div>
      </main>

      {/* Hero Image Section with Smooth Fade */}
      {/* <div className=""> */}
      {/* Gradient overlay for smooth transition */}
      {/* <div className=" border-2" /> */}

      {/* Bottom fade for smooth visual end */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" /> */}
      {/* </div> */}
    </div>
  );
};

export default LandingPage;

//
// ✅ Enhanced Interactive Cards
//

const Flashcard = ({ question }: { question: question | undefined }) => {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!question) return;
    setFlipped(!flipped);
  };

  return (
    <motion.div
      className="[perspective:1000px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`relative w-[250px] h-[150px] [transform-style:preserve-3d] transition-all duration-100 ${
          flipped ? "[transform:rotateX(180deg)]" : ""
        } ${isHovered ? "shadow-md" : ""}`}
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-none border rounded-lg p-3 flex flex-col space-y-2 [backface-visibility:hidden]">
          {question ? (
            <>
              <TypingAnimation
                duration={50}
                className="font-medium text-gray-800 leading-relaxed text-sm"
                text={question.question}
              />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 italic">
                Click to reveal answer
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              Click live demo to generate question
            </span>
          )}

          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 flex items-center justify-center text-center [transform:rotateX(180deg)] [backface-visibility:hidden]">
          <div>
            <p className="font-bold text-lg ">
              {question?.answer ? question?.answer : "Click Try Demo"}
            </p>
            <p className="text-xs  mt-1">Click to flip back</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PracticePreview = ({
  question,
  hasQuestions,
}: {
  question: question | undefined;
  hasQuestions: boolean;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasTried, setHasTried] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const correctAnswer = question?.answer;
  const choices = question?.choices ?? [
    "Option A",
    "Option B",
    "Option C",
    "Option D",
  ];

  useEffect(() => {
    const delay = setTimeout(() => setShowChoices(true), 2000);
    return () => clearTimeout(delay);
  }, []);

  const handleChoiceClick = (choice: string) => {
    if (!question) return;
    if (hasTried) return;

    setSelected(choice);
    setHasTried(true);
    setShowFeedback(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSelected(null);
      setHasTried(false);
      setShowFeedback(false);
    }, 3000);
  };

  const handleCardClick = () => {
    if (!hasTried && !showChoices) {
      setShowChoices(true);
    }
  };

  return (
    <motion.div
      className="bg-white w-[250px] h-[170px] rounded-lg p-3 space-y-3 border cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center">
        {question ? (
          <TypingAnimation
            duration={50}
            className="font-medium text-gray-800 text-sm"
            text={question.question}
          />
        ) : (
          <span className="text-muted-foreground text-xs">
            Click Live Demo to see practice question
          </span>
        )}

        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
      </div>

      <AnimatePresence>
        {showChoices && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-2"
          >
            {choices?.map((choice, i) => {
              const isSelected = selected === choice;
              const isCorrect = choice === correctAnswer;
              return (
                <motion.button
                  key={choice}
                  disabled={hasTried || !hasQuestions}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoiceClick(choice);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  whileHover={!hasTried && hasQuestions ? { scale: 1.05 } : {}}
                  whileTap={!hasTried && hasQuestions ? { scale: 0.95 } : {}}
                  className={`flex justify-center items-center h-8 w-full rounded text-xs font-medium border transition-all duration-300 ${
                    !hasQuestions
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : !selected
                      ? "hover:bg-gray-100 text-gray-800 hover:border-gray-300"
                      : isSelected && isCorrect
                      ? "border-green-500 bg-green-50 text-green-700"
                      : isSelected && !isCorrect
                      ? "border-red-500 bg-red-50 text-red-700"
                      : isCorrect && hasTried
                      ? "border-green-300 bg-green-50 text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {choice}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {selected === correctAnswer ? (
            <p className="text-xs text-green-600 font-medium">✅ Correct!</p>
          ) : (
            <p className="text-xs text-red-600 font-medium">❌ Try again</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

const ExamCard = ({
  question1,
  question2,
  hasQuestions,
}: {
  question1?: question;
  question2?: question;
  hasQuestions: boolean;
}) => {
  const [showChoicesQ1, setShowChoicesQ1] = useState(false);
  const [showChoicesQ2, setShowChoicesQ2] = useState(false);
  const [typedText1, setTypedText1] = useState("");
  const [typedText2, setTypedText2] = useState("");
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [selectedQ1, setSelectedQ1] = useState<string>("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAIFeedback] = useState<{
    criteria: string;
    grade: number;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const q1 =
    hasQuestions && question1
      ? question1.question
      : "Click Live Demo to generate exam questions";
  const q2 =
    hasQuestions && question2
      ? question2.question
      : "Interactive exam mode will appear here";

  useEffect(() => {
    // Start timer when component mounts
    if (isActive) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = 5 * 60 - elapsed;
        setTimeLeft(remaining > 0 ? remaining : 0);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isActive || !hasQuestions) return;

    let i = 0;
    const interval = setInterval(() => {
      setTypedText1(q1.slice(0, i + 1));
      i++;
      if (i === q1.length) {
        clearInterval(interval);
        setTimeout(() => setShowChoicesQ1(true), 300);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isActive, hasQuestions]);

  useEffect(() => {
    if (showChoicesQ1 && hasQuestions) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText2(q2.slice(0, i + 1));
        i++;
        if (i === q2.length) {
          clearInterval(interval);
          setTimeout(() => setShowChoicesQ2(true), 300);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showChoicesQ1, hasQuestions]);

  const handleCardClick = () => {
    if (!isActive && hasQuestions) {
      setIsActive(true);
    }
  };

  const handleSubmit = () => {
    getAIGradedScore();
    setIsSubmitted(true);
  };

  const getGrade = () => {
    if (aiFeedback) {
      const isQ1Correct = question1?.answer === selectedQ1;
      let q1Score = Number(isQ1Correct);
      return aiFeedback.grade + (q1Score * 100) / 2;
    }
  };

  const getAIGradedScore = async () => {
    setIsLoading(true);
    const res = await fetch("/api/grade-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question2?.question,
        userAnswer: textAreaValue,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      console.error("Error generating quiz:", error);
      return;
    }
    const data = await res.json();
    console.log("ai", data);
    setAIFeedback({
      criteria: data?.criteria,
      grade: data?.grade,
    });
    setShowSummary(true);
    setIsLoading(false);
    return data;
  };
  useEffect(() => console.log("selected", selectedQ1), [selectedQ1]);
  return (
    <motion.div
      className="border bg-white w-[300px] h-[400px] rounded-lg flex flex-col shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center border-b px-3 py-2 bg-gray-50 rounded-t-lg">
        <span className="text-xs font-medium text-gray-600">
          📝 Practice Exam
        </span>
        {aiFeedback ? (
          <span className="text-xs font-medium">Grade: {getGrade()}%</span>
        ) : (
          <span
            className={`text-xs font-medium ${
              hasQuestions ? "text-gray-500" : "text-gray-400"
            }`}
          >
            ⏱ {formatTime(timeLeft)}
          </span>
        )}
      </div>

      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          <span>Grading your answer...</span>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!hasQuestions ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-2">
                  Click Live Demo to generate
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Practice exams will appear here
                </p>
                <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto" />
              </div>
            </div>
          ) : !isActive ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Click to start exam
                </p>
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="font-medium text-sm mb-2 text-left">
                  {typedText1}
                </p>
                {showChoicesQ1 && question1 && hasQuestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {question1.choices.map((choice, i) => (
                      <motion.label
                        key={i}
                        className={`${
                          showSummary && choice === question1.answer
                            ? "border-green-500 "
                            : showSummary && selectedQ1 === choice
                            ? " border-red-500"
                            : ""
                        } flex items-center gap-2 border rounded px-2 py-1 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          disabled={isSubmitted || showSummary}
                          type="radio"
                          name="q1"
                          value={choice}
                          checked={selectedQ1 === choice}
                          onChange={(e) => setSelectedQ1(e.target.value)}
                          className="w-3 h-3 accent-blue-500"
                        />
                        {choice}
                      </motion.label>
                    ))}
                    {/* {aiFeedback && (
                      <div className="inline-block p-[1px] rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-3xl h-7 px-3 text-xs bg-white"
                        >
                          Explain this answer ⟡
                        </Button>
                      </div>
                    )} */}
                  </motion.div>
                )}
              </div>

              <div>
                <p className="font-medium text-sm mb-2 text-left">
                  {typedText2}
                </p>
                {showChoicesQ2 && question2 && hasQuestions && (
                  <>
                    <motion.textarea
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      name="q2"
                      placeholder="Write your answer..."
                      value={textAreaValue}
                      onChange={(e) => setTextAreaValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full h-16 border rounded bg-slate-50 text-xs text-gray-700 p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                    {aiFeedback ? (
                      <div className="text-left">
                        <p className="text-xs text-gray-700">
                          AI graded your answer a{" "}
                          <span className="font-bold">
                            {aiFeedback.grade * 100}%.
                          </span>{" "}
                          {aiFeedback.criteria}
                        </p>
                      </div>
                    ) : (
                      <>
                        <span className="lg:text-xs lg:text-muted-foreground">
                          AI will grade you based on your answer.
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                  }}
                  className="w-full text-xs"
                >
                  Submit Exam
                </Button>
              </motion.div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

const demoData = {
  logo: {
    url: "https://www.shadcnblocks.com",
    src: logo.src,
    alt: "blocks for shadcn/ui",
    title: "QuizMaster",
  },
  menu: [
    {
      title: "Home",
      url: "https://www.shadcnblocks.com",
    },
    {
      title: "Features",
      url: "#",
    },
    {
      title: "About",
      url: "#",
    },
    {
      title: "Pricing",
      url: "/pricing",
    },
    {
      title: "Blog",
      url: "/blog",
    },
  ],
  mobileExtraLinks: [
    { name: "Press", url: "/press" },
    { name: "Contact", url: "/contact" },
    { name: "Imprint", url: "/imprint" },
    { name: "Sitemap", url: "/sitemap" },
  ],
  auth: {
    login: { text: "Log in", url: "/login" },
    signup: { text: "Sign up", url: "/signup" },
  },
};
