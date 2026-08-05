import json
from collections import Counter

from app.services.database import get_connection


def get_dashboard_statistics():
    """
    Return dashboard statistics.
    """

    conn = get_connection()

    cursor = conn.execute("""
        SELECT *
        FROM evaluations
    """)

    rows = cursor.fetchall()

    conn.close()

    if not rows:

        return {
            "total_candidates": 0,

            "hire": 0,
            "maybe": 0,
            "reject": 0,

            "hire_percentage": 0,
            "maybe_percentage": 0,
            "reject_percentage": 0,

            "average_score": 0,
            "highest_score": 0,
            "lowest_score": 0,
            "average_experience": 0,

            "top_skills": [],
            "top_candidates": [],

            "experience_distribution": {
                "0-2 Years": 0,
                "3-5 Years": 0,
                "6-10 Years": 0,
                "10+ Years": 0,
            },
        }

    total = len(rows)

    scores = []
    experiences = []
    
    hire = 0
    maybe = 0
    reject = 0

    skills = Counter()

    score_distribution = {
    "90-100": 0,
    "80-89": 0,
    "70-79": 0,
    "60-69": 0,
    "Below 60": 0,
     }

    experience_distribution = {
    "0-2 Years": 0,
    "3-5 Years": 0,
    "6-10 Years": 0,
    "10+ Years": 0,
    }

    

    for row in rows:

        scores.append(row["match_score"])

        score = row["match_score"]

        if score >= 90:
            score_distribution["90-100"] += 1

        elif score >= 80:
            score_distribution["80-89"] += 1

        elif score >= 70:
            score_distribution["70-79"] += 1

        elif score >= 60:
            score_distribution["60-69"] += 1

        else:
            score_distribution["Below 60"] += 1

        experiences.append(row["experience_years"])

        experience = row["experience_years"]

        if experience <= 2:
            experience_distribution["0-2 Years"] += 1

        elif experience <= 5:
            experience_distribution["3-5 Years"] += 1

        elif experience <= 10:
            experience_distribution["6-10 Years"] += 1

        else:
            experience_distribution["10+ Years"] += 1


        recommendation = row["recommendation"].lower()

        if recommendation == "hire":
            hire += 1

        elif recommendation == "maybe":
            maybe += 1

        else:
            reject += 1

        matching_skills = json.loads(
            row["matching_skills"]
        )

        skills.update(matching_skills)

    # -----------------------------
    # Recommendation Percentages
    # -----------------------------
    hire_percentage = round(
        (hire / total) * 100,
        2,
    )

    maybe_percentage = round(
        (maybe / total) * 100,
        2,
    )

    reject_percentage = round(
        (reject / total) * 100,
        2,
    )

    # -----------------------------
    # Top Skills
    # -----------------------------
    top_skills = []

    for skill, count in skills.most_common(10):

        top_skills.append(
            {
                "skill": skill,
                "count": count,
            }
        )

    # -----------------------------
    # Top Candidates
    # -----------------------------

    top_candidates = sorted(
        rows,
        key=lambda x: x["match_score"],
        reverse=True,
    )[:5]
    top_candidates_data = []

    for row in top_candidates:

        top_candidates_data.append(
            {
                "candidate_name": row["candidate_name"],
                "filename": row["filename"],
                "current_role": row["current_role"],
                "match_score": row["match_score"],
                "recommendation": row["recommendation"],
                "experience_years": row["experience_years"],
            }
        )

    return {
        
        "total_candidates": total,

        "hire": hire,
        "maybe": maybe,
        "reject": reject,

        "hire_percentage": hire_percentage,
        "maybe_percentage": maybe_percentage,
        "reject_percentage": reject_percentage,

        "average_score": round(
            sum(scores) / total,
            2,
        ),

        "highest_score": max(scores),

        "lowest_score": min(scores),

        "average_experience": round(
            sum(experiences) / total,
            2,
        ),
        
        "score_distribution": score_distribution,
        "experience_distribution": experience_distribution,

        "top_candidates": top_candidates_data,
        "top_skills": top_skills,
    }