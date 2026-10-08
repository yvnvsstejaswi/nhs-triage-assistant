from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_database
from ..models.patient import Patient
from ..models.appointment import Appointment
from ..models.triage import TriageRecord
from ..services.dependencies import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/summary")
def get_admin_summary(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):
    # Admin-only access
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    total_patients = database.query(Patient).count()

    total_appointments = database.query(Appointment).count()

    total_triage_records = database.query(TriageRecord).count()

    moderate_triage_records = (
        database.query(TriageRecord)
        .filter(TriageRecord.risk_level == "Moderate")
        .count()
    )

    low_triage_records = (
        database.query(TriageRecord)
        .filter(TriageRecord.risk_level == "Low")
        .count()
    )

    return {
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "total_triage_records": total_triage_records,
        "moderate_triage_records": moderate_triage_records,
        "low_triage_records": low_triage_records
    }