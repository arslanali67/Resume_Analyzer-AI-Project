from pydantic import BaseModel


class UploadResponse(BaseModel):
    filename: str
    message: str


class EvaluationRequest(BaseModel):
    job_description: str