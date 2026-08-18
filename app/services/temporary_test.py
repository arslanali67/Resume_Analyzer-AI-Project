from app.services.database import get_connection

conn = get_connection()

conn.execute("DROP TABLE evaluations")

conn.commit()
conn.close()

print("Evaluations table deleted.")