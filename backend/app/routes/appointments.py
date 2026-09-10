from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_database
from ..models.appointment import Appointment
from ..schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse
)


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


# Create a new appointment
@router.post("/", response_model=AppointmentResponse)
def create_appointment(
    appointment_data: AppointmentCreate,
    database: Session = Depends(get_database)
):
    new_appointment = Appointment(
        patient_id=appointment_data.patient_id,
        clinician_id=appointment_data.clinician_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        appointment_type=appointment_data.appointment_type,
        reason=appointment_data.reason,
        appointment_status=appointment_data.appointment_status
    )

    database.add(new_appointment)
    database.commit()
    database.refresh(new_appointment)

    return new_appointment


# Get an appointment by ID
@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    database: Session = Depends(get_database)
):
    appointment = (
        database.query(Appointment)
        .filter(Appointment.appointment_id == appointment_id)
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    return appointment


# Update an appointment
@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentCreate,
    database: Session = Depends(get_database)
):
    appointment = (
        database.query(Appointment)
        .filter(Appointment.appointment_id == appointment_id)
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    appointment.patient_id = appointment_data.patient_id
    appointment.clinician_id = appointment_data.clinician_id
    appointment.appointment_date = appointment_data.appointment_date
    appointment.appointment_time = appointment_data.appointment_time
    appointment.appointment_type = appointment_data.appointment_type
    appointment.reason = appointment_data.reason
    appointment.appointment_status = appointment_data.appointment_status

    database.commit()
    database.refresh(appointment)

    return appointment


# Delete an appointment
@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    database: Session = Depends(get_database)
):
    appointment = (
        database.query(Appointment)
        .filter(Appointment.appointment_id == appointment_id)
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
        "message": "Appointment deleted successfully"
    }