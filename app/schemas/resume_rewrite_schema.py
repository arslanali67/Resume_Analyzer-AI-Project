from typing import Any
from pydantic import BaseModel, Field, field_validator


# --------------------------------------------------
# Professional Summary
# --------------------------------------------------

class ProfessionalSummary(BaseModel):
    content: str = Field(
        default="",
        description="A professional summary rewritten from the original resume without inventing experience."
    )

    @field_validator("content", mode="before")
    @classmethod
    def validate_content(cls, v: Any) -> str:
        if v is None:
            return ""
        if isinstance(v, dict):
            return str(v.get("content", ""))
        return str(v).strip()


# --------------------------------------------------
# Skills
# --------------------------------------------------

class SkillCategory(BaseModel):
    category: str = Field(
        default="Technical Skills",
        description="Skill category such as Technical Skills, Tools, Languages, Frameworks, etc."
    )

    skills: list[str] = Field(
        default_factory=list,
        description="Skills that belong to this category. Only skills that exist in the original resume."
    )

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: Any) -> str:
        if v is None:
            return "Technical Skills"
        if isinstance(v, dict):
            return str(v.get("category", "Technical Skills"))
        return str(v).strip() or "Technical Skills"

    @field_validator("skills", mode="before")
    @classmethod
    def validate_skills_list(cls, v: Any) -> list[str]:
        if v is None:
            return []
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        if isinstance(v, list):
            return [str(s).strip() for s in v if s is not None and str(s).strip()]
        return []


# --------------------------------------------------
# Experience
# --------------------------------------------------

class ExperienceItem(BaseModel):
    company: str = Field(
        default="",
        description="Company name."
    )

    location: str = Field(
        default="",
        description="Company location or City, Country, e.g. Faisalabad, Pakistan or Remote."
    )

    role: str = Field(
        default="",
        description="Job title."
    )

    duration: str = Field(
        default="",
        description="Employment duration, e.g. Sep 2025 – Nov 2025."
    )

    bullets: list[str] = Field(
        default_factory=list,
        description="Professionally rewritten responsibilities using only information from the original resume. Bold key technical tools or achievements using <b>...</b> tags."
    )

    @field_validator("company", "location", "role", "duration", mode="before")
    @classmethod
    def validate_str_fields(cls, v: Any) -> str:
        if v is None:
            return ""
        if isinstance(v, dict):
            return str(v.get("name", v.get("title", "")))
        return str(v).strip()

    @field_validator("bullets", mode="before")
    @classmethod
    def validate_bullets(cls, v: Any) -> list[str]:
        if v is None:
            return []
        if isinstance(v, str):
            return [v.strip()] if v.strip() else []
        if isinstance(v, list):
            return [str(b).strip() for b in v if b is not None and str(b).strip()]
        return []


# --------------------------------------------------
# Projects
# --------------------------------------------------

class ProjectItem(BaseModel):
    title: str = Field(
        default="",
        description="Project title."
    )

    technologies: list[str] = Field(
        default_factory=list,
        description="Technologies explicitly mentioned in the original project."
    )

    date: str = Field(
        default="",
        description="Project completion date or duration, e.g. July 2026."
    )

    bullets: list[str] = Field(
        default_factory=list,
        description="Professionally rewritten project description. Bold key technical tools using <b>...</b> tags."
    )

    @field_validator("title", "date", mode="before")
    @classmethod
    def validate_str_fields(cls, v: Any) -> str:
        if v is None:
            return ""
        if isinstance(v, dict):
            return str(v.get("title", v.get("name", "")))
        return str(v).strip()

    @field_validator("technologies", mode="before")
    @classmethod
    def validate_technologies(cls, v: Any) -> list[str]:
        if v is None:
            return []
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        if isinstance(v, list):
            return [str(t).strip() for t in v if t is not None and str(t).strip()]
        return []

    @field_validator("bullets", mode="before")
    @classmethod
    def validate_project_bullets(cls, v: Any) -> list[str]:
        if v is None:
            return []
        if isinstance(v, str):
            return [v.strip()] if v.strip() else []
        if isinstance(v, list):
            return [str(b).strip() for b in v if b is not None and str(b).strip()]
        return []


# --------------------------------------------------
# Education
# --------------------------------------------------

class EducationItem(BaseModel):
    degree: str = Field(
        default="",
        description="Degree name."
    )

    institute: str = Field(
        default="",
        description="Institution name."
    )

    location: str = Field(
        default="",
        description="Institution location or City, Country."
    )

    duration: str = Field(
        default="",
        description="Graduation year or duration, e.g. Sep 2023 – Oct 2027."
    )

    @field_validator("degree", "institute", "location", "duration", mode="before")
    @classmethod
    def validate_str_fields(cls, v: Any) -> str:
        if v is None:
            return ""
        if isinstance(v, dict):
            return str(v.get("name", v.get("degree", v.get("institute", ""))))
        return str(v).strip()


# --------------------------------------------------
# Certifications
# --------------------------------------------------

class CertificationItem(BaseModel):
    name: str = Field(
        default="",
        description="Certification name exactly as mentioned in the resume."
    )

    url: str = Field(
        default="",
        description="Optional verification link or URL for the certification if present in original resume."
    )

    @field_validator("name", "url", mode="before")
    @classmethod
    def validate_str_fields(cls, v: Any) -> str:
        if v is None:
            return ""
        if isinstance(v, dict):
            return str(v.get("name", v.get("url", "")))
        return str(v).strip()


# --------------------------------------------------
# Resume Improvement Suggestions
# --------------------------------------------------

