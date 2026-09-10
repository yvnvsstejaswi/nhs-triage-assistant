from sqlalchemy import Column, Integer, String, Numeric

from ..database import Base


class Patient(Base):
    """
    Represents a patient in the database.
    """

    __tablename__ = "patients"

    patient_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    age = Column(
        Integer,
        nullable=False
    )

    gender = Column(
        String(20),
        nullable=False
    )

    bmi = Column(
        Numeric(5, 2),
        nullable=False
    )

    smoking_status = Column(String(30))
    alcohol_consumption = Column(String(30))
    exercise_level = Column(String(30))
    diet_type = Column(String(30))
    sun_exposure = Column(String(30))
    income_level = Column(String(30))
    latitude_region = Column(String(50))