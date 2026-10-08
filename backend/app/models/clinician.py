from sqlalchemy import Column, Integer, String
from app.database import Base


class Clinician(Base):
    __tablename__ = "clinicians"

    clinician_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    department = Column(String(100))
    email = Column(String(150))
    phone = Column(String(20))
    availability_status = Column(String(30))