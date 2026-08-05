from pathlib import Path
import zipfile
import shutil

from fastapi import UploadFile

from app.services.upload_service import upload_single_resume


TEMP_FOLDER = Path("data/temp_upload")
TEMP_FOLDER.mkdir(parents=True, exist_ok=True)


def upload_zip(zip_file: UploadFile):
    """
    Upload a ZIP containing multiple resumes.
    """

    # Clean previous temp folder
    if TEMP_FOLDER.exists():
        shutil.rmtree(TEMP_FOLDER)

    TEMP_FOLDER.mkdir(parents=True)

    zip_path = TEMP_FOLDER / zip_file.filename

    # Save ZIP
    with open(zip_path, "wb") as buffer:
        shutil.copyfileobj(zip_file.file, buffer)

    # Extract ZIP
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(TEMP_FOLDER)

    uploaded = 0
    updated = 0
    duplicates = 0
    failed = 0

    results = []

    # Find every PDF/DOCX
    for file in TEMP_FOLDER.rglob("*"):

        if not file.is_file():
            continue

        if file.suffix.lower() not in [".pdf", ".docx"]:
            continue

        try:

            # Create UploadFile from extracted file
            with open(file, "rb") as f:

                upload_file = UploadFile(
                    filename=file.name,
                    file=f,
                )

                result = upload_single_resume(upload_file)

            results.append(result)

            if result["status"] == "uploaded":
                uploaded += 1

            elif result["status"] == "updated":
                updated += 1

            elif result["status"] == "duplicate":
                duplicates += 1

        except Exception as e:

            failed += 1

            results.append(
                {
                    "filename": file.name,
                    "status": "failed",
                    "error": str(e),
                }
            )

    shutil.rmtree(TEMP_FOLDER)

    return {
        "uploaded": uploaded,
        "updated": updated,
        "duplicates": duplicates,
        "failed": failed,
        "results": results,
    }