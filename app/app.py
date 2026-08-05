from fastapi import FastAPI
from app.services.database import initialize_database
# Routers
from app.api.routes import router
from app.api.upload import router as upload_router
from app.api.evaluation import router as evaluation_router
from app.api.candidates import router as candidates_router
from app.api import reports


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
- Excel report generation
""",
    version="1.0.0",
)

initialize_database()

# -------------------------------
# Basic Routes
# -------------------------------

app.include_router(router)

# -------------------------------
# Upload APIs
# -------------------------------

app.include_router(upload_router)

# -------------------------------
# Resume Evaluation APIs
# -------------------------------

app.include_router(evaluation_router)

# -------------------------------
# Candidate APIs
# -------------------------------

app.include_router(candidates_router)

# -------------------------------
# Reports APIs
# -------------------------------

app.include_router(reports.router)