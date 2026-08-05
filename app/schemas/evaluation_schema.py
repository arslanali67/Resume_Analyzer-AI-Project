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

    hiring_recommendation: str