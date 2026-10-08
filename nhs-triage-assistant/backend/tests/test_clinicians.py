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


def get_admin_token():
    response = client.post(
        "/auth/login",
        json={
            "email": "admin@test.com",
            "password": "Admin@123"
        }
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def test_get_all_clinicians_with_admin_jwt():
    token = get_admin_token()

    response = client.get(
        "/clinicians/",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_patient_cannot_get_all_clinicians():
    token = get_patient_token()

    response = client.get(
        "/clinicians/",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 403

    assert response.json()["detail"] == "Admin access required"


def test_get_available_clinicians_with_patient_jwt():
    token = get_patient_token()

    response = client.get(
        "/clinicians/available",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    for clinician in data:
        assert "clinician_id" in clinician
        assert "name" in clinician
        assert "specialization" in clinician
        assert "department" in clinician
        assert "availability_status" in clinician

        assert clinician["availability_status"] == "Available"


def test_get_available_clinicians_with_admin_jwt():
    token = get_admin_token()

    response = client.get(
        "/clinicians/available",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    for clinician in data:
        assert clinician["availability_status"] == "Available"


def test_get_all_clinicians_without_jwt():
    response = client.get(
        "/clinicians/"
    )

    assert response.status_code == 401


def test_get_available_clinicians_without_jwt():
    response = client.get(
        "/clinicians/available"
    )

    assert response.status_code == 401