"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MoonStar, ArrowLeft, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function KundliPage() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    place: "",
  });
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const resultRef = useRef<HTMLDivElement>(null);

  const generateKundliMutation = trpc.astrology.generateKundli.useMutation({
    onSuccess: () => {
      toast.success("Kundli generated successfully!");
      setTimeout(() => {
         resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    },
    onError: (err: any) => {
      toast.error("Failed to generate Kundli: " + err.message);
    }
  });

  const generateDetailedMutation = trpc.astrology.generateDetailedKundliReading.useMutation({
    onError: (err: any) => toast.error("AI Reading failed: " + err.message)
  });

  const generateBasicMutation = trpc.astrology.generateBasicKundliReading.useMutation({
    onError: (err: any) => toast.error("Basic Reading failed: " + err.message)
  });

  const handleGetBasicReading = () => {
    if (!generateKundliMutation.data?.chart) return;
    generateBasicMutation.mutate({
      chartData: generateKundliMutation.data.chart,
      language
    });
  };

  const handleGetDetailedReading = () => {
    if (!generateKundliMutation.data?.chart) return;
    generateDetailedMutation.mutate({
      chartData: generateKundliMutation.data.chart,
      language
    });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.time || !formData.place) {
      toast.error("Please fill all details to generate an accurate Kundli.");
      return;
    }
    
    generateKundliMutation.mutate({
      name: formData.name,
      date: formData.date,
      time: formData.time,
      place: formData.place
    });
  };

  return (
    <main className="flex-1 flex flex-col relative min-h-screen bg-white dark:bg-space transition-colors overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/10 via-indigo-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-6 pt-12 pb-24 relative z-10 flex-1 flex flex-col">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-purple-500 dark:text-neutral-400 dark:hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-300 text-sm font-semibold mb-6 shadow-sm">
            <MoonStar className="w-4 h-4" />
            <span>Divine Calculations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4">
            Free <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Janam Kundli</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Enter your exact birth details below to generate your 100% precise Vedic astrological chart and planetary positions.
          </p>
        </motion.div>

        {!generateKundliMutation.data && (
          <div className="w-full max-w-xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/5 blur-3xl -z-10 rounded-full" />
            
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-2xl rounded-3xl p-8">
              <form onSubmit={handleCalculate} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Date of Birth</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-neutral-900 dark:text-white transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Time of Birth</label>
                    <input 
                      type="time" 
                      required
                      value={formData.time}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-neutral-900 dark:text-white transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Place of Birth (City)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. New Delhi, India"
                    value={formData.place}
                    onChange={e => setFormData({ ...formData, place: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-neutral-900 dark:text-white"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={generateKundliMutation.isPending}
                  className="w-full mt-4 relative group overflow-hidden rounded-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 transition-transform group-hover:scale-105" />
                  <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold tracking-wide">
                    {generateKundliMutation.isPending ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Calculating Degrees...</>
                    ) : (
                      <>Generate Free Kundli</>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Results View */}
        {generateKundliMutation.data && (
          <div ref={resultRef} className="w-full animate-in fade-in duration-500 mt-8">
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-2xl rounded-3xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200 dark:border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-gold-500" />
                    Natal Chart Details
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 mt-1">Calculated for {formData.name}</p>
                </div>
                <button 
                  onClick={() => generateKundliMutation.reset()}
                  className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 text-sm hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                >
                  New Chart
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Lagna (Ascendant)</h3>
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-neutral-500">Sign</span>
                      <span className="font-bold text-neutral-900 dark:text-white uppercase">{generateKundliMutation.data.chart.lagna?.signName || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-neutral-500">Degree</span>
                      <span className="text-neutral-900 dark:text-white">{generateKundliMutation.data.chart.lagna?.degreeInSign?.toFixed(2) || '0'}°</span>
                    </div>
                  </div>
                </div>

                {/* Planets Overview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Planetary Positions</h3>
                  <div className="rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-100 dark:bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-neutral-500">Planet</th>
                          <th className="px-4 py-3 text-left font-medium text-neutral-500">Sign</th>
                          <th className="px-4 py-3 text-right font-medium text-neutral-500">Degree</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateKundliMutation.data.chart.planets?.map((p: any, idx: number) => (
                          <tr key={idx} className="border-t border-neutral-100 dark:border-white/5">
                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white capitalize">{p.name}</td>
                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{p.signName}</td>
                            <td className="px-4 py-3 text-right text-neutral-600 dark:text-neutral-300">{p.degreeInSign?.toFixed(2)}°</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Advanced AI Reading CTA / Results */}
              <div className="mt-12 p-8 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden group">
                
                {generateDetailedMutation.data ? (
                  <div className="relative z-10 text-left prose prose-invert max-w-none prose-p:text-purple-100 prose-headings:text-white prose-strong:text-purple-300">
                    <ReactMarkdown>{generateDetailedMutation.data.reading}</ReactMarkdown>
                  </div>
                ) : generateBasicMutation.data ? (
                  <div className="relative z-10 text-left prose prose-invert max-w-none prose-p:text-neutral-300 prose-headings:text-white prose-strong:text-neutral-200">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-neutral-800 pb-2">Free Basic Summary</h3>
                    <ReactMarkdown>{generateBasicMutation.data.reading}</ReactMarkdown>
                    
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-center">
                       <h4 className="text-lg font-bold text-white mb-2">Unlock Your Full Destiny (Pro)</h4>
                       <p className="text-purple-200 mb-4 text-sm">Get detailed year-wise predictions, Vimshottari Dasha analysis, and precise remedies.</p>
                       <button 
                          onClick={handleGetDetailedReading}
                          disabled={generateDetailedMutation.isPending}
                          className="px-6 py-2 rounded-xl bg-white text-purple-900 font-bold hover:scale-105 transition-transform disabled:opacity-50 inline-flex items-center gap-2"
                        >
                          {generateDetailedMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {generateDetailedMutation.isPending ? "Consulting Stars..." : "Unlock Detailed Pro Reading"}
                        </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">Discover Your Future</h3>
                    <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                      Choose a quick basic summary for your core personality, or unlock a deep predictive reading with year-wise analysis and dosha remedies.
                    </p>

                    <div className="flex justify-center mb-6">
                      <select 
                        className="px-4 py-2 rounded-xl bg-black/50 border border-neutral-700 text-white focus:outline-none focus:border-purple-500"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                      >
                        <option value="en">English Reading</option>
                        <option value="hi">हिंदी (Hindi) Reading</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {/* Basic CTA */}
                      <button 
                        onClick={handleGetBasicReading}
                        disabled={generateBasicMutation.isPending || generateDetailedMutation.isPending}
                        className="px-6 py-4 rounded-xl bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-neutral-700"
                      >
                        {generateBasicMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {generateBasicMutation.isPending ? "Generating..." : "Get Free Basic Summary"}
                      </button>

                      {/* Detailed CTA */}
                      <button 
                        onClick={handleGetDetailedReading}
                        disabled={generateDetailedMutation.isPending || generateBasicMutation.isPending}
                        className="px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-105 transition-transform shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {generateDetailedMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {generateDetailedMutation.isPending ? "Consulting Stars..." : "Get Detailed AI Reading (Pro)"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
