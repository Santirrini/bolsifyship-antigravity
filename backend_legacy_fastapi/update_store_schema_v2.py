import sqlite3
import os

# Database file path
DB_FILE = "bolsifyshop.db"

def add_column(cursor, table_name, column_name, column_type):
    try:
        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")
        print(f"Successfully added column '{column_name}' to table '{table_name}'")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"Column '{column_name}' already exists in table '{table_name}'")
        else:
            print(f"Error adding column '{column_name}': {e}")

def update_schema():
    if not os.path.exists(DB_FILE):
        print(f"Database file {DB_FILE} not found.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    print("Updating 'stores' table schema...")
    
    # Add new columns for store customization
    add_column(cursor, "stores", "phone", "VARCHAR")
    add_column(cursor, "stores", "address", "VARCHAR")
    add_column(cursor, "stores", "contact_email", "VARCHAR")
    add_column(cursor, "stores", "shipping_policy", "VARCHAR")
    add_column(cursor, "stores", "return_policy", "VARCHAR")

    conn.commit()
    conn.close()
    print("Schema update complete.")

if __name__ == "__main__":
    update_schema()
