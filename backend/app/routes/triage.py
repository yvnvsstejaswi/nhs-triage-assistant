from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_database
from ..models.patient import Patient
from ..models.triage import TriageRecord
from ..schemas.triage import TriageCreate, TriageResponse
from ..services.dependencies import get_current_user
from ..services.triage import predict_disease


router = APIRouter(
    prefix="/triage",
    tags=["Triage"]
)


# --------------------------------------------------
# Create triage assessment
# --------------------------------------------------

@router.post("/", response_model=TriageResponse)
def create_triage(
    triage_data: TriageCreate,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):
    patient = (
        database.query(Patient)
        .filter(
            Patient.patient_id == triage_data.patient_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # Patients can create triage records only for themselves
    if current_user.role == "patient":
        if patient.user_id != current_user.user_id:
            raise HTTPException(
                status_code=403,
                detail="You can create triage records only for yourself"
            )

    prediction = predict_disease(
        age=patient.age,
        gender=patient.gender,
        bmi=patient.bmi,
        symptoms=triage_data.symptoms
    )

    # Application-level risk classification.
    # This is not a clinical risk score.
    if prediction == "Healthy":
        risk_level = "Low"

        recommendation = (
            "No disease condition was predicted by the model. "
            "Continue maintaining healthy habits and consult a "
            "healthcare professional if symptoms persist."
        )

    else:
        risk_level = "Moderate"

        recommendation = (
            "The assessment indicates a possible health condition. "
            "Please consult a qualified healthcare professional "
            "for proper evaluation and diagnosis."
        )

    new_triage = TriageRecord(
        patient_id=triage_data.patient_id,
        symptoms=triage_data.symptoms,
        prediction=prediction,
        risk_level=risk_level,
        recommendation=recommendation
    )

    database.add(new_triage)
    database.commit()
    database.refresh(new_triage)

    return new_triage


# --------------------------------------------------
# Get triage history for a patient
# --------------------------------------------------

@router.get(
    "/patient/{patient_id}",
    response_model=list[TriageResponse]
)
def get_patient_triage_history(
    patient_id: int,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):
    patient = (
        database.query(Patient)
        .filter(
            Patient.patient_id == patient_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # Patients can access only their own records
    if current_user.role == "patient":
        if patient.user_id != current_user.user_id:
            raise HTTPException(
                status_code=403,
                detail="You can access only your own triage records"
            )

    triage_records = (
        database.query(TriageRecord)
        .filter(
            TriageRecord.patient_id == patient_id
        )
        .order_by(
            TriageRecord.created_at.desc()
        )
        .all()
    )

    return triage_records


# --------------------------------------------------
# Get all triage records - Admin only
# --------------------------------------------------

@router.get(
    "/admin",
    response_model=list[TriageResponse]
)
def get_all_triage_records_admin(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    records = (
        database.query(TriageRecord)
        .order_by(
            TriageRecord.created_at.desc()
        )
        .all()
    )

    return records