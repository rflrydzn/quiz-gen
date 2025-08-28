"use client";

import { motion, Variants } from "motion/react";

export default function LoadingThreeDotsJumping() {
  const dotVariants: Variants = {
    jump: {
      y: -12, // upward jump in pixels
      transition: {
        duration: 0.7,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      aria-live="polite"
      className="h-full inset-0 z-50 flex items-center justify-center"
    >
      {/* blurred translucent backdrop */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

      {/* centered dots */}
      <motion.div
        animate="jump"
        transition={{ staggerChildren: 0.12, ease: "easeInOut" }}
        className="relative z-10 flex items-center justify-center space-x-2.5"
      >
        <motion.span
          className="block w-5 h-5 rounded-full bg-primary will-change-transform"
          variants={dotVariants}
        />
        <motion.span
          className="block w-5 h-5 rounded-full bg-primary will-change-transform"
          variants={dotVariants}
        />
        <motion.span
          className="block w-5 h-5 rounded-full bg-primary will-change-transform"
          variants={dotVariants}
        />
      </motion.div>
    </div>
  );
}
