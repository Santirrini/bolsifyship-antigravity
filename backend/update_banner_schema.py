import sqlite3

# Database file path
DB_FILE = "bolsifyshop.db"

def add_column(cursor, table_name, column_name, column_type):
    try:
        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")
        print(f"Added column {column_name} to {table_name}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"Column {column_name} already exists in {table_name}")
        else:
            print(f"Error adding column {column_name}: {e}")

def update_schema():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Add new columns to banners table
    add_column(cursor, "banners", "image_mobile", "TEXT")
    add_column(cursor, "banners", "action_type", "TEXT DEFAULT 'url'")
    add_column(cursor, "banners", "action_value", "TEXT")
    add_column(cursor, "banners", "start_date", "TEXT")
    add_column(cursor, "banners", "end_date", "TEXT")
    add_column(cursor, "banners", "views", "INTEGER DEFAULT 0")
    add_column(cursor, "banners", "clicks", "INTEGER DEFAULT 0")

    conn.commit()
    conn.close()
    print("Schema update complete.")

if __name__ == "__main__":
    update_schema()
