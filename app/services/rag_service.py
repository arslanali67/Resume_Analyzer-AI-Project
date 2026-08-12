from app.services.hybrid_search import hybrid_search
from app.chains.evaluation_chain import evaluation_chain


def evaluate_resume(
    job_description: str,
    filename: str | None = None,
    resume_text: str | None = None,
):
    """
    Evaluate a resume against a job description.

    HR Mode:
        - Uses Hybrid Search (filename)

    Candidate Portal Mode:
        - Uses uploaded resume text directly
    """

    # ---------------------------------
    # Candidate Portal
    # ---------------------------------
    if resume_text is not None:

        print("1. Using uploaded resume...")

        context = resume_text

    # ---------------------------------
    # HR Portal
    # ---------------------------------
    else:

        print("1. Starting hybrid search...")

        documents = hybrid_search(
            job_description=job_description,
            filename=filename,
        )

        if not documents:
            print("No matching resume chunks found.")
            return None

        print(f"2. Retrieved {len(documents)} documents")

        context = "\n\n".join(
            doc.page_content
            for doc in documents
        )

    # ---------------------------------
    # Call LLM
    # ---------------------------------

    print("3. Calling LLM...")

    try:

        result = evaluation_chain.invoke(
            {
                "resume": context,
                "job_description": job_description,
            }
        )

    except Exception as e:

        print(f"LLM Error: {e}")
        return None

    return result