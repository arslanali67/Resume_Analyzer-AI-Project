import json

from app.services.database import get_connection


def save_evaluation(
    candidate_id,
    job_id,
    evaluation,
):
    """
    Save or update evaluation results.
    """
    print("Saving evaluation...")


    conn = get_connection()

    conn.execute(
        """
        INSERT INTO evaluations (

            candidate_id,
            job_id,

            match_score,

            recommendation,
            recommendation_reason,

            strengths,
            weaknesses,

            matching_skills,
            missing_skills

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

        """,
        (

            candidate_id,
            job_id,

            evaluation.match_score,

            evaluation.recommendation,
            evaluation.recommendation_reason,

            json.dumps(evaluation.strengths),
            json.dumps(evaluation.weaknesses),

            json.dumps(evaluation.matching_skills),
            json.dumps(evaluation.missing_skills),

        ),
    )

    conn.commit()
    conn.close()

    
def get_all_evaluations():
    """
    Return all stored evaluation results.
    """

    conn = get_connection()

    cursor = conn.execute("""
        SELECT
            e.*,
            c.filename,
            c.candidate_name,
            c.email,
            c.phone,
            c.location,
            c.education,
            c.current_role,
            c.experience_years

        FROM evaluations e

        JOIN candidates c
        ON e.candidate_id = c.candidate_id

        ORDER BY e.created_at DESC
    """)

    rows = cursor.fetchall()

    

    conn.close()

    evaluations = []

    for row in rows:

        evaluations.append(
            {   
                "evaluation_id": row["evaluation_id"],
                "filename": row["filename"],
                "candidate_name": row["candidate_name"],
                "email": row["email"],
                "phone": row["phone"],
                "location": row["location"],
                "education": row["education"],
                "current_role": row["current_role"],
                "experience_years": row["experience_years"],
                "match_score": row["match_score"],
                "recommendation": row["recommendation"],
                "recommendation_reason": row["recommendation_reason"],
                "created_at": row["created_at"],
                "strengths": json.loads(row["strengths"]),
                "weaknesses": json.loads(row["weaknesses"]),
                "matching_skills": json.loads(row["matching_skills"]),
                "missing_skills": json.loads(row["missing_skills"]),
            }
        )

    return evaluations    


