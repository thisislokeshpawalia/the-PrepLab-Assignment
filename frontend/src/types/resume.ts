export interface WorkExperienceItem {
  role: string;
  company: string;
  duration?: string;
  location?: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  technologies?: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
  details?: string;
}

export interface ResumeSections {
  name: string;
  contact_info: string;
  summary: string;
  skills: string[];
  experience: WorkExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications?: string[];
}

export interface SectionChange {
  section: string;
  description: string;
}

export interface CustomizationResult {
  match_score: number;
  original_match_score: number;
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  key_changes: SectionChange[];
  tailored_resume_markdown: string;
  structured_resume: ResumeSections;
  cover_letter?: string;
}

export interface ParsedResumeResponse {
  filename: string;
  size_bytes: number;
  extracted_text: string;
  character_count: number;
  word_count: number;
}
