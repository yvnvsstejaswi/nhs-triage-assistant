from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional


class PatientBase(BaseModel):
    """Common patient information."""

    age: int
    gender: str
    bmi: float

    smoking_status: Optional[str] = None
    alcohol_consumption: Optional[str] = None
    exercise_level: Optional[str] = None
    diet_type: Optional[str] = None
    sun_exposure: Optional[str] = None
    income_level: Optional[str] = None
    latitude_region: Optional[str] = None


class PatientCreate(PatientBase):
    """Data required to create a patient and its login account."""

    email: EmailStr
    password: str = Field(min_length=8)


class PatientUpdate(PatientBase):
    """Data used to update an existing patient profile."""

    pass


class PatientResponse(PatientBase):
    """Data returned by the API after reading a patient."""

    patient_id: int
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)