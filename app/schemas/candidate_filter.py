from pydantic import BaseModel


class CandidateFilter(BaseModel):

    location: str | None = None

    education: str | None = None

    current_role: str | None = None

    experience_min: float | None = None

    experience_max: float | None = None

    page: int = 1

    limit: int = 10