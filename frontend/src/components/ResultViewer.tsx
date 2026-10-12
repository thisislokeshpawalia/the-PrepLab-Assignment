"use client";

import React, { useState } from "react";
import { Download, Copy, Check, FileDown, Layers, FileText } from "lucide-react";
import { CustomizationResult, ResumeSections } from "@/types/resume";

interface ResultViewerProps {
  result: CustomizationResult;
  originalText: string;
}

export function ResultViewer({ result, originalText }: ResultViewerProps) {
  const [activeTab, setActiveTab] = useState<"tailored" | "diff" | "coverLetter" | "changes">("tailored");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.tailored_resume_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = async (format: "pdf" | "docx") => {
    try {
      setDownloading(format);
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.structured_resume),
      });

      if (!response.ok) throw new Error(`Failed to generate ${format.toUpperCase()}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Tailored_Resume_${result.structured_resume.name.replace(/\s+/g, "_") || "Candidate"}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Could not download ${format.toUpperCase()}. Please try again.`);
    } finally {
      setDownloading(null);
    }
  };

  const resume = result.structured_resume;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 gap-4 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("tailored")}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === "tailored"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
            }`}
          >
            Tailored Resume
          </button>
          <button
            onClick={() => setActiveTab("diff")}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === "diff"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
            }`}
          >
            Diff / Changes
          </button>
          {result.cover_letter && (
            <button
              onClick={() => setActiveTab("coverLetter")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                activeTab === "coverLetter"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
              }`}
            >
              Cover Letter
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Markdown
              </>
            )}
          </button>

          <button
            onClick={() => downloadFile("pdf")}
            disabled={downloading === "pdf"}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading === "pdf" ? "Exporting..." : "Download PDF"}
          </button>

          <button
            onClick={() => downloadFile("docx")}
            disabled={downloading === "docx"}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5" />
            {downloading === "docx" ? "Exporting..." : "Download DOCX"}
          </button>
        </div>
      </div>

      {/* Keywords Insights Bar */}
      <div className="p-6 bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Matched JD Keywords ({result.matched_keywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {result.matched_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg font-medium"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              Missing Target Keywords to Consider ({result.missing_keywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {result.missing_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs rounded-lg font-medium"
                >
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        {activeTab === "tailored" && (
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm font-sans space-y-6">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5 text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                {resume.name || "Candidate Name"}
              </h1>
              {resume.contact_info && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {resume.contact_info}
                </p>
              )}
            </div>

            {/* Summary */}
            {resume.summary && (
              <div>
                <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase border-b border-blue-100 dark:border-blue-900/40 pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {resume.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase border-b border-blue-100 dark:border-blue-900/40 pb-1 mb-2">
                  Technical Skills & Competencies
                </h2>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {resume.skills.join(" • ")}
                </p>
              </div>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <div>
                <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase border-b border-blue-100 dark:border-blue-900/40 pb-1 mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex flex-wrap items-baseline justify-between text-sm">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {exp.role} — <span className="font-semibold text-slate-600 dark:text-slate-300">{exp.company}</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          {exp.duration} {exp.location ? `| ${exp.location}` : ""}
                        </span>
                      </div>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx} className="pl-1">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase border-b border-blue-100 dark:border-blue-900/40 pb-1 mb-3">
                  Key Projects
                </h2>
                <div className="space-y-4">
                  {resume.projects.map((proj, i) => (
                    <div key={i}>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {proj.name}{" "}
                        {proj.technologies && (
                          <span className="font-normal text-xs text-blue-600 dark:text-blue-400">
                            [{proj.technologies}]
                          </span>
                        )}
                      </div>
                      <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                        {proj.bullets.map((b, idx) => (
                          <li key={idx} className="pl-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <div>
                <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase border-b border-blue-100 dark:border-blue-900/40 pb-1 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {resume.education.map((edu, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                        <span>{edu.degree} — {edu.institution}</span>
                        <span className="text-xs font-normal text-slate-500">{edu.year}</span>
                      </div>
                      {edu.details && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">{edu.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "diff" && (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                Key Strategic Changes & Enhancements
              </h3>
              <div className="space-y-3">
                {result.key_changes.map((change, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs md:text-sm"
                  >
                    <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">
                      [{change.section}]
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {change.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Original Uploaded Resume
                </h4>
                <div className="max-h-96 overflow-y-auto text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {originalText}
                </div>
              </div>

              <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                  Tailored Resume Output (Markdown)
                </h4>
                <div className="max-h-96 overflow-y-auto text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap p-3 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50">
                  {result.tailored_resume_markdown}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "coverLetter" && result.cover_letter && (
          <div className="max-w-3xl mx-auto p-8 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Tailored Cover Letter
            </h3>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
              {result.cover_letter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
