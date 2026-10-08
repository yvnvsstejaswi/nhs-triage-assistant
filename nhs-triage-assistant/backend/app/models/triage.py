from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey

from ..database import Base


class TriageRecord(Base):
    __tablename__ = "triage_records"

    triage_id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.patient_id"),
        nullable=False
    )

    symptoms = Column(Text, nullable=False)

    prediction = Column(String(100), nullable=False)

    risk_level = Column(String(50), nullable=False)

    recommendation = Column(Text, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )