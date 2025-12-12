import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")
print(f"Testing connection to: {database_url}")

if "INSERT_PASSWORD_HERE" in database_url:
    print("ERROR: Please update the DATABASE_URL in .env with your actual password.")
    exit(1)

try:
    # sslmode=require is important for Supabase
    if "?" not in database_url:
        database_url += "?sslmode=require"
        
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version()"))
        version = result.fetchone()[0]
        print(f"SUCCESS: Connected to database! Version: {version}")
except Exception as e:
    print(f"FAILURE: Could not connect. Error: {e}")
