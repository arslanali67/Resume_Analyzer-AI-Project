import json

from app.services.database import get_connection


def save_evaluation(
    filename,
    metadata,
    evaluation,
):
    """
    Save or update evaluation results.
    """
    print("Saving evaluation...")
    print(filename)

    conn = get_connection()

    conn.execute(
        """
        INSERT OR REPLACE INTO evaluations (

            filename,
            candidate_name,
            email,
            phone,

            location,
            education,
            current_role,

            experience_years,

            match_score,

            recommendation,

            strengths,
            weaknesses,

            matching_skills,
            missing_skills

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

            evaluation.match_score,
            evaluation.hiring_recommendation,

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
        SELECT *
        FROM evaluations
        ORDER BY match_score DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    evaluations = []

    for row in rows:

        evaluations.append(
            {
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

    query = "SELECT * FROM evaluations WHERE 1=1"
    params = []

    # -----------------------------
    # Match Score
    # -----------------------------
    if filters.match_score_min is not None:
        query += " AND match_score >= ?"
        params.append(filters.match_score_min)

    if filters.match_score_max is not None:
        query += " AND match_score <= ?"
        params.append(filters.match_score_max)

    # -----------------------------
    # Recommendation
    # -----------------------------
    if filters.recommendation:
        query += " AND recommendation = ?"
        params.append(filters.recommendation)

    # -----------------------------
    # Location
    # -----------------------------
    if filters.location:
        query += " AND location LIKE ?"
        params.append(f"%{filters.location}%")

    # -----------------------------
    # Education
    # -----------------------------
    if filters.education:
        query += " AND education LIKE ?"
        params.append(f"%{filters.education}%")

    # -----------------------------
    # Current Role
    # -----------------------------
    if filters.current_role:
        query += " AND current_role LIKE ?"
        params.append(f"%{filters.current_role}%")

    # -----------------------------
    # Experience
    # -----------------------------
    if filters.experience_min is not None:
        query += " AND experience_years >= ?"
        params.append(filters.experience_min)

    if filters.experience_max is not None:
        query += " AND experience_years <= ?"
        params.append(filters.experience_max)

    # -----------------------------
    # Sorting
    # -----------------------------
    query += " ORDER BY match_score DESC"

    # -----------------------------
    # Pagination
    # -----------------------------
    offset = (filters.page - 1) * filters.limit

    query += " LIMIT ? OFFSET ?"

    params.append(filters.limit)
    params.append(offset)

    cursor = conn.execute(query, params)

    rows = cursor.fetchall()

    # Count total records
    count_query = query.split(" ORDER BY ")[0]

    count_query = count_query.replace(
        "SELECT *",
        "SELECT COUNT(*)",
    )

    count_cursor = conn.execute(
        count_query,
        params[:-2],
    )

    total = count_cursor.fetchone()[0]

    conn.close()

    evaluations = []




        
    for row in rows:

        evaluation = {
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

    return {
        "total": total,
        "page": filters.page,
        "limit": filters.limit,
        "total_pages": (total + filters.limit - 1) // filters.limit,
        "results": evaluations,
    }