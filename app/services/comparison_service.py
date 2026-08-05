from app.services.database import get_connection
import json


def get_candidate_comparison(filename1: str, filename2: str):
    """
    Compare two evaluated candidates.
    """

    conn = get_connection()

    cursor = conn.execute(
        """
        SELECT *
        FROM evaluations
        WHERE filename IN (?, ?)
        """,
        (filename1, filename2),
    )

    rows = cursor.fetchall()

    conn.close()

    if len(rows) != 2:
        return None

    candidates = []

    for row in rows:

        candidates.append(
            {
                "filename": row["filename"],
                "candidate_name": row["candidate_name"],
                "current_role": row["current_role"],
                "experience_years": row["experience_years"],
                "education": row["education"],
                "match_score": row["match_score"],
                "recommendation": row["recommendation"],
                "recommendation_reason": row["recommendation_reason"],
                "matching_skills": json.loads(row["matching_skills"]),
                "missing_skills": json.loads(row["missing_skills"]),
                "strengths": json.loads(row["strengths"]),
                "weaknesses": json.loads(row["weaknesses"]),
            }
        )

    return candidates


def compare_candidates(filename1: str, filename2: str):
    """
    Compare two candidates and determine
    winners across different categories.
    """

    candidates = get_candidate_comparison(
        filename1,
        filename2,
    )

    if candidates is None:
        return None

    c1 = candidates[0]
    c2 = candidates[1]

    winner = {}

    score_1 = 0
    score_2 = 0

    # -------------------------
    # Match Score
    # -------------------------

    if c1["match_score"] > c2["match_score"]:

        winner["score"] = c1["candidate_name"]
        score_1 += 1

    elif c2["match_score"] > c1["match_score"]:

        winner["score"] = c2["candidate_name"]
        score_2 += 1

    else:

        winner["score"] = "Tie"

    # -------------------------
    # Experience
    # -------------------------

    if c1["experience_years"] > c2["experience_years"]:

        winner["experience"] = c1["candidate_name"]
        score_1 += 1

    elif c2["experience_years"] > c1["experience_years"]:

        winner["experience"] = c2["candidate_name"]
        score_2 += 1

    else:

        winner["experience"] = "Tie"

    # -------------------------
    # Matching Skills
    # -------------------------

    if len(c1["matching_skills"]) > len(c2["matching_skills"]):

        winner["matching_skills"] = c1["candidate_name"]
        score_1 += 1

    elif len(c2["matching_skills"]) > len(c1["matching_skills"]):

        winner["matching_skills"] = c2["candidate_name"]
        score_2 += 1

    else:

        winner["matching_skills"] = "Tie"

    # -------------------------
    # Missing Skills
    # -------------------------

    if len(c1["missing_skills"]) < len(c2["missing_skills"]):

        winner["missing_skills"] = c1["candidate_name"]
        score_1 += 1

    elif len(c2["missing_skills"]) < len(c1["missing_skills"]):

        winner["missing_skills"] = c2["candidate_name"]
        score_2 += 1

    else:

        winner["missing_skills"] = "Tie"

    # -------------------------
    # Recommendation
    # -------------------------

    priority = {
        "Hire": 3,
        "Maybe": 2,
        "Reject": 1,
    }

    p1 = priority.get(c1["recommendation"], 0)
    p2 = priority.get(c2["recommendation"], 0)

    if p1 > p2:

        winner["recommendation"] = c1["candidate_name"]
        score_1 += 1

    elif p2 > p1:

        winner["recommendation"] = c2["candidate_name"]
        score_2 += 1

    else:

        winner["recommendation"] = "Tie"

    # -------------------------
    # Education
    # -------------------------

    education_1 = c1["education"].lower()
    education_2 = c2["education"].lower()

    if education_1 == education_2:

        winner["education"] = "Tie"

    elif "master" in education_1 and "master" not in education_2:

        winner["education"] = c1["candidate_name"]
        score_1 += 1

    elif "master" in education_2 and "master" not in education_1:

        winner["education"] = c2["candidate_name"]
        score_2 += 1

    elif "bachelor" in education_1 and "bachelor" not in education_2:

        winner["education"] = c1["candidate_name"]
        score_1 += 1

    elif "bachelor" in education_2 and "bachelor" not in education_1:

        winner["education"] = c2["candidate_name"]
        score_2 += 1

    else:

        winner["education"] = "Tie"

    # -------------------------
    # Overall Winner
    # -------------------------

    if score_1 > score_2:

        winner["overall"] = c1["candidate_name"]

    elif score_2 > score_1:

        winner["overall"] = c2["candidate_name"]

    else:

        winner["overall"] = "Tie"

    # Total comparison categories
    total_categories = 6

    return {

        "winner": winner,

        "comparison_summary": {

            c1["candidate_name"]: {
                "wins": score_1,
                "percentage": round(
                    (score_1 / total_categories) * 100,
                    1,
                ),
            },

            c2["candidate_name"]: {
                "wins": score_2,
                "percentage": round(
                    (score_2 / total_categories) * 100,
                    1,
                ),
            },

        },

        "candidate_1": c1,

        "candidate_2": c2,
    }