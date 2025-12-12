import sqlite3
import os

# Database file path
DB_FILE = "bolsifyshop.db"

def add_images_column():
    if not os.path.exists(DB_FILE):
        print(f"Error: Database file '{DB_FILE}' not found.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(products)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if "images" in columns:
            print("Column 'images' already exists in 'products' table.")
        else:
            print("Adding 'images' column to 'products' table...")
            cursor.execute("ALTER TABLE products ADD COLUMN images TEXT")
            conn.commit()
            print("Successfully added 'images' column.")
            
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_images_column()
