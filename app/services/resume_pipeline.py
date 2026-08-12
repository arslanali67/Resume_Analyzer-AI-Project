from app.services.file_reader import read_document
from app.services.text_cleaner import clean_text
from app.services.metadata_extractor import extract_metadata

from app.services.candidate_ai_service import (
    evaluate_uploaded_resume,
)

from app.services.resume_rewriter import (
    rewrite_resume,
)

from app.services.resume_generator import (
    generate_resume_pdf,
)


def process_resume(
    resume_path: str,
    job_description: str,
):
    """
    Complete candidate resume processing pipeline.

    Flow:

    Resume
        ↓
    Read document
        ↓
    Clean text
        ↓
    Extract metadata
        ↓
    ATS evaluation
        ↓
    Resume rewriting
        ↓
    PDF generation
    """

    # --------------------------------------------------
    # 1. Read Resume
    # --------------------------------------------------

    print("1. Reading resume...")

    resume_text = read_document(
        resume_path
    )

    if not resume_text:
        raise ValueError(
            "Could not extract text from the uploaded resume."
        )

    # --------------------------------------------------
    # 2. Clean Resume
    # --------------------------------------------------

    print("2. Cleaning resume text...")

    resume_text = clean_text(
        resume_text
    )

    # --------------------------------------------------
    # 3. Extract Candidate Metadata
    # --------------------------------------------------

    print("3. Extracting candidate metadata...")

    metadata = extract_metadata(
        resume_text
    )

    # --------------------------------------------------
    # 4. ATS Evaluation
    # --------------------------------------------------

    print("4. Running ATS evaluation...")

    evaluation = evaluate_uploaded_resume(
        resume_text=resume_text,
        job_description=job_description,
    )

    if evaluation is None:
        raise ValueError(
            "ATS evaluation failed."
        )

    # --------------------------------------------------
    # 5. Rewrite Resume
    # --------------------------------------------------

    print("5. Rewriting resume...")

    rewritten_resume = rewrite_resume(
        resume=resume_text,
        job_description=job_description,
        evaluation=evaluation,
    )

    if rewritten_resume is None:
        raise ValueError(
            "Resume rewriting failed."
        )

    # --------------------------------------------------
    # 6. Generate PDF
    # --------------------------------------------------

    print("6. Generating ATS-friendly PDF...")

    pdf_path = generate_resume_pdf(
        metadata=metadata,
        rewritten_resume=rewritten_resume,
    )

    if not pdf_path:
        raise ValueError(
            "PDF generation failed."
        )

    print(
        f"7. PDF generated successfully: {pdf_path}"
    )

    # --------------------------------------------------
    # 7. Return Complete Result
    # --------------------------------------------------

    return {
        "metadata": metadata,
        "evaluation": evaluation,
        "rewritten_resume": rewritten_resume,
        "pdf_path": pdf_path,
    }