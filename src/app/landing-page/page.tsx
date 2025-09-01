"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TypingAnimation } from "@/components/ui/typing-animation";
import hero from "@/../public/hero.png";
import Image from "next/image";
import logo from "@/app/icon.png";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Book, Sunset, Trees, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar1 } from "@/components/blocks/shadcnblocks-com-navbar1";
import { BentoGridThirdDemo } from "@/components/BentoGrid";
import Pricing from "@/components/ui/pricing";
import { StackedCircularFooter as Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  const handleTryDemo = () => {
    alert("Loading demo experience...");
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <Navbar1 {...demoData} />
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
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
        {/* Background */}
        {/* <BackgroundGrid /> */}

        {/* Interactive Elements - scattered like Maze */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-[15%] pointer-events-auto">
            <ExamCard />
          </div>
          <div className="absolute top-12 right-[20%] pointer-events-auto">
            <Flashcard />
          </div>
          <div className="absolute bottom-32 right-[10%] pointer-events-auto">
            <PracticePreview />
          </div>
        </div>

        {/* Text Section */}
        <div className="max-w-2xl relative z-10 mb-12">
          <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance mb-6">
            Everything You Need to Ace Your Exams
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg mb-8">
            Create smarter quizzes, track your progress, and study with
            confidence—all in one place.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              className="flex items-center gap-2 hover:scale-105 transition-transform"
              onClick={() => {
                router.push("/login");
              }}
            >
              <ArrowRight className="h-4 w-4" />
              Get Started
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:scale-105 transition-transform"
              disabled
            >
              Try Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Image Section with Smooth Fade */}
      <div className="relative -mt-20">
        {/* Gradient overlay for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10" />

        <div className="flex justify-center items-center py-8 bg-gray-50/50">
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
              className="border rounded-lg shadow-2xl"
            />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* Bottom fade for smooth visual end */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
      </div>

      <div className=" p-24 space-y-7">
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
      </div>

      <div>
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;

//
// ✅ Enhanced Interactive Cards
//

const Flashcard = () => {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
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
        className={`relative w-[250px] h-[150px] [transform-style:preserve-3d] transition-all duration-500 ${
          flipped ? "[transform:rotateX(180deg)]" : ""
        } ${isHovered ? "shadow-lg" : "shadow-md"}`}
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white border rounded-lg p-3 flex flex-col space-y-2 [backface-visibility:hidden]">
          <TypingAnimation
            duration={50}
            className="font-medium text-gray-800 leading-relaxed text-sm"
            text="The solar system contains exactly ______ planets."
          />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 italic">
            Click to reveal answer
          </span>
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 flex items-center justify-center text-center [transform:rotateX(180deg)] [backface-visibility:hidden]">
          <div>
            <p className="font-bold text-lg text-green-800">8 Planets</p>
            <p className="text-xs text-green-600 mt-1">Click to flip back</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PracticePreview = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasTried, setHasTried] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const correctAnswer = "Mars";
  const choices = ["Mercury", "Venus", "Earth", "Mars"];

  useEffect(() => {
    const delay = setTimeout(() => setShowChoices(true), 2000);
    return () => clearTimeout(delay);
  }, []);

  const handleChoiceClick = (choice: string) => {
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
        <TypingAnimation
          duration={50}
          className="font-medium text-gray-800 text-sm"
          text="Which planet is known as the Red Planet?"
        />
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
            {choices.map((choice, i) => {
              const isSelected = selected === choice;
              const isCorrect = choice === correctAnswer;
              return (
                <motion.button
                  key={choice}
                  disabled={hasTried}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoiceClick(choice);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  whileHover={!hasTried ? { scale: 1.05 } : {}}
                  whileTap={!hasTried ? { scale: 0.95 } : {}}
                  className={`flex justify-center items-center h-8 w-full rounded text-xs font-medium border transition-all duration-300 ${
                    !selected
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

const ExamCard = () => {
  const [showChoicesQ1, setShowChoicesQ1] = useState(false);
  const [showChoicesQ2, setShowChoicesQ2] = useState(false);
  const [typedText1, setTypedText1] = useState("");
  const [typedText2, setTypedText2] = useState("");
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [selectedQ1, setSelectedQ1] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isActive, setIsActive] = useState(false);

  const q1 = "1. What is the largest planet in our solar system?";
  const q2 = "2. Why is Jupiter considered a gas giant?";

  useEffect(() => {
    // Start timer when component mounts
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = 20 * 60 - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isActive) return;

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
  }, [isActive]);

  useEffect(() => {
    if (showChoicesQ1) {
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
  }, [showChoicesQ1]);

  const handleCardClick = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const handleSubmit = () => {
    alert(`Exam submitted!\nQ1: ${selectedQ1}\nQ2: ${textAreaValue}`);
  };

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
        <span className="text-xs font-medium text-gray-500">
          ⏱ {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {!isActive ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Click to start exam</p>
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="font-medium text-sm mb-2 text-left">{typedText1}</p>
              {showChoicesQ1 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {["Earth", "Mars", "Jupiter", "Venus"].map((choice, i) => (
                    <motion.label
                      key={i}
                      className="flex items-center gap-2 border rounded px-2 py-1 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
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
                </motion.div>
              )}
            </div>

            <div>
              <p className="font-medium text-sm mb-2 text-left">{typedText2}</p>
              {showChoicesQ2 && (
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
              )}
            </div>

            {showChoicesQ2 && (selectedQ1 || textAreaValue) && (
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
            )}
          </>
        )}
      </div>
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
