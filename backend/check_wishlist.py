import sqlite3

# Connect to the database
conn = sqlite3.connect('bolsifyshop.db')
cursor = conn.cursor()

# Check wishlist items
print("=== WISHLIST ITEMS ===")
cursor.execute("SELECT * FROM wishlist_items")
rows = cursor.fetchall()
for row in rows:
    print(row)

print(f"\nTotal wishlist items: {len(rows)}")

# Check users
print("\n=== USERS ===")
cursor.execute("SELECT id, email, full_name FROM users")
users = cursor.fetchall()
for user in users:
    print(user)

conn.close()
