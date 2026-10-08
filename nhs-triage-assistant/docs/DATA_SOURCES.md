# Data Sources

## Overview

The NHS Healthcare Appointment & Triage Assistant uses publicly available and synthetic healthcare datasets for developing, testing, and evaluating different modules of the system. Real patient data will not be used.

---

## Selected Datasets

### 1. Medical Appointment No-Shows
- **Source:** Kaggle
- **Purpose:** Train and evaluate the appointment no-show prediction model.
- **Description:** Contains approximately 110,000 Brazilian public-health appointment records including patient demographics, SMS reminders, and no-show status.

---

### 2. Synthea Synthetic Patient Generator
- **Source:** GitHub (MITRE)
- **Purpose:** Generate synthetic patient records for application testing.
- **Description:** Produces realistic synthetic patient data including demographics, medical conditions, encounters, and medications.

---

### 3. NHS England – Appointments in General Practice
- **Source:** NHS Digital Open Data
- **Purpose:** Analyze appointment trends and healthcare service utilization.
- **Description:** Monthly statistics on GP appointment volumes, appointment types, and waiting times.

---

### 4. NHS Synthetic Data / A&E Synthetic Data
- **Source:** NHS Digital / NHSX
- **Purpose:** Support testing of emergency department workflows and patient flow analysis.
- **Description:** Synthetic Accident & Emergency datasets designed for algorithm development and system testing.

---

### 5. Disease Symptom Prediction Dataset
- **Source:** Kaggle
- **Purpose:** Build the AI-based symptom checker.
- **Description:** Symptom-to-disease mapping dataset used for preliminary disease prediction.

---

### 6. MIMIC-III / MIMIC-IV
- **Source:** PhysioNet
- **Purpose:** Advanced clinical research and future model improvement.
- **Description:** De-identified ICU clinical dataset available for research purposes.

---

### 7. UK Health Datasets
- **Source:** data.gov.uk
- **Purpose:** Reference public healthcare statistics and healthcare trends.
- **Description:** Collection of publicly available UK health and social care datasets.

---

### 8. NICE Clinical Knowledge Summaries
- **Source:** NICE
- **Purpose:** Knowledge base for the Retrieval-Augmented Generation (RAG) healthcare assistant.
- **Description:** Public clinical guidance used to retrieve reliable healthcare information.

---

## Data Usage

The selected datasets support different components of the project:

| Module | Dataset |
|---------|---------|
| Appointment Management | NHS GP Appointments |
| No-Show Prediction | Medical Appointment No-Shows |
| AI Symptom Checker | Disease Symptom Prediction Dataset |
| Patient Record Testing | Synthea Synthetic Patient Generator |
| Emergency Flow Analysis | NHS Synthetic A&E Data |
| Healthcare Knowledge Assistant | NICE Clinical Knowledge Summaries |
| Advanced Clinical Research | MIMIC-III / MIMIC-IV |
| Public Health Analysis | UK Health Datasets |

---

## Data Privacy

The project uses only publicly available or synthetic datasets for development and testing. No personally identifiable or confidential patient information will be stored or processed.