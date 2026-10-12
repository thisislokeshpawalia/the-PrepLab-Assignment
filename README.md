# Resume AI Customizer & ATS Matcher

An end-to-end full-stack web application that takes a candidate's resume (PDF or DOCX) and a target Job Description (JD), parses the content, and leverages LLMs to intelligently tailor the resume for ATS compatibility and recruiter evaluation.

Built for **ThePrepLab / Innovista Labs** Full-Stack Developer evaluation.

---

## Architecture Overview

```
                      ┌────────────────────────────┐
                      │    Next.js 16 (React 19)   │
                      │  App Router + Tailwind CSS │
                      └─────────────┬──────────────┘
                                    │
                              REST API Calls
                                    │
                                    ▼
                      ┌────────────────────────────┐
                      │       Python FastAPI       │
                      │  - PyMuPDF / python-docx   │
                      │  - ATS scoring engine      │
                      │  - ReportLab PDF / DOCX    │
                      └─────────────┬──────────────┘
                                    │
                                    ▼
                      ┌────────────────────────────┐
                      │    LLM Intelligence        │
                      │  Gemini 1.5 Flash / Groq   │
                      └────────────────────────────┘
```

---

## Features

### Core Capabilities
1. **Resume Parsing**: Seamless text extraction from `.pdf`, `.docx`, and `.txt` files with size limits (10 MB) and format verification.
2. **Job Description Alignment**: Validated JD input with instant character and token counts.
3. **Intelligent LLM Customization**:
   - Re-engineers the professional summary to align directly with the target role.
   - Highlights matching technical and leadership competencies.
   - Rephrases bullet points following the Google X-Y-Z formula (*Accomplished [X] measured by [Y] by doing [Z]*).
   - Identifies keywords covered vs. missing from the JD.
4. **Export Formats**:
   - Download tailored resume as **PDF** (custom formatted via ReportLab).
   - Download tailored resume as **Word Document (.docx)**.
   - One-click copy formatted Markdown to clipboard.

### Bonus Features Included
- **Match Score Before & After**: Shows original keyword match percentage vs. tailored match percentage with an improvement boost indicator.
- **ATS Readability Score**: Calculates ATS compliance and formatting structure rating.
- **Diff & Strategic Change Log**: Detailed audit log showing what specific adjustments were made per section.
- **Bonus Cover Letter Generator**: Generates a tailored 3-paragraph cover letter matching the job specifications.
- **Offline / Zero-Config Fallback**: Built-in mock AI engine allows testing immediately even before setting up API keys.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Python 3.11+, FastAPI, PyMuPDF (`fitz`), `python-docx`, ReportLab, Pydantic v2
- **LLM APIs**: Google Gemini (`gemini-1.5-flash`), Groq (`llama-3.3-70b-versatile`)
- **Containerization & Deployment**: Docker, Render / Railway (Backend), Vercel (Frontend)

---

## Setup & Local Run Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Open .env and add either GEMINI_API_KEY or GROQ_API_KEY (optional for demo)

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend will be available at: `http://127.0.0.1:8000`  
Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run Next.js development server
npm run dev
```
Frontend will be available at: `http://localhost:3000`

---

## Deployment Guide

### Deploying the Backend (Render / Railway)
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) connecting your repo.
3. Set the **Root Directory** to `backend`.
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Under **Environment Variables**, add `GEMINI_API_KEY` (or `GROQ_API_KEY`).
7. Copy the public backend URL (e.g. `https://resume-ai-backend.onrender.com`).

### Deploying the Frontend (Vercel)
1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Under **Environment Variables**, add:
   `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend-app.onrender.com`
4. Click **Deploy**.

---

## Known Trade-offs & Architecture Decisions
- **Token Efficiency**: Instead of sending full raw binaries to the LLM, parsing is handled natively on the backend via PyMuPDF and python-docx, reducing latency and token costs.
- **Deterministic Schema**: Responses are constrained using Pydantic and JSON mode to prevent formatting errors and guarantee clean UI rendering.
- **Fail-safe Design**: If Gemini or Groq quota is exhausted or unconfigured, the service gracefully falls back to structured analysis without crashing.
