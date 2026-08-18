from app.services.database import get_connection


def save_candidate(filename, metadata):
    """
    Save candidate if it doesn't already exist.
    Return candidate_id.
    """

    conn = get_connection()

    existing = conn.execute(
        """
        SELECT candidate_id
        FROM candidates
        WHERE filename = ?
        """,
        (filename,),
    ).fetchone()

    if existing:
        conn.close()
        return existing["candidate_id"]

    cursor = conn.execute(
        """
        INSERT INTO candidates (

            filename,
            candidate_name,
            email,
            phone,
            location,
            education,
            current_role,
            experience_years

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            filename,
            metadata.candidate_name,
            metadata.email,
            metadata.phone,
            metadata.location,
            metadata.education,
            metadata.current_role,
            metadata.experience_years,
        ),
    )

    conn.commit()

    candidate_id = cursor.lastrowid

    conn.close()

    return candidate_id