def filter_evaluations(filters):
    """
    Filter evaluation results using SQL.
    """

    conn = get_connection()

    query = """
        SELECT

            e.*,

            c.filename,
            c.candidate_name,
            c.email,
            c.phone,
            c.location,
            c.education,
            c.current_role,
            c.experience_years

        FROM evaluations e

        JOIN candidates c
        ON e.candidate_id = c.candidate_id

        WHERE 1=1
        """
    count_query = """
        SELECT COUNT(*)

        FROM evaluations e

        JOIN candidates c
        ON e.candidate_id = c.candidate_id

        WHERE 1=1
    """
    params = []

    # -----------------------------
    # Match Score
    # -----------------------------
    if filters.match_score_min is not None:
        query += " AND match_score >= ?"
        count_query += " AND match_score >= ?"
        params.append(filters.match_score_min)

    if filters.match_score_max is not None:
        query += " AND match_score <= ?"
        count_query += " AND match_score <= ?"
        params.append(filters.match_score_max)

    # -----------------------------
    # Recommendation
    # -----------------------------
    if filters.recommendation:
        query += " AND recommendation = ?"
        count_query += " AND recommendation = ?"
        params.append(filters.recommendation)

    # -----------------------------
    # Location
    # -----------------------------
    if filters.location:
        query += " AND location LIKE ?"
        count_query += " AND location LIKE ?"
        params.append(f"%{filters.location}%")

    # -----------------------------
    # Education
    # -----------------------------
    if filters.education:
        query += " AND education LIKE ?"
        count_query += " AND education LIKE ?"
        params.append(f"%{filters.education}%")

    # -----------------------------
    # Current Role
    # -----------------------------
    if filters.current_role:
        query += " AND current_role LIKE ?"
        count_query += " AND current_role LIKE ?"
        params.append(f"%{filters.current_role}%")

    # -----------------------------
    # Experience
    # -----------------------------
    if filters.experience_min is not None:
        query += " AND experience_years >= ?"
        count_query += " AND experience_years >= ?"
        params.append(filters.experience_min)

    if filters.experience_max is not None:
        query += " AND experience_years <= ?"
        count_query += " AND experience_years <= ?"
        params.append(filters.experience_max)

    # -----------------------------
    # Sorting
    # -----------------------------

    allowed_columns = {

        "match_score",
        "experience_years",
        "candidate_name",
        "current_role",
        "recommendation",
        "created_at",

    }

    sort_by = (
        filters.sort_by
        if filters.sort_by in allowed_columns
        else "match_score"
    )

    order = (
        "ASC"
        if filters.order.lower() == "asc"
        else "DESC"
    )

    if sort_by in {
        "candidate_name",
        "experience_years",
        "current_role",
    }:
        query += f" ORDER BY c.{sort_by} {order}"
    else:
        query += f" ORDER BY e.{sort_by} {order}"

    cursor = conn.execute(query, params)

    rows = cursor.fetchall()
    count_cursor = conn.execute(
        count_query,
        params,
    )

    total = count_cursor.fetchone()[0]


    evaluations = []

    for row in rows:

        evaluation = {
            "evaluation_id": row["evaluation_id"],
            "filename": row["filename"],
            "candidate_name": row["candidate_name"],
            "email": row["email"],
            "phone": row["phone"],
            "location": row["location"],
            "education": row["education"],
            "current_role": row["current_role"],
            "experience_years": row["experience_years"],
            "match_score": row["match_score"],
            "recommendation": row["recommendation"],
            "recommendation_reason": row["recommendation_reason"],
            "created_at": row["created_at"],
            "strengths": json.loads(row["strengths"]),
            "weaknesses": json.loads(row["weaknesses"]),
            "matching_skills": json.loads(row["matching_skills"]),
            "missing_skills": json.loads(row["missing_skills"]),
        }

        # -----------------------------
        # Matching Skills Filter
        # -----------------------------
        if filters.matching_skill:

            matching = [
                skill.lower()
                for skill in evaluation["matching_skills"]
            ]

            if filters.matching_skill.lower() not in matching:
                continue

        # -----------------------------
        # Missing Skills Filter
        # -----------------------------
        if filters.missing_skill:

            missing = [
                skill.lower()
                for skill in evaluation["missing_skills"]
            ]

            if filters.missing_skill.lower() not in missing:
                continue

        evaluations.append(evaluation)

    count_cursor = conn.execute(count_query, params)
    filtered_total = count_cursor.fetchone()[0]

    # -----------------------------
    # Python Pagination
    # -----------------------------
    start = (filters.page - 1) * filters.limit
    end = start + filters.limit

    paginated_results = evaluations[start:end]

    conn.close()

    return {
        "total": filtered_total,
        "page": filters.page,
        "limit": filters.limit,
        "total_pages": (filtered_total + filters.limit - 1) // filters.limit,
        "results": paginated_results,
    }

def get_job_evaluation_history(job_id: int):
    """
    Return all evaluations for a specific job.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        SELECT

            e.evaluation_id,
            e.job_id,
            e.match_score,
            e.recommendation,
            e.recommendation_reason,
            e.created_at,

            c.candidate_id,
            c.filename,
            c.candidate_name

        FROM evaluations e

        JOIN candidates c
        ON e.candidate_id = c.candidate_id

        WHERE e.job_id = ?

        ORDER BY e.created_at DESC
        """,
        (job_id,),
    )

    rows = cursor.fetchall()

    conn.close()

    history = []

    for row in rows:

        history.append(
            {
                "evaluation_id": row["evaluation_id"],
                "candidate_id": row["candidate_id"],
                "filename": row["filename"],
                "candidate_name": row["candidate_name"],
                "match_score": row["match_score"],
                "recommendation": row["recommendation"],
                "recommendation_reason": row["recommendation_reason"],
                "created_at": row["created_at"],
            }
        )

    return history