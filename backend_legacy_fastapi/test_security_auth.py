import requests
import os

# Assuming the server is running on localhost:8000
BASE_URL = "http://localhost:8000"

def test_auth_flow():
    # 1. Register a test user (if not exists)
    email = "test_security@example.com"
    password = "password123"
    
    try:
        requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": password,
            "full_name": "Test Security",
            "role": "customer"
        })
    except:
        pass # User might already exist

    # 2. Login
    session = requests.Session()
    response = session.post(f"{BASE_URL}/auth/token", data={
        "username": email,
        "password": password
    })
    
    print(f"Login Status: {response.status_code}")
    if response.status_code != 200:
        print("Login failed")
        return

    # 3. Check for Cookie
    cookies = session.cookies.get_dict()
    print(f"Cookies received: {cookies.keys()}")
    if "access_token" not in cookies:
        print("FAIL: access_token cookie not found")
        return
    else:
        print("PASS: access_token cookie found")

    # 4. Check protected endpoint
    response = session.get(f"{BASE_URL}/auth/users/me")
    print(f"Protected Endpoint Status: {response.status_code}")
    if response.status_code == 200:
        print("PASS: Accessed protected endpoint with cookie")
        print(f"User: {response.json()['email']}")
    else:
        print("FAIL: Could not access protected endpoint")

    # 5. Logout
    response = session.post(f"{BASE_URL}/auth/logout")
    print(f"Logout Status: {response.status_code}")
    
    # 6. Check if cookie is cleared (or expired)
    # Note: requests might not automatically clear it from the jar immediately depending on expiry, 
    # but let's check if we can access protected endpoint again.
    
    # Manually clear for the test if the server sent a clear instruction that requests handled
    # The server sends Set-Cookie with max-age=0 or similar to delete.
    
    response = session.get(f"{BASE_URL}/auth/users/me")
    print(f"Protected Endpoint After Logout Status: {response.status_code}")
    if response.status_code == 401:
        print("PASS: Denied access after logout")
    else:
        print("FAIL: Still accessed protected endpoint after logout")

if __name__ == "__main__":
    test_auth_flow()
