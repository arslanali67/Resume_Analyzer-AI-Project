from fastapi import APIRouter, HTTPException
from app.schemas.job_description import (
    JobDescriptionCreate,
)
from app.services.job_description_service import (
    create_job_description,
)
from app.schemas.job_description import (
    JobDescriptionCreate,
    JobDescriptionUpdate,
)

from app.services.job_description_service import (
    create_job_description,
    get_all_job_descriptions,
    get_job_description,
    update_job_description,
    delete_job_description,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Job Descriptions"],
)


# ----------------------------------------
# Create Job Description
# ----------------------------------------

@router.post("/")
def create_job(job: JobDescriptionCreate):

    job_id = create_job_description(job)

    return {
        "message": "Job description created successfully.",
        "job_id": job_id,
    }


# ----------------------------------------
# Get All Job Descriptions
# ----------------------------------------

@router.get("/")
def get_all_jobs():

    jobs = get_all_job_descriptions()

    return {
        "total": len(jobs),
        "results": jobs,
    }


# ----------------------------------------
# Get One Job Description
# ----------------------------------------

@router.get("/{job_id}")
def get_job(job_id: int):

    job = get_job_description(job_id)

    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Job description not found.",
        )

    return job


# ----------------------------------------
# Update Job Description
# ----------------------------------------

@router.put("/{job_id}")
def update_job(
    job_id: int,
    job: JobDescriptionUpdate,
):

    updated = update_job_description(
        job_id,
        job,
    )

    if not updated:

        raise HTTPException(
            status_code=404,
            detail="Job description not found.",
        )

    return {
        "message": "Job description updated successfully."
    }


# ----------------------------------------
# Delete Job Description
# ----------------------------------------

@router.delete("/{job_id}")
def delete_job(job_id: int):

    deleted = delete_job_description(job_id)

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Job description not found.",
        )

    return {
        "message": "Job description deleted successfully."
    }

