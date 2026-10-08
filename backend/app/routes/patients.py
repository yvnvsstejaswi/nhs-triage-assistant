from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_database
from ..models.patient import Patient
from ..models.user import User
from ..schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse
)
from ..services.auth import hash_password
from ..services.dependencies import get_current_user


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


# =========================================================
# CREATE PATIENT + LOGIN ACCOUNT - ADMIN ONLY
# =========================================================

@router.post("/", response_model=PatientResponse)
def create_patient(
    patient_data: PatientCreate,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Check whether the email already exists
    existing_user = (
        database.query(User)
        .filter(
            User.email == str(patient_data.email)
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists"
        )

    try:

        # -------------------------------------------------
        # STEP 1: Create the patient login account
        # -------------------------------------------------

        new_user = User(
            email=str(patient_data.email),
            hashed_password=hash_password(
                patient_data.password
            ),
            role="patient"
        )

        database.add(new_user)

        # Generate user_id before creating patient
        database.flush()

        # -------------------------------------------------
        # STEP 2: Create patient profile
        # -------------------------------------------------

        new_patient = Patient(
            user_id=new_user.user_id,

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

        # -------------------------------------------------
        # STEP 3: Save both records
        # -------------------------------------------------

        database.commit()

        database.refresh(new_patient)

        return new_patient

    except Exception:
        database.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to create patient account"
        )


# =========================================================
# GET ALL PATIENTS - ADMIN ONLY
# =========================================================

@router.get("/", response_model=list[PatientResponse])
def get_all_patients(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    patients = (
        database.query(Patient)
        .order_by(Patient.patient_id)
        .all()
    )

    return patients


# =========================================================
# GET CURRENT PATIENT PROFILE
# =========================================================

@router.get("/me", response_model=PatientResponse)
def get_my_patient_profile(
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    patient = (
        database.query(Patient)
        .filter(
            Patient.user_id == current_user.user_id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    return patient


# =========================================================
# GET PATIENT BY ID
# =========================================================

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
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

    # Patients can access only their own profile
    if current_user.role == "patient":

        if patient.user_id != current_user.user_id:
            raise HTTPException(
                status_code=403,
                detail="You can access only your own profile"
            )

    return patient


# =========================================================
# UPDATE PATIENT
# =========================================================

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
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

    # Patients can update only their own profile
    if current_user.role == "patient":

        if patient.user_id != current_user.user_id:
            raise HTTPException(
                status_code=403,
                detail="You can update only your own profile"
            )

    patient.age = patient_data.age
    patient.gender = patient_data.gender
    patient.bmi = patient_data.bmi

    patient.smoking_status = (
        patient_data.smoking_status
    )

    patient.alcohol_consumption = (
        patient_data.alcohol_consumption
    )

    patient.exercise_level = (
        patient_data.exercise_level
    )

    patient.diet_type = (
        patient_data.diet_type
    )

    patient.sun_exposure = (
        patient_data.sun_exposure
    )

    patient.income_level = (
        patient_data.income_level
    )

    patient.latitude_region = (
        patient_data.latitude_region
    )

    database.commit()

    database.refresh(patient)

    return patient


# =========================================================
# DELETE PATIENT - ADMIN ONLY
# =========================================================

@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    database: Session = Depends(get_database),
    current_user=Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

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

    database.delete(patient)

    database.commit()

    return {
        "message": "Patient deleted successfully"
    }