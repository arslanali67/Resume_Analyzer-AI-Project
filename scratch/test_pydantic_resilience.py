from typing import Any
import json
from app.schemas.resume_rewrite_schema import (
    ResumeRewrite,
    ProfessionalSummary,
    SkillCategory,
    ExperienceItem,
    ProjectItem,
    EducationItem,
    CertificationItem,
    ImprovementSuggestions,
)

test_cases = [
    # 1. Empty dict
    {},
    
    # 2. String professional summary & missing fields
    {
        "professional_summary": "Experienced Python Developer with 3+ years experience.",
        "skills": ["Python", "FastAPI", "SQL"],
        "improvement_suggestions": ["Add Docker experience", "Include unit tests"]
    },
    
    # 3. Skills as dictionary mapping category to list of skills
    {
        "professional_summary": {"content": "Summary text"},
        "skills": {
            "Programming": ["Python", "JavaScript"],
            "Databases": ["PostgreSQL", "MongoDB"]
        },
        "experience": [
            {"company": "Tech Corp", "role": "Senior Dev", "duration": "2021 - Present", "bullets": "Built APIs"}
        ],
        "improvement_suggestions": "Learn Kubernetes"
    },
    
    # 4. None / Null values in fields
    {
        "professional_summary": None,
        "skills": None,
        "experience": None,
        "projects": None,
        "education": None,
        "certifications": None,
        "ats_keywords_used": None,
        "improvement_suggestions": None
    },

    # 5. Experience / Education / Projects as single dict or with missing required fields
    {
        "professional_summary": "Summary",
        "experience": {"company": "Solo Corp"},
        "projects": {"title": "Solo Project"},
        "education": {"degree": "BS CS"},
        "certifications": "AWS Certified",
        "improvement_suggestions": {"recommendations": ["Do X", "Do Y"]}
    }
]

for i, tc in enumerate(test_cases, 1):
    print(f"--- Test Case {i} ---")
    try:
        obj = ResumeRewrite.model_validate(tc)
        print("SUCCESS:", obj.model_dump_json(indent=2)[:200] + "...")
    except Exception as e:
        print("ERROR:", type(e).__name__, e)
