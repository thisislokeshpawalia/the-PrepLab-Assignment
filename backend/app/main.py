import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

from app.schemas import CustomizationResult, CustomizeRequest, ResumeSections
from app.services.parser import parse_resume
from app.services.llm import customize_resume
from app.services.exporter import export_resume_to_pdf, export_resume_to_docx

load_dotenv()

app = FastAPI(
    title="Resume AI Customizer API",
    description="Backend service for parsing resumes, intelligent LLM tailoring, ATS scoring, and formatted document exports.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local and cloud deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Resume AI Customizer API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
def health_check():
    has_gemini = bool(os.getenv("GEMINI_API_KEY"))
    has_groq = bool(os.getenv("GROQ_API_KEY"))
    return {
        "status": "healthy",
        "llm_providers": {
            "gemini": has_gemini,
            "groq": has_groq,
            "fallback_mock": not (has_gemini or has_groq)
        }
    }


@app.post("/api/parse-resume")
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """Extracts raw text from an uploaded resume (PDF or DOCX)."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    
    # 10 MB limit check
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds the 10MB limit.")
    
    extracted_text = parse_resume(file.filename, file_bytes)
    return {
        "filename": file.filename,
        "size_bytes": len(file_bytes),
        "extracted_text": extracted_text,
        "character_count": len(extracted_text),
        "word_count": len(extracted_text.split())
    }


@app.post("/api/customize", response_model=CustomizationResult)
async def customize_resume_endpoint(req: CustomizeRequest):
    """Analyzes resume and job description using LLM and returns structured tailored output."""
    if not req.job_description.strip() or len(req.job_description.strip()) < 30:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short. Please provide at least 30 characters of context."
        )
    if not req.resume_text.strip() or len(req.resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Resume text is too short. Please ensure your resume contains enough work context."
        )
    
    try:
        result = customize_resume(req.job_description, req.resume_text)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Customization error: {str(e)}"
        )


@app.post("/api/export/pdf")
async def export_pdf_endpoint(resume: ResumeSections):
    """Streams a formatted PDF download of the tailored resume."""
    try:
        pdf_stream = export_resume_to_pdf(resume)
        filename = f"Tailored_Resume_{resume.name.replace(' ', '_') or 'Document'}.pdf"
        return StreamingResponse(
            pdf_stream,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")


@app.post("/api/export/docx")
async def export_docx_endpoint(resume: ResumeSections):
    """Streams a formatted DOCX download of the tailored resume."""
    try:
        docx_stream = export_resume_to_docx(resume)
        filename = f"Tailored_Resume_{resume.name.replace(' ', '_') or 'Document'}.docx"
        return StreamingResponse(
            docx_stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Word document: {str(e)}")
