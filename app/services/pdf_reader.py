#from pypdf import PdfReader
import fitz #PyMuPDF


def read_pdf(pdf_path):

    """
    Reads a PDF resume using PyMuPDF
    and returns the extracted text.
    """
    document=fitz.open(pdf_path)
    resume_text = ""

    for page in document:
        text = page.get_text()

        if text.strip():
            resume_text += text + "\n"

    document.close()
    return resume_text