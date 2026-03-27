"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function UrlInput({ url, setUrl, onSubmit, isLoading }: UrlInputProps) {
  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={onSubmit} 
      className="w-full max-w-3xl flex flex-col sm:flex-row gap-3 relative z-10"
    >
      <div className="relative flex-1 group">
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent group-focus-within:via-indigo-500 transition-all duration-500" />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
          <Globe className="w-6 h-6" />
        </div>
        <input
          type="url"
          required
          placeholder="https://example.com"
          className="w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl pl-14 pr-6 py-5 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-indigo-500/5 text-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !url}
        className="bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black px-8 py-5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px] shadow-lg shadow-black/10 dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)]"
      >
        <span className="text-lg">Extract</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.form>
  );
}
