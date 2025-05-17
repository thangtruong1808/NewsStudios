"use client";

import { motion } from "framer-motion";

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <motion.div
      className="w-8 h-8 border-4 border-blue-200 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full border-4 border-blue-600 rounded-full border-t-transparent" />
    </motion.div>
  </div>
);
