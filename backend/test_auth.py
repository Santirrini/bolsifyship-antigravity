import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    print("Testing Register...")
    payload = {
        "email": "test_user@example.com",
        "password": "password123",
        "full_name": "Test User"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        if response.status_code == 200:
            print("Register Success:", response.json())
            return True
        elif response.status_code == 400 and "already registered" in response.text:
            print("User already registered (Expected if run multiple times)")
            return True
        else:
            print("Register Failed:", response.status_code, response.text)
            return False
    except Exception as e:
        print("Register Error:", e)
        return False

def test_login():
    print("\nTesting Login...")
    payload = {
        "username": "test_user@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/token", data=payload)
        if response.status_code == 200:
            token = response.json()["access_token"]
            print("Login Success. Token received.")
            return token
        else:
            print("Login Failed:", response.status_code, response.text)
            return None
    except Exception as e:
        print("Login Error:", e)
        return None

def test_me(token):
    print("\nTesting Get Me...")
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(f"{BASE_URL}/auth/users/me", headers=headers)
        if response.status_code == 200:
            print("Get Me Success:", response.json())
            return True
        else:
            print("Get Me Failed:", response.status_code, response.text)
            return False
    except Exception as e:
        print("Get Me Error:", e)
        return False

def test_search():
    print("\nTesting Fuzzy Search...")
    # Assuming there are some products seeded. If not, this might return empty but 200.
    # Searching for "ipone" should match "iPhone" if it exists.
    try:
        response = requests.get(f"{BASE_URL}/search?query=ipone")
        if response.status_code == 200:
            results = response.json()
            print(f"Search Success. Found {len(results)} results.")
            if len(results) > 0:
                print("First result:", results[0]['name'])
            return True
        else:
            print("Search Failed:", response.status_code, response.text)
            return False
    except Exception as e:
        print("Search Error:", e)
        return False

if __name__ == "__main__":
    if test_register():
        token = test_login()
        if token:
            test_me(token)
    test_search()
