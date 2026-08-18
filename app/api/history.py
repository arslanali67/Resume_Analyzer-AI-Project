from fastapi import APIRouter, HTTPException

from app.services.history_service import get_candidate_history

router = APIRouter(
    prefix="/history",
    tags=["Evaluation History"],
)


@router.get("/{filename}")
def candidate_history(filename: str):

    history = get_candidate_history(filename)

    if history is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate history not found."
        )

    return history