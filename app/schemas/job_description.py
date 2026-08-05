from pydantic import BaseModel


class JobDescriptionCreate(BaseModel):
    title: str
    department: str | None = None
    description: str


class JobDescriptionUpdate(BaseModel):
    title: str
    department: str | None = None
    description: str


class JobDescriptionResponse(BaseModel):
    id: int
    title: str
    department: str | None = None
    description: str
    created_at: str