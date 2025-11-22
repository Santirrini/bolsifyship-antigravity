import sqlite3
import os

# Database file path
DB_FILE = "bolsifyshop.db"

def update_schema():
    if not os.path.exists(DB_FILE):
        print(f"Database file {DB_FILE} not found.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Columns to add
    new_columns = [
        ("banner_url", "VARCHAR"),
        ("category", "VARCHAR"),
        ("rating", "FLOAT DEFAULT 0.0"),
        ("response_rate", "INTEGER DEFAULT 100")
    ]

    print("Checking 'stores' table schema...")
    
    # Get existing columns
    cursor.execute("PRAGMA table_info(stores)")
    existing_columns = [info[1] for info in cursor.fetchall()]

    for col_name, col_type in new_columns:
        if col_name not in existing_columns:
            print(f"Adding column '{col_name}' to 'stores' table...")
            try:
                cursor.execute(f"ALTER TABLE stores ADD COLUMN {col_name} {col_type}")
                print(f"Successfully added '{col_name}'.")
            except sqlite3.OperationalError as e:
                print(f"Error adding '{col_name}': {e}")
        else:
            print(f"Column '{col_name}' already exists.")

    conn.commit()
    conn.close()
    print("Schema update complete.")

if __name__ == "__main__":
    update_schema()
