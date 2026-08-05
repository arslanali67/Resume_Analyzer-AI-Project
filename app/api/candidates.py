from fastapi import APIRouter, HTTPException, Query

from app.schemas.candidate_filter import CandidateFilter

from app.services.candidate_service import (
    delete_candidate,
    search_candidates,
    get_candidates_paginated,
    filter_candidates,
)

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


# --------------------------------------------------
# Get Candidates (Pagination + Filtering)
# --------------------------------------------------

@router.get("/")
def get_candidates(

    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),

    location: str | None = None,
    education: str | None = None,
    current_role: str | None = None,

    experience_min: float | None = None,
    experience_max: float | None = None,

):

    filters = CandidateFilter(
        page=page,
        limit=limit,
        location=location,
        education=education,
        current_role=current_role,
        experience_min=experience_min,
        experience_max=experience_max,
    )

    # If any filter exists → use filter_candidates()
    if any([
        location,
        education,
        current_role,
        experience_min is not None,
        experience_max is not None,
    ]):

        data = filter_candidates(filters)

    else:

        data = get_candidates_paginated(
            page=page,
            limit=limit,
        )

    return {
        "total_candidates": data["total"],
        "page": data["page"],
        "limit": data["limit"],
        "total_pages": data["total_pages"],
        "results": [
            candidate.model_dump()
            for candidate in data["results"]
        ],
    }


# --------------------------------------------------
# Search Candidates
# --------------------------------------------------

@router.get("/search")
def search(

    search: str = Query(
        ...,
        min_length=1,
    ),

):

    results = search_candidates(search)

    return {
        "total_results": len(results),
        "results": [
            candidate.model_dump()
            for candidate in results
        ],
    }


# --------------------------------------------------
# Delete Candidate
# --------------------------------------------------

@router.delete("/{filename}")
def delete(filename: str):

    deleted = delete_candidate(filename)

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found.",
        )

    return {
        "message": "Candidate deleted successfully."
    }