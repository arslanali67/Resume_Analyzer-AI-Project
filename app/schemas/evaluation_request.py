from pydantic import BaseModel


class EvaluationRequest(BaseModel):
    job_id: int