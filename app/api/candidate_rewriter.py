import os
import uuid

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.file_reader import read_document
from app.services.text_cleaner import clean_text
from app.services.metadata_extractor import extract_metadata

from app.services.rag_service import evaluate_resume
from app.services.resume_rewriter import rewrite_resume

router = APIRouter(
    prefix="/candidate",
    tags=["Candidate Resume Rewriter"]
)


@router.post("/rewrite")
def rewrite_candidate_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Analyze resume and return an ATS optimized rewritten version.
    """

    # -----------------------------
    # Save Uploaded Resume
    # -----------------------------

    os.makedirs("data/temp", exist_ok=True)

    extension = os.path.splitext(resume.filename)[1]

    file_path = os.path.join(
        "data/temp",
        f"{uuid.uuid4()}{extension}"
    )

    with open(file_path, "wb") as f:
        f.write(resume.file.read())

    try:

        # -----------------------------
        # Read Resume
        # -----------------------------

        resume_text = read_document(file_path)

        resume_text = clean_text(resume_text)

        metadata = extract_metadata(resume_text)

        # -----------------------------
        # ATS Evaluation
        # -----------------------------

        evaluation = evaluate_resume(
            job_description=job_description,
            resume_text=resume_text
        )

        if evaluation is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to evaluate resume."
            )

        # -----------------------------
        # Rewrite Resume
        # -----------------------------

        rewritten_resume = rewrite_resume(
            resume=resume_text,
            job_description=job_description,
            evaluation=evaluation
        )

        return {
            "metadata": metadata,
            "evaluation": evaluation,
            "rewritten_resume": rewritten_resume
        }

    finally:

        if os.path.exists(file_path):
            os.remove(file_path)