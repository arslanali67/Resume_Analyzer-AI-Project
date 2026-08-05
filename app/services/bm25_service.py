from langchain_community.retrievers import BM25Retriever


def create_bm25_retriever(documents, k=3):
    """
    Create a BM25 keyword retriever
    from a list of LangChain Documents.
    """

    retriever = BM25Retriever.from_documents(documents)

    retriever.k = k

    return retriever