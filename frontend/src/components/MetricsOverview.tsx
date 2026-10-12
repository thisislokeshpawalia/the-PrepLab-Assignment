"use client";

import React from "react";
import { Sparkles, Target, ShieldCheck, ArrowUpRight } from "lucide-react";

interface MetricsOverviewProps {
  originalScore: number;
  tailoredScore: number;
  atsScore: number;
}

export function MetricsOverview({
  originalScore,
  tailoredScore,
  atsScore,
}: MetricsOverviewProps) {
  const improvement = tailoredScore - originalScore;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Tailored Match Score */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
            Tailored JD Match
          </span>
          <Target className="w-5 h-5 text-blue-200" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold">{tailoredScore}%</span>
          {improvement > 0 && (
            <span className="flex items-center text-xs font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-400/30">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{improvement}% boost
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-blue-100/90 leading-relaxed">
          Optimized alignment against technical criteria & requirements in the job description.
        </p>
      </div>

      {/* Original Match Score */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Original Match
          </span>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            {originalScore}%
          </span>
          <span className="text-xs text-slate-400">Initial keyword overlap</span>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Baseline match percentage prior to strategic rephrasing and skill hierarchy tuning.
        </p>
      </div>

      {/* ATS Readability Score */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            ATS Readability
          </span>
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {atsScore}%
          </span>
          <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">
            High ATS Pass Rate
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Standardized section headers and parsed formatting designed to pass applicant tracking filters.
        </p>
      </div>
    </div>
  );
}
