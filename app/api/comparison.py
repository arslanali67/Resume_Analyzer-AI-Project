from fastapi import APIRouter, HTTPException, Query
from app.services.comparison_service import compare_candidates
from app.services.comparison_service import (
    get_candidate_comparison,
)

router = APIRouter(
    prefix="/compare",
    tags=["Comparison"],
)


@router.get("/")
def compare(
    filename1: str = Query(...),
    filename2: str = Query(...),
):

    result = compare_candidates(
        filename1,
        filename2,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="One or both candidates not found.",
        )

    return result