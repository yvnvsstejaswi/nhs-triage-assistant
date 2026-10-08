from pathlib import Path

import joblib
import pandas as pd


# --------------------------------------------------
# Load trained ML model
# --------------------------------------------------

MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "ml"
    / "disease_prediction_model.pkl"
)

model = joblib.load(MODEL_PATH)


# --------------------------------------------------
# Symptom column mapping
# --------------------------------------------------

SYMPTOM_COLUMNS = {
    "night blindness": "has_night_blindness",
    "fatigue": "has_fatigue",
    "bleeding gums": "has_bleeding_gums",
    "bone pain": "has_bone_pain",
    "muscle weakness": "has_muscle_weakness",
    "numbness/tingling": "has_numbness_tingling",
    "memory problems": "has_memory_problems",
    "pale skin": "has_pale_skin",
}


# --------------------------------------------------
# Create model input
# --------------------------------------------------

def prepare_triage_input(
    age: int,
    gender: str,
    bmi: float,
    symptoms: str
):
    symptom_text = symptoms.lower()

    data = {
        "age": age,
        "gender": gender,
        "bmi": bmi,
        "has_night_blindness": 0,
        "has_fatigue": 0,
        "has_bleeding_gums": 0,
        "has_bone_pain": 0,
        "has_muscle_weakness": 0,
        "has_numbness_tingling": 0,
        "has_memory_problems": 0,
        "has_pale_skin": 0
    }

    for symptom, column in SYMPTOM_COLUMNS.items():
        if symptom in symptom_text:
            data[column] = 1

    return pd.DataFrame([data])


# --------------------------------------------------
# Predict disease
# --------------------------------------------------

def predict_disease(
    age: int,
    gender: str,
    bmi: float,
    symptoms: str
):
    input_data = prepare_triage_input(
        age=age,
        gender=gender,
        bmi=bmi,
        symptoms=symptoms
    )

    prediction = model.predict(input_data)[0]

    return prediction