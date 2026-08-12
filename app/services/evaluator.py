import os

from app.services.vector_store import get_all_indexed_resumes
from app.services.rag_service import evaluate_resume
from app.services.file_reader import read_document
from app.services.text_cleaner import clean_text
from app.services.metadata_extractor import extract_metadata
from app.services.evaluation_database import save_evaluation
from app.services.candidate_database import save_candidate


def evaluate_all_resumes(
    folder_path,
    job_description,
    job_id,
):
    """
    Evaluate every resume in the folder.
    """

    results = []

    pdf_files = get_all_indexed_resumes()

    for file in pdf_files:

        print(f"Evaluating {file}...")

        # Full path
        file_path = os.path.join(
            folder_path,
            file,
        )

        # Read Resume
        text = read_document(file_path)

        # Clean Resume
        text = clean_text(text)

        # Extract metadata
        metadata = extract_metadata(text)

        # Save candidate and get candidate_id
        candidate_id = save_candidate(
            filename=file,
            metadata=metadata,
        )

        # Evaluate resume
        result = evaluate_resume(
            job_description=job_description,
            filename=file,
        )

        if result is None:
            continue

        # Save evaluation history
        save_evaluation(
            candidate_id=candidate_id,
            job_id=job_id,
            evaluation=result,
        )

        results.append(
            {
                "filename": file,
                "metadata": metadata,
                "evaluation": result,
            }
        )

    return results