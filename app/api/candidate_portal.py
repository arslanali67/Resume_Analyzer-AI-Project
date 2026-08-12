import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Request,
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
# Shared Candidate Resume Processing
# ============================================================


def _process_candidate_resume(
    resume_path: str,
    job_description: str,
    generate_pdf: bool = False,
    request: Request | None = None,
):
    """Analyze, rewrite, and optionally generate a PDF for a resume."""

    print("\n========================================")
    print("STARTING CANDIDATE RESUME PIPELINE")
    print("========================================")

    print("\n1. Reading, cleaning and evaluating resume...")

    resume_text, metadata, evaluation = analyze_resume(
        resume_path=resume_path,
        job_description=job_description,
    )

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

    print("2. Rewriting resume using ATS feedback...")

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

    result = {
        "metadata": metadata.model_dump(),
        "evaluation": evaluation.model_dump(),
        "rewritten_resume": rewritten_resume.model_dump(),
    }

    if generate_pdf:
        print("3. Generating ATS-friendly PDF...")

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

        pdf_filename = os.path.basename(pdf_path)
        download_url = f"/candidate/download/{pdf_filename}"
        if request is not None:
            download_url = str(request.base_url).rstrip("/") + download_url
        result["pdf"] = {
            "filename": pdf_filename,
            "download_url": download_url,
        }

        print("   PDF generation completed.")

    print("\n========================================")
    print("RESUME PIPELINE COMPLETED SUCCESSFULLY")
    print("========================================\n")

    return result


# ============================================================
# Candidate Resume Analysis
# ============================================================

@router.post("/analyze")
def analyze_candidate_resume(
    request: Request,
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    """Analyze a resume and return ATS information and a rewritten version without generating a PDF."""

    if not resume.filename:
        raise HTTPException(
            status_code=400,
            detail="Resume file is required.",
        )

    extension = os.path.splitext(resume.filename)[1].lower()
    allowed_extensions = {".pdf", ".docx", ".txt"}

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX, and TXT files are supported.",
        )

    if not job_description or not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description is required.",
        )

    filename = f"{uuid.uuid4()}{extension}"
    resume_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        with open(resume_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

        return _process_candidate_resume(
            resume_path=resume_path,
            job_description=job_description,
            generate_pdf=False,
            request=request,
        )

    except HTTPException:
        raise

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

    finally:
        try:
            resume.file.close()
        except Exception:
            pass

        if os.path.exists(resume_path):
            try:
                os.remove(resume_path)
            except Exception as e:
                print(f"Could not delete temporary file: {e}")


@router.post("/generate-pdf")
def generate_candidate_resume_pdf(
    request: Request,
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    """Generate and return the final ATS-friendly resume PDF for a candidate."""

    if not resume.filename:
        raise HTTPException(
            status_code=400,
            detail="Resume file is required.",
        )

    extension = os.path.splitext(resume.filename)[1].lower()
    allowed_extensions = {".pdf", ".docx", ".txt"}

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX, and TXT files are supported.",
        )

    if not job_description or not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description is required.",
        )

    filename = f"{uuid.uuid4()}{extension}"
    resume_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        with open(resume_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

        result = _process_candidate_resume(
            resume_path=resume_path,
            job_description=job_description,
            generate_pdf=True,
            request=request,
        )

        if "pdf" not in result:
            raise HTTPException(
                status_code=500,
                detail="PDF generation failed.",
            )

        return result

    except HTTPException:
        raise

    except Exception as e:
        import traceback

        print("\n========================================")
        print("CANDIDATE RESUME PDF GENERATION ERROR")
        print("========================================")
        traceback.print_exc()
        print("========================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    finally:
        try:
            resume.file.close()
        except Exception:
            pass

        if os.path.exists(resume_path):
            try:
                os.remove(resume_path)
            except Exception as e:
                print(f"Could not delete temporary file: {e}")

