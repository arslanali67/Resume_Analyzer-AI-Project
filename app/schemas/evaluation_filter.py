from pydantic import BaseModel


class EvaluationFilter(BaseModel):

    page: int = 1
    limit: int = 10

    match_score_min: int | None = None
    match_score_max: int | None = None

    recommendation: str | None = None

    location: str | None = None
    education: str | None = None
    current_role: str | None = None

    experience_min: float | None = None
    experience_max: float | None = None

    matching_skill: str | None = None
    missing_skill: str | None = None