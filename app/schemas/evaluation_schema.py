from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.ats_breakdown import ATSBreakdown


class Recommendation(str, Enum):
    HIRE = "Hire"
    MAYBE = "Maybe"
    REJECT = "Reject"


class ATSGrade(str, Enum):
    A_PLUS = "A+"
    A = "A"
    B_PLUS = "B+"
    B = "B"
    C_PLUS = "C+"
    C = "C"
    D = "D"
    F = "F"


class ResumeEvaluation(BaseModel):

    match_score: int = Field(
        ge=0,
        le=100,
        description="Overall ATS match score between 0 and 100."
    )

    matching_skills: list[str] = Field(
        description="Skills found in both the resume and the job description."
    )

    missing_skills: list[str] = Field(
        description="Important required skills missing from the resume."
    )

    experience_summary: str = Field(
        description="Short summary of the candidate's relevant experience."
    )

    strengths: list[str] = Field(
        description="Top strengths of the candidate."
    )

    weaknesses: list[str] = Field(
        description="Top weaknesses of the candidate."
    )

    recommendation: Recommendation = Field(
        description="Hiring recommendation."
    )

    recommendation_reason: str = Field(
        description="Short explanation for the hiring recommendation."
    )

    breakdown: ATSBreakdown = Field(
        description="Detailed ATS score breakdown."
    )

    overall_feedback: list[str] = Field(
        min_length=5,
        max_length=5,
        description="Exactly five actionable ATS improvement suggestions."
    )

    resume_strengths: list[str] = Field(
        description="Strongest aspects of the resume."
    )

    resume_improvements: list[str] = Field(
        description="Specific resume improvements to increase ATS compatibility."
    )

    ats_grade: ATSGrade = Field(
        description="Overall ATS grade."
    )