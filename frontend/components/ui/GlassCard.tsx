"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ hoverable = false, glow = false, className = "", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`
          glass-card
          ${hoverable ? "glass-card-hover cursor-pointer" : ""}
          ${glow ? "glow-gradient" : ""}
          ${className}
        `}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
