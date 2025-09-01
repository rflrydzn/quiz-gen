"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconClipboardCopy,
  IconUsers,
  IconChartDonut3,
  IconClock,
  IconMessageCircle,
  IconDeviceMobile,
  IconBrain,
  IconEdit,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import responsivesreenshot from "@/../public/responsive.jpeg";
import Image from "next/image";

export function BentoGridThirdDemo() {
  return (
    <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[18rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

// AI Quiz Generation - Magic wand creating questions
const AIQuizGeneratorSkeleton = () => {
  const variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, staggerChildren: 0.15 },
    },
  };

  const wandVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -10, 10, -5, 0],
      transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 },
    },
  };

  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      transition: { duration: 1.5, repeat: Infinity, delay: Math.random() * 2 },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative p-4"
    >
      {/* Magic Wand */}
      <motion.div
        variants={wandVariants}
        className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
      >
        <span className="text-white text-xs">✨</span>
      </motion.div>

      {/* Sparkles */}
      {/* {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          variants={sparkleVariants}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
        />
      ))} */}

      {/* Generated Questions */}
      <motion.div
        variants={variants}
        className="flex flex-col space-y-2 w-full"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            variants={variants}
            className="bg-white dark:bg-black rounded-lg p-3 border border-neutral-200 dark:border-white/[0.2] shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded shrink-0" />
              <div
                className="w-full bg-gray-200 dark:bg-neutral-700 h-2 rounded"
                // style={{ width: `${70 + Math.random() * 30}%` }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// DIY Quiz Creation - Manual editing interface
const DIYQuizSkeleton = () => {
  const [isEditing, setIsEditing] = React.useState(false);

  const editVariants = {
    idle: { scale: 1 },
    editing: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="idle"
      whileHover="editing"
      onHoverStart={() => setIsEditing(true)}
      onHoverEnd={() => setIsEditing(false)}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] p-4"
    >
      <motion.div
        variants={editVariants}
        className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.2] rounded-lg p-4"
      >
        {/* Editor Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Question Editor
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </div>

        {/* Editable Content */}
        <div className="space-y-3">
          <div className="relative">
            <div className="w-full h-3 bg-gray-100 dark:bg-neutral-800 rounded" />
            {isEditing && (
              <div className="absolute right-0 top-0 w-0.5 h-3 bg-primary animate-pulse" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-gray-300 rounded" />
            <div className="w-20 h-2 bg-gray-100 dark:bg-neutral-800 rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-blue-500 rounded bg-primary" />
            <div className="w-24 h-2 bg-gray-100 dark:bg-neutral-800 rounded" />
          </div>
        </div>

        {/* Add Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="mt-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="text-white text-xs font-bold">+</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Progress Tracking - Donut Chart
const ProgressDonutSkeleton = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 85 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col items-center justify-center p-4"
    >
      {/* Donut Chart */}
      <div className="relative">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle (solid black) */}
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            stroke="black"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress}%
          </span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between w-full mt-4 text-xs">
        <div className="text-center">
          <div className="font-semibold">127</div>
          <div className="text-gray-500">Quizzes</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">8.2</div>
          <div className="text-gray-500">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">15</div>
          <div className="text-gray-500">Streak</div>
        </div>
      </div>
    </motion.div>
  );
};

// Responsive Design - Multiple devices
// Smartphone-only design
const ResponsiveSkeleton = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[280px] h-[560px] sm:w-[320px] sm:h-[640px] lg:w-[190px] lg:h-[380px]">
        {/* Smartphone Frame */}
        <div className="absolute inset-0 rounded-[3rem] border-4 border-gray-800 bg-black shadow-xl overflow-hidden">
          {/* Screen */}
          <div className="absolute inset-1 rounded-[2.5rem] overflow-hidden bg-white">
            <Image
              src={responsivesreenshot} // your screenshot inside the phone
              alt="App Demo"
              width={400}
              height={800}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-gray-800 rounded-b-2xl"></div>
      </div>
    </div>
  );
};

