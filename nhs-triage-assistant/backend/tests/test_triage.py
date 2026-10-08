import os
import sys

from fastapi.testclient import TestClient


# --------------------------------------------------
# Make sure the backend directory is available
# for importing the app package.
# --------------------------------------------------

BACKEND_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


from app.main import app


client = TestClient(app)


# --------------------------------------------------
# Helper: Patient JWT
# --------------------------------------------------

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


# --------------------------------------------------
# Helper: Admin JWT
# --------------------------------------------------

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


# ==================================================
# TEST 1
# Patient can create triage
# ==================================================

def test_create_triage_with_patient_jwt():
    token = get_patient_token()

    triage_data = {
        "patient_id": 1,
        "symptoms": "fatigue, weakness"
    }

    response = client.post(
        "/triage/",
        json=triage_data,
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "triage_id" in data
    assert data["patient_id"] == 1
    assert data["symptoms"] == "fatigue, weakness"
    assert "prediction" in data
    assert "risk_level" in data
    assert "recommendation" in data


# ==================================================
# TEST 2
# Patient can get own triage history
# ==================================================

def test_patient_can_get_own_triage_history():
    token = get_patient_token()

    response = client.get(
        "/triage/patient/1",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    for record in data:
        assert record["patient_id"] == 1


# ==================================================
# TEST 3
# Admin can get patient triage history
# ==================================================

def test_admin_can_get_patient_triage_history():
    token = get_admin_token()

    response = client.get(
        "/triage/patient/1",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


# ==================================================
# TEST 4
# Patient cannot access another patient's records
# ==================================================

def test_patient_cannot_access_another_patient_triage_history():
    token = get_patient_token()

    response = client.get(
        "/triage/patient/2",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 403

    assert (
        response.json()["detail"]
        == "You can access only your own triage records"
    )


# ==================================================
# TEST 5
# Admin can get all triage records
# ==================================================

def test_admin_can_get_all_triage_records():
    token = get_admin_token()

    response = client.get(
        "/triage/admin",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


# ==================================================
# TEST 6
# Patient cannot get all triage records
# ==================================================

def test_patient_cannot_get_all_triage_records():
    token = get_patient_token()

    response = client.get(
        "/triage/admin",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 403

    assert (
        response.json()["detail"]
        == "Admin access required"
    )


# ==================================================
# TEST 7
# Create triage without JWT
# ==================================================

def test_create_triage_without_jwt():
    triage_data = {
        "patient_id": 1,
        "symptoms": "fatigue, weakness"
    }

    response = client.post(
        "/triage/",
        json=triage_data
    )

    assert response.status_code == 401


# ==================================================
# TEST 8
# Get triage history without JWT
# ==================================================

def test_get_triage_history_without_jwt():
    response = client.get(
        "/triage/patient/1"
    )

    assert response.status_code == 401


# ==================================================
# TEST 9
# Get all triage records without JWT
# ==================================================

def test_get_all_triage_without_jwt():
    response = client.get(
        "/triage/admin"
    )

    assert response.status_code == 401


# ==================================================
# TEST 10
# Create triage for non-existent patient
# ==================================================

def test_create_triage_for_nonexistent_patient():
    token = get_patient_token()

    triage_data = {
        "patient_id": 999999,
        "symptoms": "fatigue, weakness"
    }

    response = client.post(
        "/triage/",
        json=triage_data,
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 404

    assert (
        response.json()["detail"]
        == "Patient not found"
    )