from langchain_chroma import Chroma
from app.services.embedding_model import get_embedding_model


def load_vector_store():
    """Load the existing Chroma vector database."""

    return Chroma(
        collection_name="resume_analyzer",
        persist_directory="chroma_db",
        embedding_function=get_embedding_model(),
    )


def get_retriever(k=3, filters=None):
    """Return a retriever object."""

    vector_store = load_vector_store()

    search_kwargs = {
        "k": k
    }

    if filters:
        search_kwargs["filter"] = filters

    return vector_store.as_retriever(
        search_kwargs=search_kwargs
    )