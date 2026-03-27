"use client";

import { useState, useRef } from "react";
import { trpc } from "@/trpc/client";
import { motion } from "framer-motion";
import { Bot, Zap, Globe2, Code2 } from "lucide-react";
import { toast } from "sonner";

import { UrlInput } from "@/components/ui/UrlInput";
import { ResultViewer } from "@/components/ui/ResultViewer";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Loader } from "@/components/ui/Loader";

const FEATURES = [
  {
    icon: Bot,
    title: "AI Powered Extraction",
    description: "Our Gemini models intelligently parse the DOM and extract exactly what you need without strict CSS selectors."
  },
  {
    icon: Globe2,
    title: "Works on Any Website",
    description: "From simple semantic blogs to complex JS-heavy single page applications, our multi-layered approach guarantees successful data access."
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Tiered proxy fallbacks ensure we only use headless browsers when absolutely necessary for maximum performance."
  },
  {
    icon: Code2,
    title: "Clean JSON Output",
    description: "Get pristine, rigorously structured JSON output ready to be piped directly into your existing databases or applications."
  }
];

export default function Home() {
  const [url, setUrl] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  
  const scrapeMutation = trpc.scraper.scrapeUrl.useMutation({
    onError: (err) => {
      toast.error(err.message || "Failed to scrape the website.");
    },
    onSuccess: () => {
      toast.success("Data extracted successfully!");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });

  const handleScrape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    scrapeMutation.mutate({ url });
  };

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-[#000000] transition-colors duration-300">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-indigo-500/40 via-blue-500/20 to-transparent blur-[120px] dark:mix-blend-screen" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-32 pb-24 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-6 shadow-sm dark:shadow-inner">
            <SparklesIcon />
            <span>AI Web Parsing API</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6">
            Turn Any Website into <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 dark:from-indigo-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
              Structured Data
            </span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Paste a URL and instantly extract clean JSON using our intelligent scraping pipeline powered by Gemini.
          </p>
        </motion.div>

        <UrlInput 
          url={url} 
          setUrl={setUrl} 
          onSubmit={handleScrape} 
          isLoading={scrapeMutation.isPending} 
        />

        {scrapeMutation.isPending && (
          <div className="mt-20 w-full animate-in fade-in duration-300">
            <Loader />
          </div>
        )}

        <div ref={resultRef} className="w-full scroll-mt-24">
          {scrapeMutation.isSuccess && scrapeMutation.data?.data && (
            <ResultViewer 
              data={scrapeMutation.data.data} 
              fromCache={scrapeMutation.data.fromCache} 
            />
          )}
        </div>

        {!scrapeMutation.data && !scrapeMutation.isPending && (
          <div className="w-full mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="absolute -top-16 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent" />
            
            {FEATURES.map((feature, idx) => (
              <FeatureCard 
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.2 + idx * 0.1}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="w-full border-t border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#030303] py-8 relative z-10 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
            DataExtractor AI &copy; 2026
          </div>
          <div className="flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-500">
            <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors">Documentation</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors">API Reference</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
    </svg>
  );
}
