from app.services.file_reader import read_document
from app.services.text_cleaner import clean_text
from app.services.chunker import chunk_text
from app.services.vector_store import delete_resume
from app.services.metadata_extractor import extract_metadata
import os
from app.services.vector_store import (
    get_vector_store,
    create_documents,
    add_documents,
)
from app.services.duplicate_detector import (
    generate_resume_hash,
    get_resume_action,
    ACTION_INSERT,
    ACTION_UPDATE,
    ACTION_DUPLICATE,
)




def ingest_resume(file_path):
    """
    Read a resume and store it in Chroma.
    """

    # Read document
    text = read_document(file_path)

    # Get filename
    filename = os.path.basename(file_path)

    # Clean text
    text = clean_text(text)

    # Generate unique fingerprint
    resume_hash = generate_resume_hash(text)

    # Decide what to do with this resume
    action = get_resume_action(
        filename,
        resume_hash,
    )

    if action == ACTION_DUPLICATE:

        print(f"Duplicate resume detected: {filename}")

        return ACTION_DUPLICATE


    elif action == ACTION_UPDATE:

        print(f"Updating existing resume: {filename}")

        delete_resume(filename)


    elif action == ACTION_INSERT:

        print(f"New resume detected: {filename}")

    # Extract structured metadata
    metadata = extract_metadata(text)

    # Split into chunks
    chunks = chunk_text(text)

    filename = os.path.basename(file_path)

    # Metadata
    document_metadata = {
    "source": "resume",
    "filename": filename,
    "resume_hash": resume_hash,

    "candidate_name": metadata.candidate_name,
    "email": metadata.email,
    "phone": metadata.phone,
    "education": metadata.education,
    "experience_years": metadata.experience_years,
    "current_role": metadata.current_role,
    "location": metadata.location,
    }

    # Convert to Documents
    documents = create_documents(
    chunks,
    document_metadata,)

    # Load vector store
    vector_store = get_vector_store()

    # Add documents
    add_documents(vector_store, documents)

    print(f"Successfully indexed {len(documents)} chunks.")
    return action
    


















if __name__ == "__main__":
    ingest_resume("data/resumes/sample_resume.pdf")
    