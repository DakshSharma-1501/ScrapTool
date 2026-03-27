"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface JsonViewerProps {
  data: any;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("JSON copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#050505] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-[#f1f5f9] dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80"></div>
          </div>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-500 tracking-wider">response.json</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/5 rounded-md transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-green-500 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/5 rounded-md transition-colors"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="text-sm font-mono text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <code dangerouslySetInnerHTML={{
            __html: jsonString
              .replace(/(".*?"):/g, `<span class="text-indigo-600 dark:text-indigo-300">$1</span>:`)
              .replace(/: (".*?")/g, `: <span class="text-blue-600 dark:text-blue-300">$1</span>`)
              .replace(/: (true|false|null|[0-9]+)/g, `: <span class="text-emerald-600 dark:text-emerald-400">$1</span>`)
          }} />
        </pre>
      </div>
    </div>
  );
}
