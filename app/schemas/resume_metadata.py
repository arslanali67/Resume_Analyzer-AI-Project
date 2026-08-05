from pydantic import BaseModel, Field


class ResumeMetadata(BaseModel):

    candidate_name: str = Field(
        description="Full name of the candidate"
    )

    email: str = Field(
        description="Candidate email address"
    )

    phone: str = Field(
        description="Candidate phone number"
    )

    skills: list[str] = Field(
        description="List of technical skills"
    )

    education: str = Field(
        description="Highest education"
    )

    experience_years: float = Field(
        description="Total years of professional experience. Return 0 if unknown."
    )

    current_role: str = Field(
        description="Current or most recent job title"
    )

    location: str = Field(
        description="Candidate location"
    )

    summary: str = Field(
        description="Short professional summary in one sentence"
    )