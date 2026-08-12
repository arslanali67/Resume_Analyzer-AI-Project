from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.database import initialize_database


# ============================================================
# Routers
# ============================================================

from app.api.dashboard import router as dashboard_router
from app.api.comparison import router as comparison_router
from app.api.candidate_portal import router as candidate_portal_router
from app.api.history import router as history_router
from app.api.job_history import router as job_history_router
from app.api.routes import router
from app.api.upload import router as upload_router
from app.api.evaluation import router as evaluation_router
from app.api.candidates import router as candidates_router
from app.api.job_description import router as job_router
from app.api import reports

from app.api.candidate_rewriter import (
    router as candidate_rewriter_router
)

from app.api.download_resume import (
    router as download_resume_router
)


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="AI Resume Analyzer API",
    description="""
AI-powered Resume Screening and Candidate Ranking System.

Features:

- Upload PDF/DOCX resumes
- Upload multiple resumes
- Upload ZIP folders containing resumes
- Automatic duplicate detection
- Resume metadata extraction
- Hybrid Search (Chroma + BM25)
- AI-powered resume evaluation
- Candidate management
- ATS resume rewriting
- ATS-friendly PDF resume generation
- Resume PDF download
- Excel report generation
""",
    version="1.0.0",
)


# ============================================================
# Database Initialization
# ============================================================

initialize_database()


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Basic Routes
# ============================================================

app.include_router(router)


# ============================================================
# Upload APIs
# ============================================================

app.include_router(upload_router)


# ============================================================
# Resume Evaluation APIs
# ============================================================

app.include_router(evaluation_router)


# ============================================================
# Candidate Management APIs
# ============================================================

app.include_router(candidates_router)


# ============================================================
# Dashboard / Comparison / History / Job APIs
# ============================================================

app.include_router(dashboard_router)

app.include_router(comparison_router)

app.include_router(job_history_router)

app.include_router(history_router)

app.include_router(job_router)

app.include_router(reports.router)


# ============================================================
# Candidate Portal
#
# This router now handles the complete pipeline:
#
# Upload Resume
#       ↓
# Extract Text
#       ↓
# Clean Text
#       ↓
# Metadata
#       ↓
# ATS Evaluation
#       ↓
# Resume Rewrite
#       ↓
# PDF Generation
#       ↓
# Return JSON + PDF URL
# ============================================================

app.include_router(candidate_portal_router)


# ============================================================
# Candidate Resume Rewriter
#
# Keeps the separate /candidate/rewrite endpoint available.
# ============================================================

app.include_router(candidate_rewriter_router)


# ============================================================
# Resume PDF Download
#
# Keeps the dedicated download endpoint available if
# download_resume.py contains additional download functionality.
# ============================================================

app.include_router(download_resume_router)