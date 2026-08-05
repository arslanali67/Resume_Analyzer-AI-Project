from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.zip_upload_service import upload_zip
from app.services.upload_service import upload_single_resume

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("/")
async def upload_resume(
    file: UploadFile = File(...)
):
    """
    Upload a single resume (.pdf or .docx).

    The React frontend can call this endpoint
    multiple times when the user selects
    multiple files.
    """

    return upload_single_resume(file)

@router.post("/zip")
def upload_zip_file(
    file: UploadFile = File(...)
):
    """
    Upload a ZIP containing resumes.
    """

    if not file.filename.lower().endswith(".zip"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a ZIP file."
        )

    return upload_zip(file)    