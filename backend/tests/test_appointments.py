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


def test_get_all_appointments_with_jwt():
    token = get_patient_token()

    response = client.get(
        "/appointments/",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_get_appointment_by_id_with_jwt():
    token = get_patient_token()

    response = client.get(
        "/appointments/1",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["appointment_id"] == 1
    assert "patient_id" in data
    assert "clinician_id" in data


def test_create_appointment_with_jwt():
    patient_token = get_patient_token()
    admin_token = get_admin_token()

    patient_headers = {
        "Authorization": f"Bearer {patient_token}"
    }

    admin_headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    appointment_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-15",
        "appointment_time": "11:00:00",
        "appointment_type": "Consultation",
        "reason": "Automated API test appointment",
        "appointment_status": "Scheduled"
    }

    response = client.post(
        "/appointments/",
        json=appointment_data,
        headers=patient_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert "appointment_id" in data
    assert data["patient_id"] == 1
    assert data["clinician_id"] == 1
    assert data["appointment_type"] == "Consultation"
    assert data["appointment_status"] == "Scheduled"

    # Clean up test appointment
    appointment_id = data["appointment_id"]

    delete_response = client.delete(
        f"/appointments/{appointment_id}",
        headers=admin_headers
    )

    assert delete_response.status_code == 200


def test_update_appointment_with_jwt():
    token = get_admin_token()

    update_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-16",
        "appointment_time": "12:00:00",
        "appointment_type": "Follow-up",
        "reason": "Updated automated test appointment",
        "appointment_status": "Confirmed"
    }

    response = client.put(
        "/appointments/1",
        json=update_data,
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["appointment_id"] == 1
    assert data["appointment_date"] == "2027-01-16"
    assert data["appointment_type"] == "Follow-up"
    assert data["appointment_status"] == "Confirmed"


def test_appointment_create_update_delete_with_jwt():
    admin_token = get_admin_token()

    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    # Create temporary appointment
    create_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-20",
        "appointment_time": "10:30:00",
        "appointment_type": "Consultation",
        "reason": "Temporary automated test appointment",
        "appointment_status": "Scheduled"
    }

    create_response = client.post(
        "/appointments/",
        json=create_data,
        headers=headers
    )

    assert create_response.status_code == 200

    created_appointment = create_response.json()

    assert "appointment_id" in created_appointment

    appointment_id = created_appointment["appointment_id"]

    # Update temporary appointment
    update_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-21",
        "appointment_time": "11:30:00",
        "appointment_type": "Follow-up",
        "reason": "Updated temporary test appointment",
        "appointment_status": "Confirmed"
    }

    update_response = client.put(
        f"/appointments/{appointment_id}",
        json=update_data,
        headers=headers
    )

    assert update_response.status_code == 200

    updated_appointment = update_response.json()

    assert updated_appointment["appointment_id"] == appointment_id
    assert updated_appointment["appointment_type"] == "Follow-up"
    assert updated_appointment["appointment_status"] == "Confirmed"

    # Delete temporary appointment
    delete_response = client.delete(
        f"/appointments/{appointment_id}",
        headers=headers
    )

    assert delete_response.status_code == 200

    delete_data = delete_response.json()

    assert delete_data["message"] == "Appointment deleted successfully"


def test_patient_can_cancel_own_scheduled_appointment():
    patient_token = get_patient_token()
    admin_token = get_admin_token()

    admin_headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    patient_headers = {
        "Authorization": f"Bearer {patient_token}"
    }

    # Create temporary scheduled appointment
    create_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-25",
        "appointment_time": "10:00:00",
        "appointment_type": "Consultation",
        "reason": "Cancellation test appointment",
        "appointment_status": "Scheduled"
    }

    create_response = client.post(
        "/appointments/",
        json=create_data,
        headers=admin_headers
    )

    assert create_response.status_code == 200

    appointment_id = create_response.json()["appointment_id"]

    # Patient cancels own appointment
    cancel_response = client.post(
        f"/appointments/{appointment_id}/cancel",
        headers=patient_headers
    )

    assert cancel_response.status_code == 200

    data = cancel_response.json()

    assert data["appointment_id"] == appointment_id
    assert data["appointment_status"] == "Cancelled"

    # Clean up
    delete_response = client.delete(
        f"/appointments/{appointment_id}",
        headers=admin_headers
    )

    assert delete_response.status_code == 200


