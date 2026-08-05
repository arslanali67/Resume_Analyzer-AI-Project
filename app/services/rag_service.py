from app.services.hybrid_search import hybrid_search
from app.chains.evaluation_chain import evaluation_chain


def evaluate_resume(job_description, filename, k=3):
    """
    Retrieve relevant resume chunks and evaluate them
    against the job description.
    """

    # Retrieve relevant resume chunks using Hybrid Search
    print("1. Starting hybrid search...")
    documents = hybrid_search(
    job_description,
    filename,
    )       

    print(f"2. Retrieved {len(documents)} documents")

    context = "\n\n".join(doc.page_content for doc in documents)

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