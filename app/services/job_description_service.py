from app.services.database import get_connection


# ----------------------------------------
# Create Job Description
# ----------------------------------------

def create_job_description(job):
    """
    Create a new job description.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        INSERT INTO job_descriptions (

            title,
            department,
            description

        )

        VALUES (?, ?, ?)
        """,
        (
            job.title,
            job.department,
            job.description,
        ),
    )

    conn.commit()

    job_id = cursor.lastrowid

    conn.close()

    return job_id


# ----------------------------------------
# Get All Job Descriptions
# ----------------------------------------

def get_all_job_descriptions():
    """
    Return all job descriptions.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        SELECT *
        FROM job_descriptions
        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()

    conn.close()

    jobs = []

    for row in rows:

        jobs.append(
            {
                "id": row["id"],
                "title": row["title"],
                "department": row["department"],
                "description": row["description"],
                "created_at": row["created_at"],
            }
        )

    return jobs


# ----------------------------------------
# Get Single Job Description
# ----------------------------------------

def get_job_description(job_id):
    """
    Return one job description.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        SELECT *
        FROM job_descriptions
        WHERE id = ?
        """,
        (job_id,),
    )

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return None

    return {
        "id": row["id"],
        "title": row["title"],
        "department": row["department"],
        "description": row["description"],
        "created_at": row["created_at"],
    }


# ----------------------------------------
# Update Job Description
# ----------------------------------------

def update_job_description(job_id, job):
    """
    Update an existing job description.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        UPDATE job_descriptions

        SET

            title = ?,
            department = ?,
            description = ?

        WHERE id = ?
        """,
        (
            job.title,
            job.department,
            job.description,
            job_id,
        ),
    )

    conn.commit()

    updated = cursor.rowcount

    conn.close()

    return updated > 0


# ----------------------------------------
# Delete Job Description
# ----------------------------------------

def delete_job_description(job_id):
    """
    Delete a job description.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        DELETE
        FROM job_descriptions
        WHERE id = ?
        """,
        (job_id,),
    )

    conn.commit()

    deleted = cursor.rowcount

    conn.close()

    return deleted > 0

def get_job_description_text(job_id: int):
    """
    Return only the job description text.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        SELECT description
        FROM job_descriptions
        WHERE id = ?
        """,
        (job_id,),
    )

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return None

    return row["description"]