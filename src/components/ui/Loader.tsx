"use client";

import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 w-full animate-in fade-in duration-500">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[4px] rounded-full border-2 border-l-blue-500 border-r-transparent border-b-transparent border-t-transparent opacity-80"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500/40 to-blue-500/40 blur-sm animate-pulse" />
        </div>
      </div>
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-indigo-400 text-xs font-semibold tracking-[0.2em] font-mono uppercase bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 shadow-inner"
      >
        Extracting Data
      </motion.p>
    </div>
  );
}
