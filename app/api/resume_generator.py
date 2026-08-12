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

from app.services.file_reader import read_document
from app.services.text_cleaner import clean_text
from app.services.metadata_extractor import extract_metadata
from app.services.ats_service import analyze_resume
from app.services.resume_rewriter import rewrite_resume
from app.services.resume_generator import generate_resume_pdf


router = APIRouter(
    prefix="/candidate",
    tags=["Candidate Portal"],
)


UPLOAD_FOLDER = "data/temp"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True,
)


@router.post("/analyze")
def analyze_candidate_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    """
    Complete candidate resume pipeline.

    Flow:
    1. Upload resume
    2. Extract resume text
    3. Clean resume text
    4. Extract metadata
    5. Analyze ATS score
    6. Rewrite resume
    7. Generate ATS-friendly PDF
    8. Return analysis + rewritten resume + PDF URL
    """

    # --------------------------------------------------
    # Validate uploaded file
    # --------------------------------------------------

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
                "Only PDF, DOCX, and TXT files are supported."
            ),
        )

    # --------------------------------------------------
    # Validate job description
    # --------------------------------------------------

    if not job_description or not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description is required.",
        )

    # --------------------------------------------------
    # Create temporary filename
    # --------------------------------------------------

    filename = (
        f"{uuid.uuid4()}{extension}"
    )

    resume_path = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    try:

        # --------------------------------------------------
        # Save uploaded resume
        # --------------------------------------------------

        print("\n1. Saving uploaded resume...")

        with open(
            resume_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                resume.file,
                buffer,
            )

        # --------------------------------------------------
        # Step 1: Read Resume
        # --------------------------------------------------

        print("2. Reading resume...")

        resume_text = read_document(
            resume_path
        )

        if not resume_text or not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text from "
                    "the uploaded resume."
                ),
            )

        # --------------------------------------------------
        # Step 2: Clean Resume
        # --------------------------------------------------

        print("3. Cleaning resume...")

        resume_text = clean_text(
            resume_text
        )

        if not resume_text or not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail=(
                    "Resume contains no readable text "
                    "after cleaning."
                ),
            )

        # --------------------------------------------------
        # Step 3: Extract Metadata
        # --------------------------------------------------

        print("4. Extracting metadata...")

        metadata = extract_metadata(
            resume_text
        )

        if metadata is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to extract resume metadata.",
            )

        # --------------------------------------------------
        # Step 4: ATS Evaluation
        # --------------------------------------------------

        print("5. Evaluating resume...")

        result = analyze_resume(
            resume_path=resume_path,
            job_description=job_description,
        )

        # --------------------------------------------------
        # IMPORTANT
        #
        # analyze_resume() returns:
        #
        #     metadata, evaluation
        #
        # --------------------------------------------------

        if not isinstance(result, tuple):
            raise HTTPException(
                status_code=500,
                detail=(
                    "Invalid response from analyze_resume(). "
                    "Expected (metadata, evaluation)."
                ),
            )

        if len(result) != 2:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Invalid response from analyze_resume(). "
                    "Expected exactly two values: "
                    "metadata and evaluation."
                ),
            )

        metadata_result, evaluation = result

        # --------------------------------------------------
        # Use metadata returned by ATS service if available
        # --------------------------------------------------

        if metadata_result is not None:
            metadata = metadata_result

        if evaluation is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to evaluate resume.",
            )

        print("6. ATS evaluation completed.")

        # --------------------------------------------------
        # Step 5: Rewrite Resume
        # --------------------------------------------------

        print("7. Rewriting resume...")

        rewritten_resume = rewrite_resume(
            resume=resume_text,
            job_description=job_description,
            evaluation=evaluation,
        )

        if rewritten_resume is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to rewrite resume.",
            )

        print("8. Resume rewriting completed.")

        # --------------------------------------------------
        # Step 6: Generate PDF
        # --------------------------------------------------

        print(
            "9. Generating ATS-friendly PDF..."
        )

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

        pdf_filename = os.path.basename(
            pdf_path
        )

        print(
            "10. Resume processing completed."
        )

        # --------------------------------------------------
        # Final API Response
        # --------------------------------------------------

        return {
            "metadata": metadata.model_dump(),

            "evaluation": evaluation.model_dump(),

            "rewritten_resume": (
                rewritten_resume.model_dump()
            ),

            "pdf": {
                "filename": pdf_filename,
                "download_url": (
                    f"/candidate/download/"
                    f"{pdf_filename}"
                ),
            },
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Candidate resume processing error:"
        )
        print(
            f"{type(e).__name__}: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Resume processing failed: "
                f"{str(e)}"
            ),
        )

    finally:

        # --------------------------------------------------
        # Delete temporary uploaded resume
        # --------------------------------------------------

        if os.path.exists(resume_path):

            try:

                os.remove(
                    resume_path
                )

                print(
                    "Temporary resume deleted."
                )

            except Exception as e:

                print(
                    "Could not delete temporary "
                    f"file: {e}"
                )