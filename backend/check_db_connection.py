import os
import socket
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")
print(f"Testing connection to: {database_url}")

if "INSERT_PASSWORD_HERE" in database_url:
    print("ERROR: Please update the DATABASE_URL in .env with your actual password.")
    exit(1)

# Hack to force IPv4
try:
    # Parse host from URL
    from urllib.parse import urlparse
    parsed = urlparse(database_url)
    hostname = parsed.hostname
    port = parsed.port or 5432
    
    print(f"Resolving IPv4 for {hostname}...")
    ipv4_addr = socket.getaddrinfo(hostname, port, socket.AF_INET)[0][4][0]
    print(f"Resolved to: {ipv4_addr}")
    
    # Replace host with IPv4 in connection string
    database_url = database_url.replace(hostname, ipv4_addr)
    print(f"Modified connection string (using IP): {database_url}")

except Exception as e:
    print(f"Warning: Could not resolve IPv4 manually: {e}")

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
