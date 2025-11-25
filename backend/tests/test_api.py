from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Bolsifyshop API is running"}

def test_search_endpoint():
    response = client.get("/search/?query=test")
    # Even if empty, it should return 200
    assert response.status_code == 200
    assert isinstance(response.json(), list)
