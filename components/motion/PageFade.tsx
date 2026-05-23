"use client";

import { motion } from "framer-motion";

interface PageFadeProps {
  children: React.ReactNode;
}

export function PageFade({ children }: PageFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
