import fitz  # PyMuPDF


def read_job_description(file_path):
    """
    Reads a job description PDF using PyMuPDF
    and returns the extracted text.
    """
    document = fitz.open(file_path)
    jd_text = ""

    for page in document:
        text = page.get_text()

        if text.strip():
            jd_text += text + "\n"

    document.close()
    return jd_text