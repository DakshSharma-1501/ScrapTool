"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-sm border border-neutral-200 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-white/10 hover:shadow-xl dark:hover:bg-[#111111]/80 transition-all group flex flex-col"
    >
      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-5 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors shadow-sm dark:shadow-inner">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3 tracking-tight">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}
