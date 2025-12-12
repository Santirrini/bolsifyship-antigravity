from supabase_client import supabase
import os

try:
    print("Testing Supabase Client...")
    # Just try to get session (should be none) or check health by listing buckets or similar public info if possible.
    # Or just checking if 'supabase' object was created without error.
    
    # Try a simple auth check (e.g. invalid login to check connectivity vs credential format)
    try:
        supabase.auth.sign_in_with_password({"email": "fake@example.com", "password": "fake"})
    except Exception as e:
        error_msg = str(e)
        if "Invalid login credentials" in error_msg or "Invalid credentials" in error_msg:
             print("SUCCESS: Client connected (received expected auth error).")
        else:
             print(f"Client connected but received unexpected error: {e}")

    print("Supabase URL:", os.getenv("SUPABASE_URL"))
    
except Exception as e:
    print(f"FAILURE: Client init failed. {e}")
