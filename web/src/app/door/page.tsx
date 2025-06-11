"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Page() {
  const [isOpen, setisOpen] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inset-0 h-screen fixed bg-black z-50 flex"
        >
          {/* left door */}
          <motion.div
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1,
            }}
            className="w-1/2 h-full bg-cyan-700"
          ></motion.div>
          {/* right door */}
          <motion.div
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1,
              stiffness: 50,
              type: "keyframes",
            }}
            className="w-1/2 h-full bg-fuchsia-900"
          ></motion.div>
        </motion.div>
      )}

      <button
        className="fixed bottom-8 left-8 z-[500] "
        onClick={() => setisOpen(!isOpen)}
      >
        Open
      </button>
    </AnimatePresence>
  );
}
