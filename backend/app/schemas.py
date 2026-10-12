from typing import List, Optional
from pydantic import BaseModel, Field


class WorkExperienceItem(BaseModel):
    role: str = Field(description="Role / Job Title")
    company: str = Field(description="Company or Organization")
    duration: Optional[str] = Field(default="", description="Dates or duration")
    location: Optional[str] = Field(default="", description="Job location")
    bullets: List[str] = Field(description="Action-oriented tailored achievement bullet points")


class ProjectItem(BaseModel):
    name: str = Field(description="Project Name")
    technologies: Optional[str] = Field(default="", description="Tech stack used")
    bullets: List[str] = Field(description="Key bullet points demonstrating impact")


class EducationItem(BaseModel):
    institution: str = Field(description="University or School")
    degree: str = Field(description="Degree or Certification")
    year: Optional[str] = Field(default="", description="Year or duration")
    details: Optional[str] = Field(default="", description="GPA, honors, or highlights")


class ResumeSections(BaseModel):
    name: str = Field(default="", description="Candidate full name")
    contact_info: str = Field(default="", description="Email, phone, LinkedIn, GitHub, etc.")
    summary: str = Field(description="Tailored professional summary aligned with the JD")
    skills: List[str] = Field(description="Categorized or listed skills matching JD requirements")
    experience: List[WorkExperienceItem] = Field(default_factory=list, description="Work experience")
    projects: List[ProjectItem] = Field(default_factory=list, description="Relevant technical projects")
    education: List[EducationItem] = Field(default_factory=list, description="Education details")
    certifications: Optional[List[str]] = Field(default_factory=list, description="Relevant certifications")


class SectionChange(BaseModel):
    section: str = Field(description="Section name (e.g., Summary, Experience, Skills)")
    description: str = Field(description="Clear explanation of what was altered, emphasized, or rephrased")


class CustomizationResult(BaseModel):
    match_score: int = Field(description="Estimated % match score between tailored resume and JD (0-100)")
    original_match_score: int = Field(description="Estimated % match score between original resume and JD (0-100)")
    ats_score: int = Field(description="Estimated ATS readability & keyword score (0-100)")
    matched_keywords: List[str] = Field(description="Keywords from JD successfully covered in resume")
    missing_keywords: List[str] = Field(description="Keywords/skills from JD missing from original resume that candidate could add")
    key_changes: List[SectionChange] = Field(description="Summary of key modifications made")
    tailored_resume_markdown: str = Field(description="Complete tailored resume formatted in professional Markdown")
    structured_resume: ResumeSections = Field(description="Structured resume data for clean layout rendering and doc generation")
    cover_letter: Optional[str] = Field(default="", description="A bonus tailored cover letter draft matching the JD")


class CustomizeRequest(BaseModel):
    job_description: str
    resume_text: str
    target_sections: Optional[List[str]] = Field(
        default=["Summary", "Skills", "Experience", "Projects"],
        description="Sections to specifically tailor"
    )
    generate_cover_letter: bool = Field(default=True)
