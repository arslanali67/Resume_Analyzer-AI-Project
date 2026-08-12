import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse


router = APIRouter(
    prefix="/candidate",
    tags=["Resume Download"],
)


# ============================================================
# Generated Resume Directory
# ============================================================

GENERATED_RESUME_FOLDER = os.path.join(
    "app",
    "generated_resumes",
)


# Make sure the directory exists
os.makedirs(
    GENERATED_RESUME_FOLDER,
    exist_ok=True,
)


# ============================================================
# Download Resume PDF
# ============================================================

@router.get("/download/{filename}")
def download_resume(
    filename: str,
):
    """
    Download a generated ATS resume PDF.
    """

    # --------------------------------------------------------
    # Security: prevent directory traversal
    # --------------------------------------------------------

    safe_filename = os.path.basename(
        filename
    )

    # --------------------------------------------------------
    # Only allow PDF files
    # --------------------------------------------------------

    if not safe_filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files can be downloaded.",
        )

    # --------------------------------------------------------
    # Build PDF path
    # --------------------------------------------------------

    pdf_path = os.path.join(
        GENERATED_RESUME_FOLDER,
        safe_filename,
    )

    # --------------------------------------------------------
    # Check file exists
    # --------------------------------------------------------

    if not os.path.isfile(pdf_path):
        raise HTTPException(
            status_code=404,
            detail="Resume PDF not found.",
        )

    # --------------------------------------------------------
    # Return PDF
    # --------------------------------------------------------

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=safe_filename,
    )