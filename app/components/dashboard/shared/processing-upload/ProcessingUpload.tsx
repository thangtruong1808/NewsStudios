"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface ProcessingUploadProps {
  isProcessing: boolean;
  fileName?: string;
  fileType?: "image" | "video";
  progress?: number;
}

export default function ProcessingUpload({
  isProcessing,
  fileName,
  fileType = "image",
  progress = 0,
}: ProcessingUploadProps) {
  const [dots, setDots] = useState("");

  // Animate loading dots
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex items-center space-x-3">
        {/* Processing Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-600"
        >
          <ArrowPathIcon className="w-6 h-6" />
        </motion.div>

        {/* Processing Text */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Processing {fileType === "image" ? "image" : "video"}
              {fileName && `: ${fileName}`}
              {dots}
            </p>
            <span className="text-sm font-medium text-blue-600">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <motion.div
              className="bg-blue-600 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
