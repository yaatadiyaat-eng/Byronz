from database.db import get_connection

class DBMemory:
    def __init__(self, session_id):
        self.session_id = session_id

    def add(self, role, content):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
            (self.session_id, role, content)
        )

        conn.commit()
        conn.close()

    def get_context(self, limit=8):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT role, content 
            FROM messages 
            WHERE session_id = ?
            ORDER BY id DESC 
            LIMIT ?
            """,
            (self.session_id, limit)
        )

        rows = cursor.fetchall()
        conn.close()

        rows = rows[::-1]

        context = ""
        for row in rows:
            context += f"{row['role']}: {row['content']}\n"

        return context

    def clear(self):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM messages WHERE session_id = ?",
            (self.session_id,)
        )

        conn.commit()
        conn.close()
