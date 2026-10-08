from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_database
from ..models.clinician import Clinician
from ..services.dependencies import get_current_user

router = APIRouter(
    prefix="/clinicians",
    tags=["Clinicians"]
)


@router.get("/")
def get_all_clinicians(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    clinicians = (
        database.query(Clinician)
        .order_by(Clinician.clinician_id)
        .all()
    )

    return clinicians


@router.get("/available")
def get_available_clinicians(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):
    clinicians = (
        database.query(Clinician)
        .filter(Clinician.availability_status == "Available")
        .order_by(Clinician.clinician_id)
        .all()
    )

    return [
        {
            "clinician_id": clinician.clinician_id,
            "name": clinician.name,
            "specialization": clinician.specialization,
            "department": clinician.department,
            "availability_status": clinician.availability_status,
        }
        for clinician in clinicians
    ]