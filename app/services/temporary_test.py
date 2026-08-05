from app.services.comparison_service import compare_candidates

print(
    compare_candidates(
        "sample_resume.pdf",
        "sample_resume1.pdf",
    )
)