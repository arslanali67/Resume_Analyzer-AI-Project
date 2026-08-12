import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from app.services.ats_service import analyze_resume
from app.services.resume_rewriter import rewrite_resume
from app.services.resume_generator import generate_resume_pdf


# ============================================================
# Router
# ============================================================

router = APIRouter(
    prefix="/candidate",
    tags=["Candidate Portal"],
)


# ============================================================
# Temporary Upload Folder
# ============================================================

UPLOAD_FOLDER = "data/temp"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True,
)


# ============================================================
# Candidate Resume Analysis
# ============================================================

@router.post("/analyze")
def analyze_candidate_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    """
    Complete candidate resume pipeline.

    Flow:

    1. Upload resume
    2. Read resume
    3. Clean resume text
    4. Extract metadata
    5. Perform ATS evaluation
    6. Rewrite resume
    7. Generate ATS-friendly PDF
    8. Return analysis, rewritten resume, and PDF URL
    """

    # ========================================================
    # Validate Resume File
    # ========================================================

    if not resume.filename:
        raise HTTPException(
            status_code=400,
            detail="Resume file is required.",
        )

    extension = os.path.splitext(
        resume.filename
    )[1].lower()

    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt",
    }

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF, DOCX, and TXT files "
                "are supported."
            ),
        )

    # ========================================================
    # Validate Job Description
    # ========================================================

    if not job_description or not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description is required.",
        )

    # ========================================================
    # Create Temporary File
    # ========================================================

    filename = (
        f"{uuid.uuid4()}{extension}"
    )

    resume_path = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    try:

        # ====================================================
        # Save Uploaded Resume
        # ====================================================

        print("\n========================================")
        print("STARTING CANDIDATE RESUME PIPELINE")
        print("========================================")

        print("\n1. Saving uploaded resume...")

        with open(
            resume_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                resume.file,
                buffer,
            )

        # ====================================================
        # Analyze Resume
        # ====================================================

        print("2. Reading, cleaning and evaluating resume...")

        resume_text, metadata, evaluation = analyze_resume(
            resume_path=resume_path,
            job_description=job_description,
        )

        # ====================================================
        # Validate Analysis
        # ====================================================

        if not resume_text:
            raise HTTPException(
                status_code=500,
                detail="Resume text extraction failed.",
            )

        if metadata is None:
            raise HTTPException(
                status_code=500,
                detail="Resume metadata extraction failed.",
            )

        if evaluation is None:
            raise HTTPException(
                status_code=500,
                detail="Resume ATS evaluation failed.",
            )

        print("   Resume analysis completed.")

        # ====================================================
        # Resume Rewriting
        # ====================================================

        print("3. Rewriting resume using ATS feedback...")

        rewritten_resume = rewrite_resume(
            resume=resume_text,
            job_description=job_description,
            evaluation=evaluation,
        )

        if rewritten_resume is None:
            raise HTTPException(
                status_code=500,
                detail="Resume rewriting failed.",
            )

        print("   Resume rewriting completed.")

        # ====================================================
        # PDF Generation
        # ====================================================

        print("4. Generating ATS-friendly PDF...")

        pdf_path = generate_resume_pdf(
            metadata=metadata,
            rewritten_resume=rewritten_resume,
        )

        if not pdf_path:
            raise HTTPException(
                status_code=500,
                detail="PDF generation failed.",
            )

        pdf_path = str(pdf_path)

        if not os.path.exists(pdf_path):
            raise HTTPException(
                status_code=500,
                detail="Generated PDF file was not found.",
            )

        print("   PDF generation completed.")

        # ====================================================
        # PDF Information
        # ====================================================

        pdf_filename = os.path.basename(
            pdf_path
        )

        download_url = (
            f"/candidate/download/{pdf_filename}"
        )

        # ====================================================
        # Final Response
        # ====================================================

        print("\n========================================")
        print("RESUME PIPELINE COMPLETED SUCCESSFULLY")
        print("========================================\n")

        return {
            "metadata": metadata.model_dump(),

            "evaluation": evaluation.model_dump(),

            "rewritten_resume": (
                rewritten_resume.model_dump()
            ),

            "pdf": {
                "filename": pdf_filename,
                "download_url": download_url,
            },
        }

    # ========================================================
    # FastAPI HTTP Errors
    # ========================================================

    except HTTPException:
        raise

    # ========================================================
    # Unexpected Errors
    # ========================================================

    except Exception as e:

        import traceback

        print("\n========================================")
        print("CANDIDATE RESUME PROCESSING ERROR")
        print("========================================")

        traceback.print_exc()

        print("========================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    # ========================================================
    # Cleanup
    # ========================================================

    finally:

        # Close uploaded file
        try:
            resume.file.close()
        except Exception:
            pass

        # Delete temporary uploaded resume
        if os.path.exists(resume_path):

            try:

                os.remove(
                    resume_path
                )

                print(
                    f"Temporary file deleted: "
                    f"{resume_path}"
                )

            except Exception as e:

                print(
                    "Could not delete temporary "
                    f"file: {e}"
                )