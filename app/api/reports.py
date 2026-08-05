from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/evaluation")
def download_evaluation_report():
    """
    Download the latest evaluation report.
    """

    report = Path("output/evaluation_results.xlsx")

    if not report.exists():

        raise HTTPException(
            status_code=404,
            detail="No evaluation report found.",
        )

    return FileResponse(
        path=report,
        filename="evaluation_results.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )