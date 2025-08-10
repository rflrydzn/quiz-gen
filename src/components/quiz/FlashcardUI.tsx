import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import React, { useEffect } from "react";
import { quiz, question } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Card as ShadCard } from "../ui/card";
export default function FlashcardUI({
  quiz,
  questions,
}: {
  quiz: quiz;
  questions: question[];
}) {
  console.log("questions", questions);
  const [verticalLayout, setVerticalLayout] = useState(true);
  useEffect(() => console.log("switch", verticalLayout), [verticalLayout]);
  return (
    <>
      <Switch
        id="flashcard-layout"
        checked={verticalLayout}
        onCheckedChange={() => setVerticalLayout(!verticalLayout)}
      />
      <Label>Switch to</Label>
      {verticalLayout ? (
        <div style={container}>
          {questions.map((q, i) => (
            <Card i={i} front={q.front} back={q.back} key={q.id} />
          ))}
        </div>
      ) : (
        <div>
          <ShadCard />
        </div>
      )}
    </>
  );
}

interface CardProps {
  front: string;
  back: string;
  hueA?: number;
  hueB?: number;
  i: number;
}

function Card({ front, back, i, hueA, hueB }: CardProps) {
  const [flipped, setFlipped] = React.useState(false);
  const background = `#000000`;
  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <div style={{ ...splash, background }} />
      <motion.div
        style={{ ...cardWrapper, cursor: "pointer" }}
        variants={cardVariants}
        className="card-wrapper"
        onClick={() => setFlipped(!flipped)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          style={{
            ...card,
            ...cardFace,
            backfaceVisibility: "hidden",
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
        >
          <div style={cardContent}>
            <div style={cardText}>{front}</div>
            <div style={tapHint}>Tap to flip</div>
          </div>
        </motion.div>

        <motion.div
          style={{
            ...card,
            ...cardFace,
            ...cardBack,
            backfaceVisibility: "hidden",
          }}
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
        >
          <div style={cardContent}>
            <div style={cardText}>{back}</div>
            <div style={tapHint}>Tap to flip back</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const hue = (lightness: number) => `hsl(0, 0%, ${lightness}%)`;

/**
 * ==============   Styles   ================
 */

const container: React.CSSProperties = {
  margin: "100px auto",
  maxWidth: 500,
  paddingBottom: 100,
  width: "100%",
};

const cardContainer: React.CSSProperties = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  marginBottom: -120,
};

const splash: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
};

const cardWrapper: React.CSSProperties = {
  position: "relative",
  width: 300,
  height: 430,
  transformStyle: "preserve-3d",
  transformOrigin: "10% 60%",
};

const cardFace: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

const card: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  background: "#ffffff",
  boxShadow:
    "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
  border: "2px solid #f0f0f0",
};

const cardBack: React.CSSProperties = {
  background: "#f8f9fa",
  transform: "rotateY(180deg)",
};

const cardContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  textAlign: "center",
  height: "100%",
  width: "100%",
};

const cardText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#333",
  lineHeight: "1.5",
  marginBottom: "20px",
  maxWidth: "250px",
};

const tapHint: React.CSSProperties = {
  fontSize: "12px",
  color: "#666",
  opacity: 0.7,
  fontStyle: "italic",
  marginTop: "auto",
};
