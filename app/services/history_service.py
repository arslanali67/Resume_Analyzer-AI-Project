from app.services.database import get_connection


def get_candidate_history(filename: str):
    """
    Return all evaluations for a specific candidate,
    ordered from newest to oldest.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        SELECT

            e.evaluation_id,
            e.filename,
            e.job_id,

            j.title AS job_title,

            e.match_score,
            e.recommendation,
            e.created_at

        FROM evaluations e

        JOIN job_descriptions j
            ON e.job_id = j.id

        WHERE e.filename = ?

        ORDER BY e.created_at DESC
        """,
        (filename,),
    )

    rows = cursor.fetchall()

    conn.close()

    if not rows:
        return None

    history = []

    for row in rows:

        history.append(
            {
                "evaluation_id": row["evaluation_id"],
                "job_id": row["job_id"],
                "job_title": row["job_title"],
                "match_score": row["match_score"],
                "recommendation": row["recommendation"],
                "created_at": row["created_at"],
            }
        )

    return {
        "filename": filename,
        "total_evaluations": len(history),
        "history": history,
    }