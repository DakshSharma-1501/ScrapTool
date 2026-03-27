"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import ReactMarkdown from "react-markdown";

export default function MatchmakingPage() {
  const [boyData, setBoyData] = useState({ name: "", date: "", time: "", place: "" });
  const [girlData, setGirlData] = useState({ name: "", date: "", time: "", place: "" });
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  const generateMatchMutation = trpc.astrology.generateMatchmaking.useMutation({
    onSuccess: () => toast.success("Compatibility calculated successfully!"),
    onError: (err: any) => toast.error("Calculation failed: " + err.message)
  });

  const generateDetailedMutation = trpc.astrology.generateDetailedMatchmakingReading.useMutation({
    onError: (err: any) => toast.error("AI Reading failed: " + err.message)
  });

  const handleGetDetailedReading = () => {
    if (!generateMatchMutation.data) return;
    generateDetailedMutation.mutate({
      boyChart: generateMatchMutation.data.boyChart,
      girlChart: generateMatchMutation.data.girlChart,
      score: generateMatchMutation.data.score,
      language
    });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boyData.name || !girlData.name) {
      toast.error("Please fill required fields.");
      return;
    }
    generateMatchMutation.mutate({ boy: boyData, girl: girlData });
  };

  return (
    <main className="flex-1 flex flex-col relative min-h-screen bg-white dark:bg-space transition-colors overflow-hidden">
      <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-gradient-to-bl from-pink-500/10 via-rose-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6 pt-12 pb-24 relative z-10 flex-1 flex flex-col">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-pink-500 dark:text-neutral-400 dark:hover:text-pink-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4">
            Kundli <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Matchmaking</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover your 36 Guna Milan compatibility using exact planetary positions to ensure a harmonious future.
          </p>
        </motion.div>

        <form onSubmit={handleCalculate} className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Boy's Details */}
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-xl rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                Boy's Details
              </h2>
              <div className="space-y-5">
                <input type="text" placeholder="Full Name" required value={boyData.name} onChange={e => setBoyData({...boyData, name: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-pink-500 dark:text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Date of Birth</label>
                    <input 
                      type="date" 
                      required
                      value={boyData.date}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={e => setBoyData({ ...boyData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-pink-500 text-neutral-900 dark:text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Time of Birth</label>
                    <input 
                      type="time" 
                      required
                      value={boyData.time}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={e => setBoyData({ ...boyData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-pink-500 text-neutral-900 dark:text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                </div>
                <input type="text" placeholder="Birth City" required value={boyData.place} onChange={e => setBoyData({...boyData, place: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-pink-500 dark:text-white" />
              </div>
            </div>

            {/* Girl's Details */}
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-xl rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                Girl's Details
              </h2>
              <div className="space-y-5">
                <input type="text" placeholder="Full Name" required value={girlData.name} onChange={e => setGirlData({...girlData, name: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-pink-500 dark:text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Date of Birth</label>
                    <input 
                      type="date" 
                      required
                      value={girlData.date}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={e => setGirlData({ ...girlData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-pink-500 text-neutral-900 dark:text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Time of Birth</label>
                    <input 
                      type="time" 
                      required
                      value={girlData.time}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={e => setGirlData({ ...girlData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-pink-500 text-neutral-900 dark:text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                </div>
                <input type="text" placeholder="Birth City" required value={girlData.place} onChange={e => setGirlData({...girlData, place: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-pink-500 dark:text-white" />
              </div>
            </div>

          </div>

          <div className="mt-12 max-w-md mx-auto">
            <button 
              type="submit" 
              disabled={generateMatchMutation.isPending}
              className="w-full relative group overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 transition-transform group-hover:scale-105" />
              <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold tracking-wide">
                {generateMatchMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Cross-Matching Stars...</>
                ) : (
                  <><HeartHandshake className="w-5 h-5" /> Calculate Compatibility</>
                )}
              </div>
            </button>
          </div>
        </form>

        {generateMatchMutation.data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto mt-16 p-8 rounded-3xl bg-pink-50 dark:bg-[#1a0f14] border border-pink-200 dark:border-pink-500/20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <h3 className="text-xl font-bold text-pink-500 dark:text-pink-400 mb-2">Ashtakoota Guna Milan Score</h3>
            <div className="text-7xl font-black text-pink-600 dark:text-pink-500 mb-4 tracking-tighter">
              {generateMatchMutation.data.score} <span className="text-3xl text-pink-400 dark:text-pink-700">/ 36</span>
            </div>
            <div className="inline-block px-4 py-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 font-semibold mb-8">
              {generateMatchMutation.data.conclusion}
            </div>

            {/* Advanced AI Reading CTA / Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white relative group shadow-xl overflow-hidden mt-8 text-left">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
              
              {generateDetailedMutation.data ? (
                 <div className="relative z-10 prose prose-invert max-w-none prose-headings:text-white prose-p:text-pink-50 prose-strong:text-pink-200">
                    <ReactMarkdown>{generateDetailedMutation.data.reading}</ReactMarkdown>
                 </div>
              ) : (
                <div className="relative z-10 text-center">
                  <h4 className="text-xl font-bold mb-2">Unlock Detailed Future Prediction</h4>
                  <p className="text-pink-100 mb-6 max-w-lg mx-auto text-sm">
                    Get a highly accurate, AI-generated reading analyzing the Manglik doshas, financial prospects, and emotional harmony of this exact planetary match.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <select 
                      className="px-4 py-2 rounded-xl bg-black/50 border border-pink-400/30 text-white focus:outline-none focus:border-pink-300"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                    >
                      <option value="en">English Prediction</option>
                      <option value="hi">हिंदी (Hindi) Prediction</option>
                    </select>
                    <button 
                      onClick={handleGetDetailedReading}
                      disabled={generateDetailedMutation.isPending}
                      className="px-6 py-2 rounded-xl bg-white text-pink-600 font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                    >
                      {generateDetailedMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                      {generateDetailedMutation.isPending ? "Reading Destiny..." : "Read Detailed Future (Pro)"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}
