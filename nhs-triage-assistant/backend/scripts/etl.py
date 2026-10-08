import os
from pathlib import Path

import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")


# --------------------------------------------------
# File paths
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

CSV_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "vitamin_deficiency_disease_dataset_20260123.csv"
)


# --------------------------------------------------
# Dataset columns
# --------------------------------------------------

PATIENT_COLUMNS = [
    "age",
    "gender",
    "bmi",
    "smoking_status",
    "alcohol_consumption",
    "exercise_level",
    "diet_type",
    "sun_exposure",
    "income_level",
    "latitude_region",
]

TRIAGE_COLUMNS = [
    "vitamin_a_percent_rda",
    "vitamin_c_percent_rda",
    "vitamin_d_percent_rda",
    "vitamin_e_percent_rda",
    "vitamin_b12_percent_rda",
    "folate_percent_rda",
    "calcium_percent_rda",
    "iron_percent_rda",
    "hemoglobin_g_dl",
    "serum_vitamin_d_ng_ml",
    "serum_vitamin_b12_pg_ml",
    "serum_folate_ng_ml",
    "symptoms_count",
    "symptoms_list",
    "has_night_blindness",
    "has_fatigue",
    "has_bleeding_gums",
    "has_bone_pain",
    "has_muscle_weakness",
    "has_numbness_tingling",
    "has_memory_problems",
    "has_pale_skin",
    "disease_diagnosis",
    "has_multiple_deficiencies",
]

BOOLEAN_COLUMNS = [
    "has_night_blindness",
    "has_fatigue",
    "has_bleeding_gums",
    "has_bone_pain",
    "has_muscle_weakness",
    "has_numbness_tingling",
    "has_memory_problems",
    "has_pale_skin",
    "has_multiple_deficiencies",
]


# --------------------------------------------------
# Helper function
# --------------------------------------------------

def convert_boolean(value):
    """Convert dataset 0/1 values into Python booleans."""
    if pd.isna(value):
        return None

    return bool(int(value))


# --------------------------------------------------
# Main ETL process
# --------------------------------------------------

def run_etl():

    print("Starting ETL process...")

    # 1. Check CSV
    if not CSV_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {CSV_PATH}"
        )

    print(f"Reading dataset: {CSV_PATH}")

    # 2. Read CSV
    df = pd.read_csv(CSV_PATH)

    print(f"Records loaded: {len(df)}")
    print(f"Columns loaded: {len(df.columns)}")

    # 3. Validate expected columns
    expected_columns = PATIENT_COLUMNS + TRIAGE_COLUMNS

    missing_columns = [
        column
        for column in expected_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing columns in dataset: {missing_columns}"
        )

    # 4. Convert literal "None" strings to database NULL
    df = df.replace("None", None)

    # 5. Convert Boolean fields
    for column in BOOLEAN_COLUMNS:
        df[column] = df[column].apply(convert_boolean)

    # --------------------------------------------------
    # PostgreSQL connection
    # --------------------------------------------------

    print("Connecting to PostgreSQL...")

    connection = psycopg2.connect(DATABASE_URL)

    try:
        cursor = connection.cursor()

        # --------------------------------------------------
        # Insert Patients
        # --------------------------------------------------

        print("Loading Patients table...")

        patient_values = [
            tuple(row[column] for column in PATIENT_COLUMNS)
            for _, row in df.iterrows()
        ]

        patient_insert_query = """
            INSERT INTO patients (
                age,
                gender,
                bmi,
                smoking_status,
                alcohol_consumption,
                exercise_level,
                diet_type,
                sun_exposure,
                income_level,
                latitude_region
            )
            VALUES %s
            RETURNING patient_id;
        """

        patient_ids = execute_values(
            cursor,
            patient_insert_query,
            patient_values,
            fetch=True
        )

        patient_ids = [row[0] for row in patient_ids]

        print(f"Patients inserted: {len(patient_ids)}")

        # --------------------------------------------------
        # Insert Triage Records
        # --------------------------------------------------

        print("Loading Triage Records table...")

        triage_values = []

        for index, (_, row) in enumerate(df.iterrows()):

            triage_values.append(
                (
                    patient_ids[index],
                    *[
                        row[column]
                        for column in TRIAGE_COLUMNS
                    ],
                )
            )

        triage_insert_query = """
            INSERT INTO triage_records (
                patient_id,
                vitamin_a_percent_rda,
                vitamin_c_percent_rda,
                vitamin_d_percent_rda,
                vitamin_e_percent_rda,
                vitamin_b12_percent_rda,
                folate_percent_rda,
                calcium_percent_rda,
                iron_percent_rda,
                hemoglobin_g_dl,
                serum_vitamin_d_ng_ml,
                serum_vitamin_b12_pg_ml,
                serum_folate_ng_ml,
                symptoms_count,
                symptoms_list,
                has_night_blindness,
                has_fatigue,
                has_bleeding_gums,
                has_bone_pain,
                has_muscle_weakness,
                has_numbness_tingling,
                has_memory_problems,
                has_pale_skin,
                disease_diagnosis,
                has_multiple_deficiencies
            )
            VALUES %s;
        """

        execute_values(
            cursor,
            triage_insert_query,
            triage_values
        )

        print(f"Triage records inserted: {len(triage_values)}")

        # --------------------------------------------------
        # Commit transaction
        # --------------------------------------------------

        connection.commit()

        print("\nETL completed successfully.")
        print(f"Total patients: {len(patient_ids)}")
        print(f"Total triage records: {len(triage_values)}")

    except Exception:
        connection.rollback()
        print("\nETL failed. Transaction rolled back.")
        raise

    finally:
        cursor.close()
        connection.close()
        print("PostgreSQL connection closed.")


# --------------------------------------------------
# Run ETL
# --------------------------------------------------

if __name__ == "__main__":
    run_etl()