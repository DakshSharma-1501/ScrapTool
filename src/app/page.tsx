"use client";

import { motion } from "framer-motion";
import { Sparkles, MoonStar, Infinity, HeartHandshake } from "lucide-react";
import Link from "next/link";

const CARDS = [
  {
    icon: MoonStar,
    title: "Single Kundli",
    description: "Generate your highly precise Janam Kundli with detailed planetary positions and AI interpretations.",
    href: "/kundli",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: HeartHandshake,
    title: "Kundli Matching",
    description: "Discover Ashtakoota Guna Milan compatibility and precise relationship future predictions.",
    href: "/matchmaking",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Infinity,
    title: "Numerology",
    description: "Calculate your Life Path and Destiny numbers automatically to reveal hidden life patterns.",
    href: "/numerology",
    color: "from-amber-400 to-orange-500",
  }
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-space transition-colors duration-300 min-h-screen">
      {/* Background Mystical Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-40 dark:opacity-30 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-mystic-800/40 via-purple-500/10 to-transparent blur-[120px] dark:mix-blend-screen" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-32 pb-24 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full text-center space-y-6 mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mystic-50 dark:bg-mystic-800/20 border border-mystic-100 dark:border-mystic-500/20 text-mystic-800 dark:text-mystic-100 text-sm font-semibold mb-6 shadow-sm dark:shadow-inner">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Divine AI Astrology & Kundli</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6 leading-tight">
            Discover Your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-gold-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Cosmic Blueprint
            </span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Experience 100% precise Vedic mathematics combined with deeply personalized, hallucination-free AI interpretations in English and Hindi.
          </p>
        </motion.div>

        {/* Feature Navigation Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-5xl mx-auto">
          {CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
            >
              <Link href={card.href} className="block group">
                <div className="relative p-8 rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-neutral-200 dark:border-white/10 hover:border-mystic-500/50 transition-all duration-300 h-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 dark:group-hover:opacity-10" />
                  
                  <div className={"w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br " + card.color}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="w-full border-t border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-black/40 backdrop-blur-md py-8 relative z-10 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 font-medium text-sm">
            Divine Astrology AI &copy; 2026
          </div>
          <div className="flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-500">
            <span className="hover:text-gold-400 transition-colors cursor-pointer">Panchang</span>
            <span className="hover:text-gold-400 transition-colors cursor-pointer">Daily Horoscope</span>
            <span className="hover:text-gold-400 transition-colors cursor-pointer">Premium</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
