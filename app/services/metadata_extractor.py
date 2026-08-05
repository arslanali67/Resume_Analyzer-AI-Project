from app.chains.metadata_chain import metadata_chain


def extract_metadata(resume_text):
    """
    Extract structured metadata from a resume.
    """

    metadata = metadata_chain.invoke(
        {
            "resume": resume_text,
        }
    )

    return metadata