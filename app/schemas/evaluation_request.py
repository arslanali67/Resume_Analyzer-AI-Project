from pydantic import BaseModel


class EvaluationRequest(BaseModel):
    job_description: str