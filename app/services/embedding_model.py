from langchain_huggingface import HuggingFaceEmbeddings

_embedding_model = None


def get_embedding_model():
    """
    Load the embedding model only once.
    """

    global _embedding_model

    if _embedding_model is None:
        print("Loading embedding model...")

        _embedding_model = HuggingFaceEmbeddings(
            model_name="BAAI/bge-small-en-v1.5"
        )

    return _embedding_model