import os

from app.ingest import ingest_resume


def ingest_folder(folder_path):
    """
    Index all PDF resumes in the given folder.
    """

    pdf_files = [
        file
        for file in os.listdir(folder_path)
        if file.lower().endswith(".pdf")
    ]

    if not pdf_files:
        print("No PDF resumes found.")
        return

    print(f"Found {len(pdf_files)} resumes.\n")

    for file in pdf_files:

        full_path = os.path.join(folder_path, file)

        print(f"Indexing {file}...")

        ingest_resume(full_path)

    print("\nAll resumes indexed successfully.")