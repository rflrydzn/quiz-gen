import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import React from "react";
import { useEffect, useRef } from "react";
import Summary from "./Summary";
import { CardProps } from "@/types/types";
import {
  cardVariants,
  container,
  cardContainer,
  cardWrapper,
  splash,
  card,
  cardFace,
  cardBack,
  cardContent,
  cardText,
  tapHint,
} from "@/styles/styles";
function FlashcardVerticalScrollUI({
  front,
  back,
  i,
  onInView,
  isActive,
}: CardProps) {
  const [flipped, setFlipped] = React.useState(false);
  const background = `#000000`;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Call onInView when card is 50% visible
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          onInView?.();
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of card is visible
        rootMargin: "-10% 0px -10% 0px", // Add some margin for better detection
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [onInView]);

  return (
    <div ref={cardRef}>
      <div style={container}>
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
      </div>
    </div>
  );
}

export default FlashcardVerticalScrollUI;
