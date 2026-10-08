from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_patient_token():
    response = client.post(
        "/auth/login",
        json={
            "email": "patient@test.com",
            "password": "Patient@123"
        }
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def test_get_patient_with_jwt():
    token = get_patient_token()

    response = client.get(
        "/patients/1",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["patient_id"] == 1
    assert "age" in data
    assert "gender" in data
    assert "bmi" in data