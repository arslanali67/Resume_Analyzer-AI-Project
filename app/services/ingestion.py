import os
from app.services.jd_reader import read_job_description
from app.services.file_reader import read_document
from app.services.pdf_reader import read_pdf
from app.services.text_cleaner import clean_text
from app.services.chunker import chunk_text
from app.services.vector_store import (
    get_vector_store,
    create_documents,
    add_documents,
)

def ingest_document(file_path, metadata):

    text = read_document(file_path)

    cleaned_text = clean_text(text)

    chunks = chunk_text(cleaned_text)

    documents = create_documents(
        chunks,
        metadata,
    )

    vector_store = get_vector_store()

    add_documents(
        vector_store,
        documents,
    )