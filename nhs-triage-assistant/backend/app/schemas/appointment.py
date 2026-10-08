from datetime import date, time
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AppointmentBase(BaseModel):
    """
    Common appointment information.
    """

    patient_id: int
    clinician_id: int
    appointment_date: date
    appointment_time: time

    appointment_type: Optional[str] = None
    reason: Optional[str] = None
    appointment_status: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    """
    Data required to create an appointment.
    """
    pass


class AppointmentResponse(AppointmentBase):
    """
    Data returned by the API.
    """

    appointment_id: int

    model_config = ConfigDict(from_attributes=True)