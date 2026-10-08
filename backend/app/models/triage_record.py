from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey, Text
from app.database import Base


class TriageRecord(Base):
    __tablename__ = "triage_records"

    triage_id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)

    vitamin_a_percent_rda = Column(Numeric(6, 2))
    vitamin_c_percent_rda = Column(Numeric(6, 2))
    vitamin_d_percent_rda = Column(Numeric(6, 2))
    vitamin_e_percent_rda = Column(Numeric(6, 2))
    vitamin_b12_percent_rda = Column(Numeric(6, 2))
    folate_percent_rda = Column(Numeric(6, 2))
    calcium_percent_rda = Column(Numeric(6, 2))
    iron_percent_rda = Column(Numeric(6, 2))

    hemoglobin_g_dl = Column(Numeric(5, 2))
    serum_vitamin_d_ng_ml = Column(Numeric(6, 2))
    serum_vitamin_b12_pg_ml = Column(Numeric(7, 2))
    serum_folate_ng_ml = Column(Numeric(6, 2))

    symptoms_count = Column(Integer)
    symptoms_list = Column(Text)

    has_night_blindness = Column(Boolean)
    has_fatigue = Column(Boolean)
    has_bleeding_gums = Column(Boolean)
    has_bone_pain = Column(Boolean)
    has_muscle_weakness = Column(Boolean)
    has_numbness_tingling = Column(Boolean)
    has_memory_problems = Column(Boolean)
    has_pale_skin = Column(Boolean)

    disease_diagnosis = Column(String(50))
    has_multiple_deficiencies = Column(Boolean)