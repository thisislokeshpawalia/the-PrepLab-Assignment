import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Customizer | ThePrepLab",
  description:
    "Intelligently tailor your resume for any Job Description with AI ATS matching, score analysis, and instant PDF/DOCX downloads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
