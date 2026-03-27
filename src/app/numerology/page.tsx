"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function Numerology() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ lifePath: number; destiny: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const generateReadingMutation = trpc.astrology.generateNumerologyReading.useMutation({
    onError: (err: any) => toast.error("AI Reading failed: " + err.message)
  });

  const handleGetDetailedReading = () => {
    if (!result || !name) return;
    generateReadingMutation.mutate({
      name,
      lifePath: result.lifePath,
      destiny: result.destiny,
      language
    });
  };

  // Auto calculate Numerology numbers locally
  const calculateNumerology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) return;
    
    setIsCalculating(true);

    // Simulate a tiny delay for the premium "calculating" feel
    setTimeout(() => {
      // Precise Numerology Life Path (Sum of Day, Month, Year separately)
      const [year, month, day] = dob.split("-");
      const reduceToSingleDigit = (num: string) => {
        let sum = num.split("").reduce((a, b) => a + parseInt(b), 0);
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
          sum = sum.toString().split("").reduce((a, b) => a + parseInt(b), 0);
        }
        return sum;
      };

      const daySum = reduceToSingleDigit(day);
      const monthSum = reduceToSingleDigit(month);
      const yearSum = reduceToSingleDigit(year);

      let lifePathSum = daySum + monthSum + yearSum;
      while (lifePathSum > 9 && lifePathSum !== 11 && lifePathSum !== 22 && lifePathSum !== 33) {
        lifePathSum = lifePathSum.toString().split("").reduce((a, b) => a + parseInt(b), 0);
      }

      // Destiny / Expression (sum of letters in Name based on Pythagorean system)
      const pythagorean: Record<string, number> = {
        a:1,j:1,s:1, b:2,k:2,t:2, c:3,l:3,u:3, d:4,m:4,v:4,
        e:5,n:5,w:5, f:6,o:6,x:6, g:7,p:7,y:7, h:8,q:8,z:8, i:9,r:9
      };
      const nameStr = name.toLowerCase().replace(/[^a-z]/g, "");
      let destinySum = nameStr.split("").reduce((acc, char) => acc + (pythagorean[char] || 0), 0);
      while (destinySum > 9 && destinySum !== 11 && destinySum !== 22 && destinySum !== 33) {
        destinySum = destinySum.toString().split("").reduce((acc, digit) => acc + parseInt(digit), 0);
      }

      setResult({ lifePath: lifePathSum, destiny: destinySum });
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <main className="flex-1 flex flex-col relative min-h-screen bg-white dark:bg-space transition-colors overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-6 pt-12 pb-24 relative z-10 flex-1 flex flex-col">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-amber-500 dark:text-neutral-400 dark:hover:text-amber-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4">
            Cosmic <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Numerology</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Discover your core numbers. We automatically calculate your Life Path from your birth date, and your Destiny number from your full name.
          </p>
        </motion.div>

        <div className="w-full max-w-md mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/5 blur-3xl -z-10 rounded-full" />
          
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-2xl rounded-3xl p-8">
            <form onSubmit={calculateNumerology} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Full Name at Birth</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Albert Doe"
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-900 dark:text-white transition-all placeholder-neutral-400 dark:placeholder-neutral-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Date of Birth</label>
                <div className="relative">
                  <input 
                    type="date" 
                    required
                    value={dob}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-900 dark:text-white transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                  />
                  <p className="text-xs text-neutral-500 mt-2">Click anywhere in the box to select your exact birth date.</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isCalculating}
                className="w-full relative group overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 transition-transform group-hover:scale-105" />
                <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold tracking-wide">
                  {isCalculating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Aligning stars...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Calculate My Numbers</>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 text-center">
                <h4 className="text-amber-600 dark:text-amber-400 font-semibold mb-2">Life Path Number</h4>
                <div className="text-6xl font-black text-amber-900 dark:text-amber-50 mb-4">{result.lifePath}</div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Represents the core essence of your journey and fundamental traits you were born with.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 text-center">
                <h4 className="text-orange-600 dark:text-orange-400 font-semibold mb-2">Destiny Number</h4>
                <div className="text-6xl font-black text-orange-900 dark:text-orange-50 mb-4">{result.destiny}</div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Reveals your ultimate goals, life purpose, and what you are meant to achieve.
                </p>
              </div>
            </div>

            {/* AI Reading CTA / Display */}
            <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden group">
              {generateReadingMutation.data ? (
                <div className="relative z-10 text-left prose prose-invert max-w-none prose-p:text-neutral-300 prose-headings:text-white prose-strong:text-amber-400">
                  <ReactMarkdown>{generateReadingMutation.data.reading}</ReactMarkdown>
                </div>
              ) : (
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">Decode Your Numbers</h3>
                  <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                    Unlock a deeply personalized, highly accurate summary of how your Life Path and Destiny numbers interact to shape your future success.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <select 
                      className="px-4 py-3 rounded-xl bg-black/50 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                    >
                      <option value="en">English Reading</option>
                      <option value="hi">हिंदी (Hindi) Reading</option>
                    </select>
                    <button 
                      onClick={handleGetDetailedReading}
                      disabled={generateReadingMutation.isPending}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:scale-105 transition-transform shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                      {generateReadingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                      {generateReadingMutation.isPending ? "Decrypting Destiny..." : "Unlock Full Reading (Pro)"}
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
