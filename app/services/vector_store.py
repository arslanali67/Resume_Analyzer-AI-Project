from langchain_chroma import Chroma
from langchain_core.documents import Document

from app.services.embedding_model import get_embedding_model


PERSIST_DIRECTORY = "chroma_db"
COLLECTION_NAME = "resume_analyzer"


def get_vector_store():
    """
    Load or create the Chroma vector database.
    """

    return Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=get_embedding_model(),
    )


def create_documents(chunks, metadata):
    """
    Convert text chunks into LangChain Document objects.

    Args:
        chunks (list[str]): List of text chunks.
        metadata (dict): Metadata common to all chunks.

    Returns:
        list[Document]
    """

    documents = []

    for chunk_id, chunk in enumerate(chunks):

        document = Document(
            page_content=chunk,
            metadata={
                **metadata,
                "chunk_id": chunk_id,
            },
        )

        documents.append(document)

    return documents


def add_documents(vector_store, documents):
    """Add documents in vector database"""

    ids = []

    for doc in documents:

        ids.append(
            f"{doc.metadata['filename']}_{doc.metadata['chunk_id']}"
        )

    vector_store.add_documents(
        documents=documents,
        ids=ids,
    )


def get_retriever(k=5, filters=None):
    """
    Create a retriever.

    Args:
        k: Number of results.
        filters: Metadata filter dictionary.
    """

    vector_store = get_vector_store()

    search_kwargs = {"k": k}

    if filters:
        search_kwargs["filter"] = filters

    return vector_store.as_retriever(
        search_kwargs=search_kwargs
    )

def delete_resume(filename):
    """
    Delete all chunks belonging to a resume.

    Returns:
        int: Number of chunks deleted.
    """

    vector_store = get_vector_store()

    # Count chunks before deleting
    existing = vector_store._collection.get(
        where={
            "filename": filename
        }
    )

    deleted_count = len(existing["ids"])

    if deleted_count == 0:
        return 0

    vector_store._collection.delete(
        where={
            "filename": filename
        }
    )

    return deleted_count

def get_resume_documents(filename):
    """
    Return all chunks of a specific resume
    as LangChain Document objects.
    """

    vector_store = get_vector_store()

    data = vector_store.get(
        where={
            "filename": filename
        },
        include=["documents", "metadatas"]
    )

    documents = []

    for content, metadata in zip(
        data["documents"],
        data["metadatas"],
    ):

        documents.append(
            Document(
                page_content=content,
                metadata=metadata,
            )
        )

    return documents

def get_all_indexed_resumes():
    """
    Return all unique indexed resume filenames
    stored in ChromaDB.
    """

    vector_store = get_vector_store()

    data = vector_store.get(
        include=["metadatas"]
    )

    filenames = set()

    for metadata in data["metadatas"]:

        filename = metadata.get("filename")

        if filename:
            filenames.add(filename)

    return sorted(list(filenames))


if __name__ == "__main__":

    resumes = get_all_indexed_resumes()

    print(resumes)