class ImprovementSuggestions(BaseModel):
    recommendations: list[str] = Field(
        default_factory=list,
        description="Recommendations to improve the candidate's profile and resume."
    )

    @field_validator("recommendations", mode="before")
    @classmethod
    def validate_recommendations(cls, v: Any) -> list[str]:
        if v is None:
            return []
        if isinstance(v, str):
            return [v.strip()] if v.strip() else []
        if isinstance(v, list):
            return [str(r).strip() for r in v if r is not None and str(r).strip()]
        if isinstance(v, dict):
            recs = v.get("recommendations", v.get("suggestions", []))
            if isinstance(recs, list):
                return [str(r).strip() for r in recs if r is not None and str(r).strip()]
            if isinstance(recs, str):
                return [recs.strip()] if recs.strip() else []
        return []


# --------------------------------------------------
# Resume Rewrite Output
# --------------------------------------------------

class ResumeRewrite(BaseModel):

    professional_summary: ProfessionalSummary = Field(
        default_factory=ProfessionalSummary,
        description="Professional summary section."
    )

    skills: list[SkillCategory] = Field(
        default_factory=list,
        description="Skills organized into logical ATS-friendly categories."
    )

    experience: list[ExperienceItem] = Field(
        default_factory=list,
        description="Professionally rewritten work experience."
    )

    projects: list[ProjectItem] = Field(
        default_factory=list,
        description="Projects rewritten professionally. Empty if no projects exist."
    )

    education: list[EducationItem] = Field(
        default_factory=list,
        description="Education rewritten professionally."
    )

    certifications: list[CertificationItem] = Field(
        default_factory=list,
        description="Certifications listed exactly as found in the original resume."
    )

    ats_keywords_used: list[str] = Field(
        default_factory=list,
        description="ATS keywords successfully incorporated into the rewritten resume."
    )

    improvement_suggestions: ImprovementSuggestions = Field(
        default_factory=ImprovementSuggestions,
        description="Profile improvement recommendations."
    )

    @field_validator("professional_summary", mode="before")
    @classmethod
    def validate_prof_summary(cls, v: Any) -> Any:
        if v is None:
            return ProfessionalSummary()
        if isinstance(v, str):
            return {"content": v}
        return v

    @field_validator("skills", mode="before")
    @classmethod
    def validate_skills_categories(cls, v: Any) -> Any:
        if v is None:
            return []
        if isinstance(v, str):
            return [{"category": "Technical Skills", "skills": [s.strip() for s in v.split(",") if s.strip()]}]
        if isinstance(v, dict):
            res = []
            for cat_name, skill_list in v.items():
                if isinstance(skill_list, list):
                    res.append({"category": cat_name, "skills": skill_list})
                elif isinstance(skill_list, str):
                    res.append({"category": cat_name, "skills": [s.strip() for s in skill_list.split(",") if s.strip()]})
            return res
        if isinstance(v, list):
            if v and isinstance(v[0], str):
                return [{"category": "Technical Skills", "skills": [str(x) for x in v if x]}]
            return v
        return []

    @field_validator("experience", mode="before")
    @classmethod
    def validate_experience_list(cls, v: Any) -> Any:
        if v is None:
            return []
        if isinstance(v, dict):
            return [v]
        if isinstance(v, str):
            return [{"role": v}] if v.strip() else []
        if isinstance(v, list):
            return [x for x in v if x is not None]
        return []

    @field_validator("projects", mode="before")
    @classmethod
    def validate_projects_list(cls, v: Any) -> Any:
        if v is None:
            return []
        if isinstance(v, dict):
            return [v]
        if isinstance(v, str):
            return [{"title": v}] if v.strip() else []
        if isinstance(v, list):
            return [x for x in v if x is not None]
        return []

    @field_validator("education", mode="before")
    @classmethod
    def validate_education_list(cls, v: Any) -> Any:
        if v is None:
            return []
        if isinstance(v, dict):
            return [v]
        if isinstance(v, str):
            return [{"degree": v}] if v.strip() else []
        if isinstance(v, list):
            return [x for x in v if x is not None]
        return []

    @field_validator("certifications", mode="before")
    @classmethod
    def validate_certifications_list(cls, v: Any) -> Any:
        if v is None:
            return []
        if isinstance(v, str):
            return [{"name": v}] if v.strip() else []
        if isinstance(v, dict):
            return [v]
        if isinstance(v, list):
            res = []
            for item in v:
                if item is None:
                    continue
                if isinstance(item, str):
                    if item.strip():
                        res.append({"name": item.strip(), "url": ""})
                else:
                    res.append(item)
            return res
        return []

    @field_validator("improvement_suggestions", mode="before")
    @classmethod
    def validate_imp_suggestions(cls, v: Any) -> Any:
        if v is None:
            return ImprovementSuggestions()
        if isinstance(v, str):
            return {"recommendations": [v.strip()]} if v.strip() else ImprovementSuggestions()
        if isinstance(v, list):
            return {"recommendations": [str(x).strip() for x in v if x is not None and str(x).strip()]}
        if isinstance(v, dict):
            recs = v.get("recommendations", v.get("suggestions", v.get("improvement_suggestions", [])))
            if isinstance(recs, list):
                return {"recommendations": [str(x).strip() for x in recs if x is not None and str(x).strip()]}
            if isinstance(recs, str):
                return {"recommendations": [recs.strip()]} if recs.strip() else ImprovementSuggestions()
        return v

    @field_validator("ats_keywords_used", mode="before")
    @classmethod
    def validate_keywords(cls, v: Any) -> list[str]:
        if v is None:
            return []
        if isinstance(v, str):
            return [k.strip() for k in v.split(",") if k.strip()]
        if isinstance(v, list):
            return [str(k).strip() for k in v if k is not None and str(k).strip()]
        return []