// AI Study Companion - Enhanced chat interface
const AICompanionSkeleton = () => {
  const [typing, setTyping] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTyping((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col justify-end space-y-3 p-4"
    >
      {/* User message */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex justify-end"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[75%]">
          <p className="text-xs">Explain photosynthesis in simple terms</p>
        </div>
      </motion.div>

      {/* AI response with typing indicator */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-start items-start space-x-2"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shrink-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">🤖</span>
        </div>
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.2] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%]">
          {typing ? (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
              <div
                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          ) : (
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Photosynthesis is like cooking with sunlight! Plants use sun,
              water, and CO₂ to make food... 🌱
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Exam Simulation - Realistic exam interface
const ExamSimulationSkeleton = () => {
  const [time, setTime] = React.useState(1800); // 30 minutes
  const [currentQuestion, setCurrentQuestion] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 1800));
      if (Math.random() > 0.95) {
        setCurrentQuestion((prev) => (prev < 15 ? prev + 1 : 1));
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      whileHover={{ scale: 1 }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] p-3"
    >
      <div className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.2] rounded-lg p-4 flex flex-col">
        {/* Exam Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
          <div className="text-sm font-semibold">Physics Mock Exam</div>
          <div
            className={`text-sm font-mono ${
              time < 300 ? "text-red-500" : "text-neutral-600"
            }`}
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>

        {/* Question Progress */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs text-neutral-500">
            Question {currentQuestion} of 15
          </span>
          <div className="flex-1 bg-gray-200 dark:bg-neutral-700 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 space-y-3">
          <div className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded" />
          <div className="w-4/5 h-2 bg-gray-200 dark:bg-neutral-700 rounded" />
        </div>
      </div>
    </motion.div>
  );
};

// Share with Friends - Social sharing interface
const ShareSkeleton = () => {
  const shareVariants = {
    initial: { scale: 1, rotate: 0 },
    shared: {
      scale: 1.1,
      rotate: 360,
      transition: { type: "spring", duration: 0.6 },
    },
  };

  const friendVariants = {
    initial: { x: 0, opacity: 0.7 },
    animate: {
      x: [0, 5, -5, 0],
      opacity: 1,
      transition: { duration: 2, repeat: Infinity, delay: Math.random() * 2 },
    },
  };

  const avatars = [
    "https://bundui-images.netlify.app/avatars/01.png",
    "https://bundui-images.netlify.app/avatars/02.png",
    "https://bundui-images.netlify.app/avatars/03.png",
    "https://bundui-images.netlify.app/avatars/04.png",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col items-center justify-center p-4 space-y-4"
    >
      {/* Friends List */}
      <div className="flex space-x-2">
        {avatars.map((avatar, i) => (
          <motion.div
            key={i}
            variants={friendVariants}
            initial="initial"
            animate="animate"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative overflow-hidden"
          >
            <img
              src={avatar}
              alt={`Friend ${i + 1}`}
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Share Stats */}
      <div className="text-center">
        <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          2.4k
        </div>
        <div className="text-xs text-neutral-500">Quiz Shares</div>
      </div>
    </motion.div>
  );
};

const items = [
  {
    title: "AI Quiz Generation",
    description: (
      <span className="text-sm">
        Let AI instantly create personalized quizzes from any content.
      </span>
    ),
    header: <AIQuizGeneratorSkeleton />,
    className: "md:col-span-1",
    icon: <IconBrain className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "DIY Quiz Creation",
    description: (
      <span className="text-sm">
        Build custom quizzes with our intuitive editor tools.
      </span>
    ),
    header: <DIYQuizSkeleton />,
    className: "md:col-span-1",
    icon: <IconEdit className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Progress Tracking",
    description: (
      <span className="text-sm">
        Monitor your learning journey with detailed analytics and insights.
      </span>
    ),
    header: <ProgressDonutSkeleton />,
    className: "md:col-span-1",
    icon: <IconChartDonut3 className="h-4 w-4 text-neutral-500" />,
  },

  // 👇 Make Responsive Design a tall vertical card
  {
    title: "Responsive Design",
    description: (
      <span className="text-sm">
        Study seamlessly across all your devices - phone, tablet, or desktop.
      </span>
    ),
    header: <ResponsiveSkeleton />,
    className: "md:col-span-1 md:row-span-2", // <-- tall 2x1 card
    icon: <IconDeviceMobile className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "Exam Simulation",
    description: (
      <span className="text-sm">
        Practice with realistic timed exams that mirror real test conditions.
      </span>
    ),
    header: <ExamSimulationSkeleton />,
    className: "md:col-span-2", // wide card
    icon: <IconClock className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "AI Study Companion",
    description: (
      <span className="text-sm">
        Get instant explanations and study help from your AI tutor.
      </span>
    ),
    header: <AICompanionSkeleton />,
    className: "md:col-span-1",
    icon: <IconMessageCircle className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "Share with Friends",
    description: (
      <span className="text-sm">
        Challenge friends and create study groups with shared quizzes.
      </span>
    ),
    header: <ShareSkeleton />,
    className: "md:col-span-1",
    icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
  },
];
