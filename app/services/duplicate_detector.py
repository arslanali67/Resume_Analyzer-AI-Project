import hashlib

from app.services.vector_store import get_vector_store


# Actions
ACTION_INSERT = "insert"
ACTION_UPDATE = "update"
ACTION_DUPLICATE = "duplicate"


def generate_resume_hash(text):
    """
    Generate SHA256 hash of a resume.
    """

    return hashlib.sha256(
        text.encode("utf-8")
    ).hexdigest()


def resume_exists(filename):
    """
    Check whether a resume filename
    already exists in Chroma.
    """

    vector_store = get_vector_store()

    result = vector_store.get(
        where={
            "filename": filename
        }
    )

    return len(result["ids"]) > 0


def get_resume_hash(filename):
    """
    Get stored hash for a resume.
    """

    vector_store = get_vector_store()

    result = vector_store.get(
        where={
            "filename": filename
        }
    )

    if len(result["metadatas"]) == 0:
        return None

    return result["metadatas"][0]["resume_hash"]


def is_duplicate_resume(resume_hash):
    """
    Check if this hash already exists.
    """

    vector_store = get_vector_store()

    result = vector_store.get(
        where={
            "resume_hash": resume_hash
        }
    )

    return len(result["ids"]) > 0


def get_resume_action(
    filename,
    resume_hash,
):
    """
    Decide whether to:

    - insert
    - update
    - duplicate
    """

    # Same filename already exists
    if resume_exists(filename):

        stored_hash = get_resume_hash(filename)

        if stored_hash == resume_hash:
            return ACTION_DUPLICATE

        return ACTION_UPDATE

    # Different filename
    if is_duplicate_resume(resume_hash):
        return ACTION_DUPLICATE

    return ACTION_INSERT