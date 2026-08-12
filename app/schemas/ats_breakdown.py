from pydantic import BaseModel


class ATSCategory(BaseModel):
    score: int
    reason: str


class ATSBreakdown(BaseModel):
    skills: ATSCategory
    experience: ATSCategory
    education: ATSCategory
    projects: ATSCategory
    keywords: ATSCategory
    formatting: ATSCategory