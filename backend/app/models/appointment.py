from sqlalchemy import Column, Integer, String, Text, Date, Time

from ..database import Base


class Appointment(Base):
    """
    Represents an appointment in the database.
    """

    __tablename__ = "appointments"

    appointment_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        nullable=False
    )

    clinician_id = Column(
        Integer,
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