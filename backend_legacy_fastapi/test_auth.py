import requests
import json
import time
import random
import string

BASE_URL = "http://localhost:8000"

def get_random_string(length=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

random_email = f"bolsify.test.{get_random_string()}@gmail.com"

def test_register():
    print(f"Testing Register with {random_email}...")
    payload = {
        "email": random_email,
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
    print(f"\nTesting Login with {random_email}...")
    payload = {
        "username": random_email,
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
            # If login fails (e.g. email not confirmed), we can't test 'me'
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
            # if len(results) > 0:
            #     print("First result:", results[0]['name'])
            return True
        else:
            print("Search Failed:", response.status_code, response.text)
            return False
    except Exception as e:
        print("Search Error:", e)
        return False

if __name__ == "__main__":
    if test_register():
        # Wait a bit for async db write if any
        time.sleep(1)
        token = test_login()
        if token:
            test_me(token)
    test_search()
