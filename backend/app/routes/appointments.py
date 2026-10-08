from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_database
from ..models.appointment import Appointment
from ..models.patient import Patient
from ..models.clinician import Clinician
from ..schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
)
from ..services.dependencies import get_current_user


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


# =========================================================
# VALIDATE APPOINTMENT DATE AND TIME
# =========================================================

def validate_appointment_datetime(
    appointment_date,
    appointment_time
):
    current_datetime = datetime.now()

    appointment_datetime = datetime.combine(
        appointment_date,
        appointment_time
    )

    if appointment_datetime < current_datetime:
        raise HTTPException(
            status_code=400,
            detail="Appointment date and time cannot be in the past"
        )


# =========================================================
# CREATE APPOINTMENT
# =========================================================

@router.post(
    "/",
    response_model=AppointmentResponse
)
def create_appointment(
    appointment_data: AppointmentCreate,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # Validate date and time
    # -----------------------------------------------------

    validate_appointment_datetime(
        appointment_data.appointment_date,
        appointment_data.appointment_time
    )

    # -----------------------------------------------------
    # Find patient
    # -----------------------------------------------------

    patient = (
        database.query(Patient)
        .filter(
            Patient.patient_id ==
            appointment_data.patient_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # -----------------------------------------------------
    # Find clinician
    # -----------------------------------------------------

    clinician = (
        database.query(Clinician)
        .filter(
            Clinician.clinician_id ==
            appointment_data.clinician_id
        )
        .first()
    )

    if clinician is None:
        raise HTTPException(
            status_code=404,
            detail="Clinician not found"
        )

    # -----------------------------------------------------
    # Check clinician availability
    # -----------------------------------------------------

    if clinician.availability_status != "Available":
        raise HTTPException(
            status_code=400,
            detail="Selected clinician is currently unavailable"
        )

    # -----------------------------------------------------
    # Patient can only create appointment for themselves
    # -----------------------------------------------------

    if current_user.role != "admin":

        if patient.user_id != current_user.user_id:
            raise HTTPException(
                status_code=403,
                detail="You can only create appointments for yourself"
            )

    # -----------------------------------------------------
    # Check double booking
    # -----------------------------------------------------

    existing_appointment = (
        database.query(Appointment)
        .filter(
            Appointment.clinician_id ==
            appointment_data.clinician_id,

            Appointment.appointment_date ==
            appointment_data.appointment_date,

            Appointment.appointment_time ==
            appointment_data.appointment_time,

            Appointment.appointment_status !=
            "Cancelled"
        )
        .first()
    )

    if existing_appointment is not None:
        raise HTTPException(
            status_code=400,
            detail=(
                "Selected clinician already has an "
                "appointment at this date and time"
            )
        )

    # -----------------------------------------------------
    # Create appointment
    # -----------------------------------------------------

    new_appointment = Appointment(
        patient_id=appointment_data.patient_id,
        clinician_id=appointment_data.clinician_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        appointment_type=appointment_data.appointment_type,
        reason=appointment_data.reason,
        appointment_status=(
            appointment_data.appointment_status
            or "Scheduled"
        )
    )

    database.add(new_appointment)

    database.commit()

    database.refresh(new_appointment)

    return new_appointment


# =========================================================
# GET ALL APPOINTMENTS - ADMIN
# =========================================================

@router.get(
    "/admin",
    response_model=list[AppointmentResponse]
)
def get_all_appointments_admin(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    appointments = (
        database.query(Appointment)
        .order_by(
            Appointment.appointment_id
        )
        .all()
    )

    return appointments


# =========================================================
# GET APPOINTMENTS
#
# Admin -> all appointments
# Patient -> own appointments only
# =========================================================

@router.get(
    "/",
    response_model=list[AppointmentResponse]
)
def get_all_appointments(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # Admin
    # -----------------------------------------------------

    if current_user.role == "admin":

        appointments = (
            database.query(Appointment)
            .order_by(
                Appointment.appointment_id
            )
            .all()
        )

        return appointments

    # -----------------------------------------------------
    # Patient
    # -----------------------------------------------------

    patient = (
        database.query(Patient)
        .filter(
            Patient.user_id ==
            current_user.user_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    appointments = (
        database.query(Appointment)
        .filter(
            Appointment.patient_id ==
            patient.patient_id
        )
        .order_by(
            Appointment.appointment_id
        )
        .all()
    )

    return appointments


# =========================================================
# GET SINGLE APPOINTMENT
# =========================================================

@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse
)
def get_appointment(
    appointment_id: int,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    appointment = (
        database.query(Appointment)
        .filter(
            Appointment.appointment_id ==
            appointment_id
        )
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    # -----------------------------------------------------
    # Admin can view any appointment
    # -----------------------------------------------------

    if current_user.role == "admin":
        return appointment

    # -----------------------------------------------------
    # Find patient's profile
    # -----------------------------------------------------

    patient = (
        database.query(Patient)
        .filter(
            Patient.user_id ==
            current_user.user_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    # -----------------------------------------------------
    # Ownership check
    # -----------------------------------------------------

    if appointment.patient_id != patient.patient_id:
        raise HTTPException(
            status_code=403,
            detail="You can only view your own appointments"
        )

    return appointment


# =========================================================
# CANCEL APPOINTMENT - PATIENT
# =========================================================

@router.post(
    "/{appointment_id}/cancel",
    response_model=AppointmentResponse
)
def cancel_appointment(
    appointment_id: int,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # Find appointment
    # -----------------------------------------------------

    appointment = (
        database.query(Appointment)
        .filter(
            Appointment.appointment_id ==
            appointment_id
        )
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    # -----------------------------------------------------
    # Admin is not using this endpoint
    #
    # Admin continues to use admin CRUD.
    # -----------------------------------------------------

    if current_user.role == "admin":
        raise HTTPException(
            status_code=403,
            detail=(
                "Use the admin appointment management "
                "endpoint for administrator actions"
            )
        )

    # -----------------------------------------------------
    # Find current patient's profile
    # -----------------------------------------------------

    patient = (
        database.query(Patient)
        .filter(
            Patient.user_id ==
            current_user.user_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    # -----------------------------------------------------
    # Ownership check
    # -----------------------------------------------------

    if appointment.patient_id != patient.patient_id:
        raise HTTPException(
            status_code=403,
            detail="You can only cancel your own appointments"
        )

    # -----------------------------------------------------
    # Already cancelled
    # -----------------------------------------------------

    if appointment.appointment_status == "Cancelled":
        raise HTTPException(
            status_code=400,
            detail="Appointment is already cancelled"
        )

    # -----------------------------------------------------
    # Only scheduled appointments can be cancelled
    # -----------------------------------------------------

    if appointment.appointment_status != "Scheduled":
        raise HTTPException(
            status_code=400,
            detail=(
                "Only scheduled appointments "
                "can be cancelled"
            )
        )

    # -----------------------------------------------------
    # Change status instead of deleting
    # -----------------------------------------------------

    appointment.appointment_status = "Cancelled"

    database.commit()

    database.refresh(appointment)

    return appointment


# =========================================================
# UPDATE APPOINTMENT - ADMIN ONLY
# =========================================================

@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse
)
def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentCreate,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # -----------------------------------------------------
    # Validate date and time
    # -----------------------------------------------------

    validate_appointment_datetime(
        appointment_data.appointment_date,
        appointment_data.appointment_time
    )

    # -----------------------------------------------------
    # Find appointment
    # -----------------------------------------------------

    appointment = (
        database.query(Appointment)
        .filter(
            Appointment.appointment_id ==
            appointment_id
        )
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    # -----------------------------------------------------
    # Find patient
    # -----------------------------------------------------

    patient = (
        database.query(Patient)
        .filter(
            Patient.patient_id ==
            appointment_data.patient_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # -----------------------------------------------------
    # Find clinician
    # -----------------------------------------------------

    clinician = (
        database.query(Clinician)
        .filter(
            Clinician.clinician_id ==
            appointment_data.clinician_id
        )
        .first()
    )

    if clinician is None:
        raise HTTPException(
            status_code=404,
            detail="Clinician not found"
        )

    # -----------------------------------------------------
    # Check clinician availability
    # -----------------------------------------------------

    if clinician.availability_status != "Available":
        raise HTTPException(
            status_code=400,
            detail="Selected clinician is currently unavailable"
        )

    # -----------------------------------------------------
    # Check double booking
    # -----------------------------------------------------

    existing_appointment = (
        database.query(Appointment)
        .filter(
            Appointment.clinician_id ==
            appointment_data.clinician_id,

            Appointment.appointment_date ==
            appointment_data.appointment_date,

            Appointment.appointment_time ==
            appointment_data.appointment_time,

            Appointment.appointment_status !=
            "Cancelled",

            Appointment.appointment_id !=
            appointment_id
        )
        .first()
    )

    if existing_appointment is not None:
        raise HTTPException(
            status_code=400,
            detail=(
                "Selected clinician already has an "
                "appointment at this date and time"
            )
        )

    # -----------------------------------------------------
    # Update appointment
    # -----------------------------------------------------

    appointment.patient_id = (
        appointment_data.patient_id
    )

    appointment.clinician_id = (
        appointment_data.clinician_id
    )

    appointment.appointment_date = (
        appointment_data.appointment_date
    )

    appointment.appointment_time = (
        appointment_data.appointment_time
    )

    appointment.appointment_type = (
        appointment_data.appointment_type
    )

    appointment.reason = (
        appointment_data.reason
    )

    appointment.appointment_status = (
        appointment_data.appointment_status
        or appointment.appointment_status
        or "Scheduled"
    )

    database.commit()

    database.refresh(appointment)

    return appointment


# =========================================================
# MARK APPOINTMENT AS COMPLETED - ADMIN ONLY
# =========================================================

@router.patch(
    "/{appointment_id}/complete",
    response_model=AppointmentResponse
)
def complete_appointment(
    appointment_id: int,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # Admin access only
    # -----------------------------------------------------

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # -----------------------------------------------------
    # Find appointment
    # -----------------------------------------------------

    appointment = (
        database.query(Appointment)
        .filter(
            Appointment.appointment_id ==
            appointment_id
        )
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    # -----------------------------------------------------
    # Already completed
    # -----------------------------------------------------

    if appointment.appointment_status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="Appointment is already completed"
        )

    # -----------------------------------------------------
    # Cancelled appointments cannot be completed
    # -----------------------------------------------------

    if appointment.appointment_status == "Cancelled":
        raise HTTPException(
            status_code=400,
            detail=(
                "Cancelled appointments cannot be "
                "marked as completed"
            )
        )

    # -----------------------------------------------------
    # Mark appointment as completed
    # -----------------------------------------------------

    appointment.appointment_status = "Completed"

    database.commit()

    database.refresh(appointment)

    return appointment


# =========================================================
# DELETE APPOINTMENT - ADMIN ONLY
# =========================================================

@router.delete(
    "/{appointment_id}"
)
def delete_appointment(
    appointment_id: int,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    appointment = (
        database.query(Appointment)
        .filter(
            Appointment.appointment_id ==
            appointment_id
        )
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    database.delete(appointment)

    database.commit()

    return {
        "message":
            "Appointment deleted successfully"
    }