"use client";

import { motion } from "framer-motion";

interface MotionRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function MotionReveal({ children, delay = 0 }: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
