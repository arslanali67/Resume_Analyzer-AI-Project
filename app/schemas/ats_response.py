from pydantic import BaseModel


class ATSResponse(BaseModel):

    ats_score: int

    recommendation: str

    recommendation_reason: str

    strengths: list[str]

    weaknesses: list[str]

    matching_skills: list[str]

    missing_skills: list[str]