-- Healthcare Appointment & Triage Assistant
-- Week 5: PostgreSQL Database Schema

-- ============================================
-- 1. Patients
-- ============================================

CREATE TABLE patients (
    patient_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    bmi DECIMAL(5,2) NOT NULL,
    smoking_status VARCHAR(30),
    alcohol_consumption VARCHAR(30),
    exercise_level VARCHAR(30),
    diet_type VARCHAR(30),
    sun_exposure VARCHAR(30),
    income_level VARCHAR(30),
    latitude_region VARCHAR(50)
);


-- ============================================
-- 2. Clinicians
-- ============================================

CREATE TABLE clinicians (
    clinician_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(20),
    availability_status VARCHAR(30)
);


-- ============================================
-- 3. Triage Records
-- ============================================

CREATE TABLE triage_records (
    triage_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id INTEGER NOT NULL,

    vitamin_a_percent_rda DECIMAL(6,2),
    vitamin_c_percent_rda DECIMAL(6,2),
    vitamin_d_percent_rda DECIMAL(6,2),
    vitamin_e_percent_rda DECIMAL(6,2),
    vitamin_b12_percent_rda DECIMAL(6,2),
    folate_percent_rda DECIMAL(6,2),
    calcium_percent_rda DECIMAL(6,2),
    iron_percent_rda DECIMAL(6,2),

    hemoglobin_g_dl DECIMAL(5,2),
    serum_vitamin_d_ng_ml DECIMAL(6,2),
    serum_vitamin_b12_pg_ml DECIMAL(7,2),
    serum_folate_ng_ml DECIMAL(6,2),

    symptoms_count INTEGER,
    symptoms_list TEXT,

    has_night_blindness BOOLEAN,
    has_fatigue BOOLEAN,
    has_bleeding_gums BOOLEAN,
    has_bone_pain BOOLEAN,
    has_muscle_weakness BOOLEAN,
    has_numbness_tingling BOOLEAN,
    has_memory_problems BOOLEAN,
    has_pale_skin BOOLEAN,

    disease_diagnosis VARCHAR(50),
    has_multiple_deficiencies BOOLEAN,

    CONSTRAINT fk_triage_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
);


-- ============================================
-- 4. Appointments
-- ============================================

CREATE TABLE appointments (
    appointment_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    clinician_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(50),
    reason TEXT,
    appointment_status VARCHAR(30),

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id),

    CONSTRAINT fk_appointment_clinician
        FOREIGN KEY (clinician_id)
        REFERENCES clinicians(clinician_id)
);

CREATE TABLE users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT chk_user_role
        CHECK (role IN ('patient', 'admin'))
);