from app.services.vector_store import (
    get_vector_store,
    get_resume_documents,
)
from app.services.bm25_service import create_bm25_retriever



def merge_and_rank_results(
    semantic_docs,
    keyword_docs,
    k,
):
    """
    Merge semantic and keyword search results
    using weighted ranking.
    """

    scores = {}

    # Score semantic results
    for rank, doc in enumerate(semantic_docs):

        score = k - rank

        key = doc.page_content

        if key not in scores:

            scores[key] = {
                "doc": doc,
                "score": 0,
            }

        scores[key]["score"] += score

    # Score keyword results
    for rank, doc in enumerate(keyword_docs):

        score = k - rank

        key = doc.page_content

        if key not in scores:

            scores[key] = {
                "doc": doc,
                "score": 0,
            }

        scores[key]["score"] += score

    ranked_docs = sorted(
        scores.values(),
        key=lambda x: x["score"],
        reverse=True,
    )

    return [
        item["doc"]
        for item in ranked_docs
    ]


def hybrid_search(job_description, filename, k=3):
    """
    Perform Hybrid Search using
    Chroma (semantic) + BM25 (keyword).
    """

    # Load vector store
    vector_store = get_vector_store()

    # -------------------------
    # Semantic Search (Chroma)
    # -------------------------

    semantic_retriever = vector_store.as_retriever(
        search_kwargs={
            "k": k,
            "filter": {
                "filename": filename
            }
        }
    )

    semantic_docs = semantic_retriever.invoke(
        job_description
    )

    # -------------------------
    # BM25 Search
    # -------------------------

    # Load ALL chunks of this resume
    resume_documents = get_resume_documents(
        filename
    )
    print(f"\nResume: {filename}")
    print(f"Chunks found: {len(resume_documents)}")

    # BM25 searches ALL resume chunks
    bm25 = create_bm25_retriever(
        resume_documents,
        k=k,
    )

    keyword_docs = bm25.invoke(
        job_description
    )

    # Merge both searches
    return merge_and_rank_results(
        semantic_docs=semantic_docs,
        keyword_docs=keyword_docs,
        k=k,
)