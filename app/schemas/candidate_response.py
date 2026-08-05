from pydantic import BaseModel


class CandidateResponse(BaseModel):
    candidate_name: str
    filename: str
    email: str
    phone: str
    current_role: str
    experience_years: float
    location: str