
from app.services.vector_store import get_vector_store
from pathlib import Path
from app.schemas.candidate_response import CandidateResponse
from app.services.vector_store import delete_resume
from app.schemas.candidate_filter import CandidateFilter



def metadata_to_candidate(metadata) -> CandidateResponse:
    """
    Convert Chroma metadata into a CandidateResponse object.
    """

    return CandidateResponse(
        candidate_name=metadata.get("candidate_name", ""),
        filename=metadata.get("filename", ""),
        email=metadata.get("email", ""),
        phone=metadata.get("phone", ""),
        current_role=metadata.get("current_role", ""),
        experience_years=metadata.get(
            "experience_years",
            0,
        ),
        location=metadata.get("location", ""),
    )


def get_all_candidates():
    """
    Return one metadata record for each indexed candidate.
    """

    vector_store = get_vector_store()

    data = vector_store.get(
        include=["metadatas"]
    )

    candidates = {}

    for metadata in data["metadatas"]:

        filename = metadata["filename"]

        if filename not in candidates:

            candidates[filename] = metadata

    return list(candidates.values())

def get_candidate_by_filename(filename):
    """
    Return metadata for a single candidate.
    """

    vector_store = get_vector_store()

    data = vector_store.get(
        where={
            "filename": filename
        },
        include=["metadatas"],
    )

    if not data["metadatas"]:
        return None

    return data["metadatas"][0]



def delete_candidate(filename):
    """
    Delete candidate from ChromaDB
    and remove uploaded PDF.
    """

    deleted_chunks = delete_resume(filename)

    if deleted_chunks == 0:
        return False

    file_path = Path("data/resumes") / filename

    if file_path.exists():
        file_path.unlink()

    return True


def search_candidates(search: str):
    """
    Search candidates by name, email,
    current role, or filename.
    """

    vector_store = get_vector_store()

    results = vector_store._collection.get(
        where={
            "chunk_id": 0
        },
        include=["metadatas"],
    )

    search = search.lower()

    matches = []

    for metadata in results["metadatas"]:

        candidate_name = metadata.get(
            "candidate_name",
            "",
        ).lower()

        email = metadata.get(
            "email",
            "",
        ).lower()

        current_role = metadata.get(
            "current_role",
            "",
        ).lower()

        filename = metadata.get(
            "filename",
            "",
        ).lower()

        if (
            search in candidate_name
            or search in email
            or search in current_role
            or search in filename
        ):
            matches.append(
                metadata_to_candidate(metadata)
            )
    return matches


def get_candidates_paginated(
    page: int = 1,
    limit: int = 10,
):
    """
    Return candidates with pagination.
    """

    vector_store = get_vector_store()

    results = vector_store._collection.get(
        where={
            "chunk_id": 0
        },
        include=["metadatas"],
    )

    candidates = []

    for metadata in results["metadatas"]:

        candidates.append(
            metadata_to_candidate(metadata)
        )

    # Sort alphabetically
    candidates.sort(
        key=lambda x: x.candidate_name.lower()
    )

    total = len(candidates)

    start = (page - 1) * limit
    end = start + limit

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "results": candidates[start:end],
    }


def filter_candidates(filters: CandidateFilter):
    """
    Filter candidates using metadata stored in ChromaDB.
    """

    vector_store = get_vector_store()

    results = vector_store._collection.get(
        where={
            "chunk_id": 0
        },
        include=["metadatas"],
    )

    candidates = []

    for metadata in results["metadatas"]:

        candidate = metadata_to_candidate(metadata)

        # -------------------------
        # Location Filter
        # -------------------------
        if (
            filters.location
            and filters.location.lower()
            not in candidate.location.lower()
        ):
            continue

        # -------------------------
        # Education Filter
        # -------------------------
        education = metadata.get("education", "")

        if (
            filters.education
            and filters.education.lower()
            not in education.lower()
        ):
            continue

        # -------------------------
        # Current Role Filter
        # -------------------------
        if (
            filters.current_role
            and filters.current_role.lower()
            not in candidate.current_role.lower()
        ):
            continue

        # -------------------------
        # Minimum Experience
        # -------------------------
        if (
            filters.experience_min is not None
            and candidate.experience_years < filters.experience_min
        ):
            continue

        # -------------------------
        # Maximum Experience
        # -------------------------
        if (
            filters.experience_max is not None
            and candidate.experience_years > filters.experience_max
        ):
            continue

        candidates.append(candidate)

    # -------------------------
    # Sort by candidate name
    # -------------------------
    candidates.sort(
        key=lambda x: x.candidate_name.lower()
    )

    # -------------------------
    # Pagination
    # -------------------------
    total = len(candidates)

    start = (filters.page - 1) * filters.limit
    end = start + filters.limit

    return {
        "total": total,
        "page": filters.page,
        "limit": filters.limit,
        "total_pages": (total + filters.limit - 1) // filters.limit,
        "results": candidates[start:end],
    }

    
if __name__ == "__main__":

    candidates = get_all_candidates()

    for candidate in candidates:

        print(candidate)

