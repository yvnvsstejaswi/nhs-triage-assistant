from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .database import engine
from .models.patient import Patient
from .routes import patients
from .models.appointment import Appointment
from .routes import appointments
from .models.user import User
from .routes.auth import router as auth_router
from .models.clinician import Clinician
from .models.triage import TriageRecord
from .routes import triage
from .routes import admin
from .routes import clinicians

app = FastAPI(
    title="Healthcare Appointment & Triage Assistant API",
    description="Backend API for the Healthcare Appointment & Triage Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router)

app.include_router(appointments.router)

app.include_router(auth_router)

app.include_router(triage.router)

app.include_router(admin.router)

app.include_router(clinicians.router)

@app.get("/")
def home():
    return {
        "message": "Healthcare Appointment & Triage Assistant API is running"
    }


@app.get("/database-test")
def database_test():
    """
    Test the connection between FastAPI and PostgreSQL.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "message": "Database connection successful"
        }

    except Exception as error:
        return {
            "message": "Database connection failed",
            "error": str(error)
        }