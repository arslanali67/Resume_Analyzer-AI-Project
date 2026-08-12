from app.services.resume_generator import generate_resume_pdf
from app.schemas.resume_rewrite_schema import ResumeRewrite


# Use your actual metadata object here
metadata = ...

# Use your actual rewritten resume object here
rewritten_resume = ...


pdf_path = generate_resume_pdf(
    metadata=metadata,
    rewritten_resume=rewritten_resume,
)

print("PDF generated:")
print(pdf_path)