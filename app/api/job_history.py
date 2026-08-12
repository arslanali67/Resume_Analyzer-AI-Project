from fastapi import APIRouter, HTTPException

from app.services.evaluation_database import (
    get_job_evaluation_history,
)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.get("/{job_id}/history")
def get_history(job_id: int):

    history = get_job_evaluation_history(job_id)

    if not history:
        raise HTTPException(
            status_code=404,
            detail="No evaluations found for this job."
        )

    return {
        "job_id": job_id,
        "total_evaluations": len(history),
        "history": history,
    }