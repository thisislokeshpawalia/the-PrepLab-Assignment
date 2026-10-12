"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Briefcase,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { MetricsOverview } from "@/components/MetricsOverview";
import { ResultViewer } from "@/components/ResultViewer";
import { CustomizationResult } from "@/types/resume";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CustomizationResult | null>(null);

  const handleFileParsed = (fileInfo: {
    filename: string;
    size: number;
    extractedText: string;
  }) => {
    setFileName(fileInfo.filename);
    setFileSize(fileInfo.size);
    setResumeText(fileInfo.extractedText);
    setError(null);
  };

  const handleTailorResume = async () => {
    setError(null);

    if (!resumeText.trim()) {
      setError("Please upload your resume before proceeding.");
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      setError(
        "Please paste a complete job description (at least 30 characters)."
      );
      return;
    }

    setIsCustomizing(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/api/customize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jobDescription,
          resume_text: resumeText,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "Failed to customize resume. Please check your inputs."
        );
      }

      const customizedData: CustomizationResult = await response.json();
      setResult(customizedData);
      
      // Smooth scroll to results
      setTimeout(() => {
        document
          .getElementById("results-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong while tailoring resume.");
    } finally {
      setIsCustomizing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                ThePrepLab AI
              </span>
              <span className="block text-[11px] font-medium text-blue-600 dark:text-blue-400">
                Resume Customizer & ATS Matcher
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              FastAPI + Next.js
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto pt-14 pb-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-5">
          <Zap className="w-3.5 h-3.5" />
          Intelligent Job-Tailored Resumes in Seconds
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Tailor Your Resume to Any{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Job Description
          </span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload your resume, paste the target job description, and let our LLM
          strategically align your experience, rephrase bullet points, and optimize ATS readability.
        </p>
      </section>

      {/* Main Form Section */}
      <section className="max-w-5xl mx-auto px-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Action Required</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Resume Upload */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold">1. Upload Resume</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Upload your current resume in PDF or DOCX format.
              </p>

              <FileUpload
                onFileParsed={handleFileParsed}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setError={setError}
              />
            </div>

            {resumeText && (
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Text Extracted
                  </span>
                  <span>{resumeText.split(/\s+/).length} words</span>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Job Description Input */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold">2. Target Job Description</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Paste the full responsibilities, qualifications, and tech stack.
              </p>

              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste Job Description here (e.g. Full-Stack Developer: Looking for 2+ years experience in React/Next.js, Python FastAPI, PostgreSQL, cloud deployments...)"
                  rows={8}
                  className="w-full p-4 rounded-xl text-xs md:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 resize-none transition-all"
                />
                <span className="absolute bottom-3 right-3 text-[11px] text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded">
                  {jobDescription.length} chars
                </span>
              </div>
            </div>

            <button
              onClick={handleTailorResume}
              disabled={isCustomizing || isLoading}
              className="mt-4 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99]"
            >
              {isCustomizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing & Tailoring Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Customize Resume with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div id="results-section" className="mt-14 space-y-8 scroll-mt-24">
            <div className="text-center">
              <h2 className="text-2xl font-black">Optimization Analysis & Tailored Results</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Review your ATS match scores, strategic bullet adjustments, and export files.
              </p>
            </div>

            <MetricsOverview
              originalScore={result.original_match_score}
              tailoredScore={result.match_score}
              atsScore={result.ats_score}
            />

            <ResultViewer result={result} originalText={resumeText} />
          </div>
        )}
      </section>
    </main>
  );
}
