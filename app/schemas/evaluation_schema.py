from pydantic import BaseModel, Field


class ResumeEvaluation(BaseModel):

    match_score: int = Field(
        description="Match score between 0 and 100"
    )

    matching_skills: list[str]

    missing_skills: list[str]

    experience_summary: str

    strengths: list[str]

    weaknesses: list[str]

    recommendation: str = Field(
        description="Must be exactly one of: Hire, Maybe, Reject"
    )

    recommendation_reason: str = Field(
        description="Short explanation for the recommendation."
    )