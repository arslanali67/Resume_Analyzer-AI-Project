from pathlib import Path
import fitz
from docx import Document


def read_pdf(file_path: str) -> str:
    """
    Read text from a PDF document.
    """

    document = fitz.open(file_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text

def read_docx(file_path: str) -> str:
    """
    Read text from a DOCX document.
    """

    document = Document(file_path)

    text = []

    for paragraph in document.paragraphs:
        text.append(paragraph.text)

    return "\n".join(text)


def read_text(file_path: str) -> str:
    """
    Read text from a TXT document.
    """

    return Path(file_path).read_text(
        encoding="utf-8"
    )


def read_document(file_path: str) -> str:
    """
    Read a document based on its file extension.
    """

    extension = Path(file_path).suffix.lower()

    readers = {
    ".pdf": read_pdf,
    ".docx": read_docx,
    ".txt": read_text,
    }

    if extension not in readers:
        raise ValueError(
            f"Unsupported file type: {extension}"
        )

    return readers[extension](file_path)