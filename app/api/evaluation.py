from pathlib import Path
from app.services.evaluation_database import get_all_evaluations
from fastapi import APIRouter
from app.services.evaluation_database import save_evaluation
from app.schemas.evaluation_request import EvaluationRequest
from app.services.evaluator import evaluate_all_resumes
from app.services.rag_service import evaluate_resume
from app.services.metadata_extractor import extract_metadata
from app.services.file_reader import read_document
from app.services.text_cleaner import clean_text
from app.services.excel_exporter import export_to_excel
from fastapi import Query
from app.schemas.evaluation_filter import EvaluationFilter
from app.services.evaluation_database import (
    filter_evaluations,
)
from app.services.job_description_service import (
    get_job_description_text,
)
from app.services.candidate_service import get_candidate_by_filename
from app.services.job_service import generate_job_id


router = APIRouter(
    prefix="/evaluate",
    tags=["Resume Evaluation"],
)


# --------------------------------------------------
# Evaluate ALL resumes
# --------------------------------------------------

@router.post("/")
def evaluate_all(request: EvaluationRequest):

    job_description = get_job_description_text(
        request.job_id
    )

    if job_description is None:

        return {
            "error": "Job Description not found."
        }

    resume_folder = "data/resumes"

    job_id=request.job_id
    
    results = evaluate_all_resumes(
        folder_path=resume_folder,
        job_description=job_description,
        job_id=request.job_id,
    )

    export_to_excel(results)

    response = []

    for result in results:

        response.append(
            {
                "filename": result["filename"],
                "metadata": result["metadata"].model_dump(),
                "evaluation": result["evaluation"].model_dump(),
            }
        )

    return {
        "job_id": request.job_id,
        "total_candidates": len(response),
        "results": response,
    }

# --------------------------------------------------
# Get Stored Evaluations
# --------------------------------------------------

@router.get("/results")
def get_results(

    page: int = Query(1, ge=1),

    limit: int = Query(
        10,
        ge=1,
        le=100,
    ),

    match_score_min: int | None = Query(None),

    match_score_max: int | None = Query(None),

    recommendation: str | None = Query(None),

    location: str | None = Query(None),

    education: str | None = Query(None),

    current_role: str | None = Query(None),

    experience_min: float | None = Query(None),

    experience_max: float | None = Query(None),

    matching_skill: str | None = Query(None),

    missing_skill: str | None = Query(None),

    sort_by: str = Query("match_score"),

    order: str = Query("desc"),

):

    filters = EvaluationFilter(

        page=page,

        limit=limit,

        match_score_min=match_score_min,

        match_score_max=match_score_max,

        recommendation=recommendation,

        location=location,

        education=education,

        current_role=current_role,

        experience_min=experience_min,

        experience_max=experience_max,

        matching_skill=matching_skill,

        missing_skill=missing_skill,

        sort_by=sort_by,

        order=order,
    )

    return filter_evaluations(filters)


# --------------------------------------------------
# Evaluate ONE resume
# --------------------------------------------------

@router.post("/{filename}")
def evaluate_single(
    filename: str,
    request: EvaluationRequest,
):
    """
    Evaluate a single candidate resume against a job description
    and save the evaluation result.
    """

    # --------------------------------------------------
    # Find candidate
    # --------------------------------------------------

    metadata = get_candidate_by_filename(filename)

    if metadata is None:
        return {
            "error": "Candidate not found."
        }

    # --------------------------------------------------
    # Get candidate ID
    # --------------------------------------------------

    candidate_id = metadata.get("candidate_id")

    if candidate_id is None:
        return {
            "error": "Candidate ID not found."
        }

    # --------------------------------------------------
    # Get job description
    # --------------------------------------------------

    job_description = get_job_description_text(
        request.job_id
    )

    if job_description is None:
        return {
            "error": "Job Description not found."
        }

    # --------------------------------------------------
    # Evaluate resume
    # --------------------------------------------------

    evaluation = evaluate_resume(
        job_description=job_description,
        filename=filename,
    )

    if evaluation is None:
        return {
            "error": "Resume evaluation failed."
        }

    # --------------------------------------------------
    # Save evaluation
    # --------------------------------------------------

    save_evaluation(
        candidate_id=candidate_id,
        job_id=request.job_id,
        evaluation=evaluation,
    )

    # --------------------------------------------------
    # Response
    # --------------------------------------------------

    return {
        "filename": filename,
        "job_id": request.job_id,
        "candidate_id": candidate_id,
        "metadata": metadata,
        "evaluation": evaluation.model_dump(),
    }