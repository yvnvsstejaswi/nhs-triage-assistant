import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# --------------------------------------------------
# 1. Load cleaned dataset
# --------------------------------------------------

DATA_PATH = "E:/Visual Studio Documents/NeoSkillz Internship/nhs-triage-assistant/data/processed/vitamin_deficiency_disease_dataset_20260123.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# --------------------------------------------------
# 2. Select features
# --------------------------------------------------

features = [
    "age",
    "gender",
    "bmi",
    "has_night_blindness",
    "has_fatigue",
    "has_bleeding_gums",
    "has_bone_pain",
    "has_muscle_weakness",
    "has_numbness_tingling",
    "has_memory_problems",
    "has_pale_skin"
]

target = "disease_diagnosis"


X = df[features]
y = df[target]


# --------------------------------------------------
# 3. Identify categorical and numerical features
# --------------------------------------------------

categorical_features = [
    "gender"
]

numerical_features = [
    "age",
    "bmi",
    "has_night_blindness",
    "has_fatigue",
    "has_bleeding_gums",
    "has_bone_pain",
    "has_muscle_weakness",
    "has_numbness_tingling",
    "has_memory_problems",
    "has_pale_skin"
]


# --------------------------------------------------
# 4. Preprocessing
# --------------------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "numerical",
            "passthrough",
            numerical_features
        )
    ]
)


# --------------------------------------------------
# 5. Create ML pipeline
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)


pipeline = Pipeline(
    steps=[
        ("preprocessing", preprocessor),
        ("model", model)
    ]
)


# --------------------------------------------------
# 6. Split dataset
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("Training records:", len(X_train))
print("Testing records:", len(X_test))


# --------------------------------------------------
# 7. Train model
# --------------------------------------------------

print("\nTraining model...")

pipeline.fit(X_train, y_train)

print("Model training completed.")


# --------------------------------------------------
# 8. Evaluate model
# --------------------------------------------------

y_pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:")
print(accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# --------------------------------------------------
# 9. Save trained model
# --------------------------------------------------

MODEL_PATH = "ml/disease_prediction_model.pkl"

joblib.dump(pipeline, MODEL_PATH)

print("\nModel saved successfully:")
print(MODEL_PATH)