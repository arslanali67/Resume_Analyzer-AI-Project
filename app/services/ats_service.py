from app.services.file_reader import read_document
from app.services.text_cleaner import clean_text
from app.services.metadata_extractor import extract_metadata
from app.services.rag_service import evaluate_resume


def analyze_resume(
    resume_path: str,
    job_description: str,
):
    """
    Analyze one uploaded candidate resume.

    Returns
    -------
    tuple:
        resume_text
        metadata
        evaluation
    """

    # --------------------------------------------------
    # Step 1: Read Resume
    # --------------------------------------------------

    text = read_document(resume_path)

    if not text or not text.strip():
        raise ValueError(
            "Could not extract text from the uploaded resume."
        )

    # --------------------------------------------------
    # Step 2: Clean Resume
    # --------------------------------------------------

    text = clean_text(text)

    # --------------------------------------------------
    # Step 3: Extract Metadata
    # --------------------------------------------------

    metadata = extract_metadata(text)

    # --------------------------------------------------
    # Step 4: ATS Evaluation
    # --------------------------------------------------

    evaluation = evaluate_resume(
        resume_text=text,
        job_description=job_description,
    )

    if evaluation is None:
        raise ValueError(
            "Resume evaluation failed."
        )

    # --------------------------------------------------
    # Return all three results
    # --------------------------------------------------

    return text, metadata, evaluation