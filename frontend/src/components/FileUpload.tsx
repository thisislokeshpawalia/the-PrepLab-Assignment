"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import { formatBytes } from "@/lib/api";

interface FileUploadProps {
  onFileParsed: (fileInfo: {
    filename: string;
    size: number;
    extractedText: string;
  }) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  setError: (msg: string | null) => void;
}

export function FileUpload({
  onFileParsed,
  isLoading,
  setIsLoading,
  setError,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    const validExtensions = [".pdf", ".docx", ".txt"];
    const extension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(extension)) {
      setError("Please upload a valid PDF (.pdf) or Word document (.docx).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds maximum allowed size (10 MB).");
      return;
    }

    setUploadedFile({ name: file.name, size: file.size });
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${backendUrl}/api/parse-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to extract text from resume.");
      }

      const data = await res.json();
      onFileParsed({
        filename: data.filename,
        size: data.size_bytes,
        extractedText: data.extracted_text,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred while parsing resume.");
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md"
            : "border-slate-300 dark:border-slate-800 hover:border-blue-400 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
          <UploadCloud className="w-7 h-7" />
        </div>

        <p className="text-base font-semibold text-slate-800 dark:text-slate-100 text-center">
          Click to upload or drag & drop resume
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
          Supports PDF, DOCX or TXT (Max 10MB)
        </p>

        {uploadedFile && (
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{uploadedFile.name}</span>
            <span className="text-emerald-600/70 dark:text-emerald-400/70">
              ({formatBytes(uploadedFile.size)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