def test_cancel_already_cancelled_appointment():
    patient_token = get_patient_token()
    admin_token = get_admin_token()

    admin_headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    patient_headers = {
        "Authorization": f"Bearer {patient_token}"
    }

    # Create scheduled appointment
    create_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-26",
        "appointment_time": "10:00:00",
        "appointment_type": "Consultation",
        "reason": "Already cancelled test",
        "appointment_status": "Scheduled"
    }

    create_response = client.post(
        "/appointments/",
        json=create_data,
        headers=admin_headers
    )

    assert create_response.status_code == 200

    appointment_id = create_response.json()["appointment_id"]

    # First cancellation
    first_cancel_response = client.post(
        f"/appointments/{appointment_id}/cancel",
        headers=patient_headers
    )

    assert first_cancel_response.status_code == 200

    assert (
        first_cancel_response.json()["appointment_status"]
        == "Cancelled"
    )

    # Second cancellation
    second_cancel_response = client.post(
        f"/appointments/{appointment_id}/cancel",
        headers=patient_headers
    )

    assert second_cancel_response.status_code == 400

    assert (
        second_cancel_response.json()["detail"]
        == "Appointment is already cancelled"
    )

    # Clean up
    delete_response = client.delete(
        f"/appointments/{appointment_id}",
        headers=admin_headers
    )

    assert delete_response.status_code == 200


def test_patient_cannot_cancel_non_scheduled_appointment():
    patient_token = get_patient_token()
    admin_token = get_admin_token()

    admin_headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    patient_headers = {
        "Authorization": f"Bearer {patient_token}"
    }

    # Create confirmed appointment
    create_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-27",
        "appointment_time": "10:00:00",
        "appointment_type": "Consultation",
        "reason": "Confirmed appointment cancellation test",
        "appointment_status": "Confirmed"
    }

    create_response = client.post(
        "/appointments/",
        json=create_data,
        headers=admin_headers
    )

    assert create_response.status_code == 200

    appointment_id = create_response.json()["appointment_id"]

    # Patient tries to cancel confirmed appointment
    cancel_response = client.post(
        f"/appointments/{appointment_id}/cancel",
        headers=patient_headers
    )

    assert cancel_response.status_code == 400

    assert (
        cancel_response.json()["detail"]
        == "Only scheduled appointments can be cancelled"
    )

    # Clean up
    delete_response = client.delete(
        f"/appointments/{appointment_id}",
        headers=admin_headers
    )

    assert delete_response.status_code == 200


def test_admin_cannot_use_patient_cancellation_endpoint():
    admin_token = get_admin_token()

    admin_headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    # Create temporary scheduled appointment
    create_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-28",
        "appointment_time": "10:00:00",
        "appointment_type": "Consultation",
        "reason": "Admin cancellation endpoint test",
        "appointment_status": "Scheduled"
    }

    create_response = client.post(
        "/appointments/",
        json=create_data,
        headers=admin_headers
    )

    assert create_response.status_code == 200

    appointment_id = create_response.json()["appointment_id"]

    # Admin tries to use patient cancellation endpoint
    cancel_response = client.post(
        f"/appointments/{appointment_id}/cancel",
        headers=admin_headers
    )

    assert cancel_response.status_code == 403

    assert (
        cancel_response.json()["detail"]
        == (
            "Use the admin appointment management "
            "endpoint for administrator actions"
        )
    )

    # Clean up
    delete_response = client.delete(
        f"/appointments/{appointment_id}",
        headers=admin_headers
    )

    assert delete_response.status_code == 200


def test_cancelled_appointment_slot_can_be_booked_again():
    patient_token = get_patient_token()
    admin_token = get_admin_token()

    admin_headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    patient_headers = {
        "Authorization": f"Bearer {patient_token}"
    }

    appointment_data = {
        "patient_id": 1,
        "clinician_id": 1,
        "appointment_date": "2027-01-29",
        "appointment_time": "10:00:00",
        "appointment_type": "Consultation",
        "reason": "Cancelled slot reuse test",
        "appointment_status": "Scheduled"
    }

    # Create first appointment
    create_response = client.post(
        "/appointments/",
        json=appointment_data,
        headers=admin_headers
    )

    assert create_response.status_code == 200

    first_appointment_id = create_response.json()["appointment_id"]

    # Cancel first appointment
    cancel_response = client.post(
        f"/appointments/{first_appointment_id}/cancel",
        headers=patient_headers
    )

    assert cancel_response.status_code == 200

    assert (
        cancel_response.json()["appointment_status"]
        == "Cancelled"
    )

    # Book the same slot again
    second_create_response = client.post(
        "/appointments/",
        json=appointment_data,
        headers=patient_headers
    )

    assert second_create_response.status_code == 200

    second_appointment = second_create_response.json()

    assert "appointment_id" in second_appointment

    assert (
        second_appointment["appointment_id"]
        != first_appointment_id
    )

    assert (
        second_appointment["appointment_status"]
        == "Scheduled"
    )

    second_appointment_id = second_appointment["appointment_id"]

    # Clean up both appointments
    delete_first_response = client.delete(
        f"/appointments/{first_appointment_id}",
        headers=admin_headers
    )

    assert delete_first_response.status_code == 200

    delete_second_response = client.delete(
        f"/appointments/{second_appointment_id}",
        headers=admin_headers
    )

    assert delete_second_response.status_code == 200