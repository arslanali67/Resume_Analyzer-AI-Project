import sqlite3
from pathlib import Path

DB_PATH = Path("data/resume_analyzer.db")
print(f"Using database: {DB_PATH.resolve()}")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_database():

    conn = get_connection()

    # -----------------------------
    # Job Descriptions
    # -----------------------------
    conn.execute("""
    CREATE TABLE IF NOT EXISTS job_descriptions (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        title TEXT NOT NULL,

        department TEXT,

        description TEXT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # -----------------------------
    # Candidates
    # -----------------------------
    conn.execute("""
    CREATE TABLE IF NOT EXISTS candidates (

        candidate_id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT UNIQUE,
        candidate_name TEXT,
        email TEXT,
        phone TEXT,
        location TEXT,
        education TEXT,
        current_role TEXT,
        experience_years REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # -----------------------------
    # Evaluations
    # -----------------------------
    conn.execute("""
    CREATE TABLE IF NOT EXISTS evaluations (

        evaluation_id INTEGER PRIMARY KEY AUTOINCREMENT,

        candidate_id INTEGER NOT NULL,

        job_id INTEGER NOT NULL,

        match_score INTEGER,

        recommendation TEXT,

        recommendation_reason TEXT,

        strengths TEXT,

        weaknesses TEXT,

        matching_skills TEXT,

        missing_skills TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(candidate_id)
            REFERENCES candidates(candidate_id)
            ON DELETE CASCADE,

        FOREIGN KEY(job_id)
            REFERENCES job_descriptions(id)
            ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()