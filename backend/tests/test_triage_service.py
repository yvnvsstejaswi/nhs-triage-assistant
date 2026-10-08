from app.services.triage import prepare_triage_input, predict_disease


def test_prepare_triage_input_detects_symptoms():
    result = prepare_triage_input(
        age=25,
        gender="Male",
        bmi=22.5,
        symptoms="fatigue and pale skin"
    )

    assert result.iloc[0]["age"] == 25
    assert result.iloc[0]["gender"] == "Male"
    assert result.iloc[0]["bmi"] == 22.5
    assert result.iloc[0]["has_fatigue"] == 1
    assert result.iloc[0]["has_pale_skin"] == 1


def test_prepare_triage_input_defaults_symptoms_to_zero():
    result = prepare_triage_input(
        age=30,
        gender="Female",
        bmi=21.0,
        symptoms="no listed symptoms"
    )

    assert result.iloc[0]["has_fatigue"] == 0
    assert result.iloc[0]["has_pale_skin"] == 0
    assert result.iloc[0]["has_bone_pain"] == 0


def test_prepare_triage_input_is_case_insensitive():
    result = prepare_triage_input(
        age=25,
        gender="Male",
        bmi=22.5,
        symptoms="FATIGUE and PALE SKIN"
    )

    assert result.iloc[0]["has_fatigue"] == 1
    assert result.iloc[0]["has_pale_skin"] == 1


def test_predict_disease_returns_prediction():
    prediction = predict_disease(
        age=25,
        gender="Male",
        bmi=22.5,
        symptoms="fatigue and pale skin"
    )

    assert prediction is not None
    assert isinstance(prediction, str)
    assert len(prediction) > 0