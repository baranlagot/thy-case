import React from "react";
import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex space-x-2 p-3 bg-white rounded-2xl rounded-bl-none inline-block">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            delay: dot * 0.2,
          }}
        />
      ))}
    </div>
  );
}
