from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TriageCreate(BaseModel):
    patient_id: int
    symptoms: str


class TriageResponse(BaseModel):
    triage_id: int
    patient_id: int
    symptoms: str
    prediction: str
    risk_level: str
    recommendation: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)