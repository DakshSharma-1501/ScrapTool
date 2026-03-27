"use client";

import { Moon, Sun, Terminal, User, Database } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#000000]/60 backdrop-blur-xl border-b border-neutral-200 dark:border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-neutral-900 dark:text-white text-lg tracking-tight">DataExtractor AI</span>
        </Link>
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 p-2.5 rounded-full transition-colors hidden sm:block"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <a href="https://github.com" target="_blank" className="hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 p-2.5 rounded-full transition-colors hidden sm:block">
            <Terminal className="w-4 h-4" />
          </a>
          <button className="hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 p-2.5 rounded-full transition-colors ml-2 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
