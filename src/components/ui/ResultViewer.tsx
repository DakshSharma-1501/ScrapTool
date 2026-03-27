"use client";

import { motion } from "framer-motion";
import { JsonViewer } from "./JsonViewer";
import { Image as ImageIcon, Link2, FileText, Info } from "lucide-react";

interface ResultViewerProps {
  data: any;
  fromCache?: boolean;
}

export function ResultViewer({ data, fromCache }: ResultViewerProps) {
  const { title, images, links, type, description, summary, author } = data;
  
  const displayTitle = title || "Untitled Page";
  const displayDesc = description || summary || "No description found.";
  const imageCount = Array.isArray(images) ? images.length : 0;
  const linkCount = Array.isArray(links) ? links.length : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-24"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 flex items-center gap-2 tracking-tight">
            <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            Extracted Overview
          </h2>
          {fromCache && (
            <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-2 py-1 rounded-full font-mono uppercase tracking-widest font-bold">
              Cached
            </span>
          )}
        </div>
        
        <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-neutral-200 dark:border-white/5 p-6 shadow-xl dark:shadow-2xl flex-1 flex flex-col transition-colors">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-300 capitalize tracking-wide">
              {type || "Generic"} Page
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 leading-tight">{displayTitle}</h3>
            {author && <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-3">By {author}</p>}
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{displayDesc}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-neutral-50 dark:bg-black/40 rounded-xl p-4 border border-neutral-100 dark:border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm dark:shadow-inner">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight leading-none">{imageCount}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Images Found</p>
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-black/40 rounded-xl p-4 border border-neutral-100 dark:border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-inner">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight leading-none">{linkCount}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Links Found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 h-[500px] lg:h-[600px]">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 flex items-center gap-2 tracking-tight">
          <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          Raw JSON Result
        </h2>
        <JsonViewer data={data} />
      </div>
    </motion.div>
  );
}
