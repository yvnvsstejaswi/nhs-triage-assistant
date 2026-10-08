from pydantic import BaseModel, ConfigDict
from typing import Optional


class PatientBase(BaseModel):
    """
    Common patient information.
    """

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
    """
    Data required to create a new patient.
    """
    pass


class PatientResponse(PatientBase):
    """
    Data returned by the API after reading a patient.
    """

    patient_id: int

    model_config = ConfigDict(from_attributes=True)