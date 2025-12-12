import sqlite3

# Database file path
DB_FILE = "bolsifyshop.db"

def migrate_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # Add stock column
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0")
            print("Added 'stock' column.")
        except sqlite3.OperationalError as e:
            print(f"Skipping 'stock': {e}")

        # Add is_active column
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN is_active INTEGER DEFAULT 1")
            print("Added 'is_active' column.")
        except sqlite3.OperationalError as e:
            print(f"Skipping 'is_active': {e}")

        # Add sku column
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN sku VARCHAR")
            print("Added 'sku' column.")
        except sqlite3.OperationalError as e:
            print(f"Skipping 'sku': {e}")

        conn.commit()
        print("Migration completed successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_db()
