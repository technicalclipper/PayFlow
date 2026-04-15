"use client";

import { motion } from "framer-motion";

interface AnimatedCheckmarkProps {
  size?: number;
  className?: string;
}

export default function AnimatedCheckmark({ size = 80, className = "" }: AnimatedCheckmarkProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            },
          }}
        />
        <motion.path
          d="M24 40 L35 51 L56 30"
          fill="none"
          stroke="#22C55E"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.4, delay: 0.4, ease: "easeOut" },
            },
          }}
        />
      </motion.svg>
    </div>
  );
}
