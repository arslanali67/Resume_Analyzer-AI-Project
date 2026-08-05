import sqlite3
from pathlib import Path

DB_PATH = Path("data/resume_analyzer.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_database():
    conn = get_connection()

    conn.execute("""
    CREATE TABLE IF NOT EXISTS evaluations (

        filename TEXT PRIMARY KEY,

        candidate_name TEXT,
        email TEXT,
        phone TEXT,

        location TEXT,
        education TEXT,
        current_role TEXT,

        experience_years REAL,

        match_score INTEGER,

        recommendation TEXT,

        strengths TEXT,
        weaknesses TEXT,

        matching_skills TEXT,
        missing_skills TEXT

    )
    """)

    conn.commit()
    conn.close()