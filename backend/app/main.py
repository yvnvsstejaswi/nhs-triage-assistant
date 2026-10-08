from fastapi import FastAPI
from sqlalchemy import text

from .database import engine
from .models.patient import Patient
from .routes import patients
from .models.appointment import Appointment
from .routes import appointments
from .models.user import User
from .routes.auth import router as auth_router

app = FastAPI(
    title="Healthcare Appointment & Triage Assistant API",
    description="Backend API for the Healthcare Appointment & Triage Assistant",
    version="1.0.0"
)

app.include_router(patients.router)

app.include_router(appointments.router)

app.include_router(auth_router)

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