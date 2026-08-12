import uuid


def generate_job_id():
    """
    Generate a unique Job Evaluation ID.
    """
    return str(uuid.uuid4())