from pathlib import Path
import shutil
from typing import List
from fastapi import UploadFile

from app.ingest import ingest_resume
from app.services.duplicate_detector import (
    ACTION_INSERT,
    ACTION_UPDATE,
    ACTION_DUPLICATE,
)


UPLOAD_FOLDER = Path("data/resumes")
UPLOAD_FOLDER.mkdir(exist_ok=True)


def upload_single_resume(
    file: UploadFile,
):
    """
    Save one uploaded resume and index it.
    """

    file_path = UPLOAD_FOLDER / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    action = ingest_resume(str(file_path))

    status_map = {
        ACTION_INSERT: "uploaded",
        ACTION_UPDATE: "updated",
        ACTION_DUPLICATE: "duplicate",
    }

    return {
        "filename": file.filename,
        "status": status_map[action],
    }



ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
}


def upload_multiple_resumes(
    files: List[UploadFile],
):
    """
    Upload and index multiple resumes.
    """

    results = []

    uploaded = 0
    updated = 0
    duplicates = 0
    failed = 0

    for file in files:

        extension = Path(file.filename).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:

            results.append(
                {
                    "filename": file.filename,
                    "status": "unsupported_file",
                }
            )

            failed += 1
            continue

        try:

            result = upload_single_resume(file)

            results.append(result)

            if result["status"] == "uploaded":
                uploaded += 1

            elif result["status"] == "updated":
                updated += 1

            elif result["status"] == "duplicate":
                duplicates += 1

        except Exception as e:

            results.append(
                {
                    "filename": file.filename,
                    "status": "failed",
                    "error": str(e),
                }
            )

            failed += 1

    return {
        "total_files": len(files),
        "uploaded": uploaded,
        "updated": updated,
        "duplicates": duplicates,
        "failed": failed,
        "results": results,
    }