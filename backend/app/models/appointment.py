from sqlalchemy import Column, Integer, String, Date, Time, Text, ForeignKey

from ..database import Base


class Appointment(Base):
    """
    Represents an appointment in the database.
    """

    __tablename__ = "appointments"

    appointment_id = Column(
        Integer,
        primary_key=True,
    )

    patient_id = Column(
        Integer, 
        ForeignKey("patients.patient_id"), 
        nullable=False

    )

    clinician_id = Column(
        Integer, 
        ForeignKey("clinicians.clinician_id"), 
        nullable=False
    )

    appointment_date = Column(
        Date,
        nullable=False
    )

    appointment_time = Column(
        Time,
        nullable=False
    )

    appointment_type = Column(
        String(50)
    )

    reason = Column(
        Text
    )

    appointment_status = Column(
        String(30)
    )