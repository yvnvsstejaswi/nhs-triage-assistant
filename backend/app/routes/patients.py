from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_database
from ..models.patient import Patient
from ..schemas.patient import PatientCreate, PatientResponse


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


# Create a new patient
@router.post("/", response_model=PatientResponse)
def create_patient(
    patient_data: PatientCreate,
    database: Session = Depends(get_database)
):
    new_patient = Patient(
        age=patient_data.age,
        gender=patient_data.gender,
        bmi=patient_data.bmi,
        smoking_status=patient_data.smoking_status,
        alcohol_consumption=patient_data.alcohol_consumption,
        exercise_level=patient_data.exercise_level,
        diet_type=patient_data.diet_type,
        sun_exposure=patient_data.sun_exposure,
        income_level=patient_data.income_level,
        latitude_region=patient_data.latitude_region
    )

    database.add(new_patient)
    database.commit()
    database.refresh(new_patient)

    return new_patient


# Get a patient by ID
@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    database: Session = Depends(get_database)
):
    patient = (
        database.query(Patient)
        .filter(Patient.patient_id == patient_id)
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# Update a patient
@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_data: PatientCreate,
    database: Session = Depends(get_database)
):
    patient = (
        database.query(Patient)
        .filter(Patient.patient_id == patient_id)
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    patient.age = patient_data.age
    patient.gender = patient_data.gender
    patient.bmi = patient_data.bmi
    patient.smoking_status = patient_data.smoking_status
    patient.alcohol_consumption = patient_data.alcohol_consumption
    patient.exercise_level = patient_data.exercise_level
    patient.diet_type = patient_data.diet_type
    patient.sun_exposure = patient_data.sun_exposure
    patient.income_level = patient_data.income_level
    patient.latitude_region = patient_data.latitude_region

    database.commit()
    database.refresh(patient)

    return patient


# Delete a patient
@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    database: Session = Depends(get_database)
):
    patient = (
        database.query(Patient)
        .filter(Patient.patient_id == patient_id)
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    database.delete(patient)
    database.commit()

    return {
        "message": "Patient deleted successfully"
    }