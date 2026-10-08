"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";
import PatientHeader from "../../components/PatientHeader";
import BackToDashboard from "../../components/BackToDashboard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const symptoms = [
  "Fatigue",
  "Bone Pain",
  "Muscle Weakness",
  "Numbness/Tingling",
  "Memory Problems",
  "Pale Skin",
  "Bleeding Gums",
  "Night Blindness",
];

type TriageResult = {
  triage_id: number;
  patient_id: number;
  symptoms: string;
  prediction: string;
  risk_level: string;
  recommendation: string;
  created_at: string;
};

export default function TriagePage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [result, setResult] =
    useState<TriageResult | null>(null);

  const [history, setHistory] =
    useState<TriageResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [patientId, setPatientId] =
    useState<number | null>(null);

  const [patientName, setPatientName] =
    useState("");

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");

    router.replace("/login");
  };

  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadPatientData = async () => {
      try {

        const patientResponse =
          await fetch(
            `${API_URL}/patients/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          patientResponse.status === 401
        ) {
          logout();
          return;
        }

        if (!patientResponse.ok) {
          throw new Error(
            "Failed to load patient profile"
          );
        }

        const patient =
          await patientResponse.json();

        setPatientId(
          patient.patient_id
        );

        if (patient.full_name) {
          setPatientName(
            patient.full_name
          );
        } else if (patient.name) {
          setPatientName(
            patient.name
          );
        }

        const historyResponse =
          await fetch(
            `${API_URL}/triage/patient/${patient.patient_id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          historyResponse.status === 401
        ) {
          logout();
          return;
        }

        if (!historyResponse.ok) {
          throw new Error(
            "Failed to load triage history"
          );
        }

        const historyData =
          await historyResponse.json();

        setHistory(historyData);
      } catch (error) {
        console.error(
          "Error loading patient data:",
          error
        );

        setHistory([]);

        setMessage(
          "Unable to load your patient information."
        );
      }
    };

    loadPatientData();
  }, []);

  const toggleSymptom = (
    symptom: string
  ) => {
    if (
      selectedSymptoms.includes(symptom)
    ) {
      setSelectedSymptoms(
        selectedSymptoms.filter(
          (item) =>
            item !== symptom
        )
      );
    } else {
      setSelectedSymptoms([
        ...selectedSymptoms,
        symptom,
      ]);
    }

    setMessage("");
    setResult(null);
  };

  const assessSymptoms = async () => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      router.replace("/login");
      return;
    }

    if (patientId === null) {
      setMessage(
        "Patient information is still loading. Please try again."
      );
      return;
    }

    if (
      selectedSymptoms.length === 0
    ) {
      setMessage(
        "Please select at least one symptom."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const response =
        await fetch(
          `${API_URL}/triage/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              patient_id:
                patientId,

              symptoms:
                selectedSymptoms.join(
                  ", "
                ),
            }),
          }
        );

      if (
        response.status === 401
      ) {
        logout();
        return;
      }

      if (
        response.status === 403
      ) {
        setMessage(
          "You are not authorized to create a triage record for this patient."
        );

        return;
      }

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(
              () => null
            );

        throw new Error(
          errorData?.detail ||
            "Assessment failed"
        );
      }

      const data: TriageResult =
        await response.json();

      setResult(data);

      setHistory(
        (previous) => [
          data,
          ...previous,
        ]
      );

      setSelectedSymptoms([]);
    } catch (error) {
      console.error(
        "Assessment error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete the assessment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyles = (
    risk: string
  ) => {
    const normalized =
      risk?.toLowerCase();

    if (
      normalized === "low"
    ) {
      return {
        badge:
          "border-[#cce7d6] bg-[#eaf7ef] text-[#28734b]",

        icon:
          "bg-[#dff2e6] text-[#28734b]",

        accent:
          "border-[#cce7d6] bg-[#f4fbf6]",
      };
    }

    if (
      normalized === "moderate"
    ) {
      return {
        badge:
          "border-[#eadbb7] bg-[#fbf4df] text-[#92702c]",

        icon:
          "bg-[#f6edcf] text-[#92702c]",

        accent:
          "border-[#eadbb7] bg-[#fcf8ed]",
      };
    }

    if (
      normalized === "high"
    ) {
      return {
        badge:
          "border-[#efcaca] bg-[#fdf0f0] text-[#a83e3e]",

        icon:
          "bg-[#f9dddd] text-[#a83e3e]",

        accent:
          "border-[#efcaca] bg-[#fdf5f5]",
      };
    }

    return {
      badge:
        "border-[#dce5df] bg-[#f2f5f3] text-[#5d6c64]",

      icon:
        "bg-[#e7ede9] text-[#5d6c64]",

      accent:
        "border-[#dce5df] bg-[#f8faf9]",
    };
  };

  return (
    <AuthGuard allowedRoles={["patient"]}>

      <main className="min-h-screen bg-[#f4f7ef] text-[#17221c]">


        <PatientHeader />


        <div className="relative overflow-hidden">


          <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#dcebd5] opacity-50 blur-3xl" />

          <div className="pointer-events-none absolute -right-40 top-[30%] h-[450px] w-[450px] rounded-full bg-[#e7efd9] opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 lg:pb-12 lg:pt-14">


            <BackToDashboard />


            <section className="animate-fade-up">

              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">


                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d3e1cd] bg-[#f9fbf7] px-4 py-2">

                    <span className="h-2 w-2 rounded-full bg-[#72a846]" />

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#628c42]">
                      AI-Assisted Health Assessment
                    </span>

                  </div>

                  <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] text-[#14251d] sm:text-5xl">

                    Understand your symptoms

                    <span className="text-[#176b4d]">
                      {" "}with confidence.
                    </span>

                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#68766e] sm:text-lg">
                    Select the symptoms you are
                    currently experiencing.
                    HealthAssist will provide
                    an AI-assisted preliminary
                    assessment based on your
                    available health information.
                  </p>

                </div>


                <div className="health-card flex min-w-[240px] items-center gap-4 p-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e1f0e6] text-[#176b4d]">

                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <circle
                        cx="12"
                        cy="8"
                        r="3.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M5.5 19C6.3 15.7 8.5 14 12 14C15.5 14 17.7 15.7 18.5 19"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                    </svg>

                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wider text-[#89968f]">
                      Patient
                    </p>

                    <p className="mt-1 font-semibold text-[#263b31]">
                      {patientName ||
                        "Your Health Profile"}
                    </p>

                  </div>

                </div>

              </div>

            </section>


            <section className="animate-fade-up mt-8">

              <div className="flex gap-4 rounded-2xl border border-[#eadbb7] bg-[#fcf8eb] p-5 shadow-sm">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4e9c9] text-[#92702c]">

                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >

                    <path
                      d="M12 8V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="12"
                      cy="16"
                      r="1"
                      fill="currentColor"
                    />

                    <path
                      d="M10.3 4.4L3.2 17.1C2.4 18.6 3.5 20.5 5.2 20.5H18.8C20.5 20.5 21.6 18.6 20.8 17.1L13.7 4.4C13 3.1 11 3.1 10.3 4.4Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                  </svg>

                </div>

                <div>

                  <p className="font-semibold text-[#715522]">
                    Important health information
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#806b42]">
                    This tool provides an
                    AI-assisted preliminary
                    assessment and is not a
                    medical diagnosis. Please
                    consult a qualified healthcare
                    professional for medical advice.
                  </p>

                </div>

              </div>

            </section>


            <section className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">


              <div className="health-card p-6 sm:p-8">

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e2f1e7] text-[#176b4d]">

                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >

                          <path
                            d="M8 4.5C8 3.67 8.67 3 9.5 3H14.5C15.33 3 16 3.67 16 4.5V6H18C19.1 6 20 6.9 20 8V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V8C4 6.9 4.9 6 6 6H8V4.5Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />

                          <path
                            d="M9 6H15"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />

                          <path
                            d="M8 12H16M8 15.5H13"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />

                        </svg>

                      </div>

                      <div>

                        <h2 className="text-xl font-bold tracking-tight text-[#23382e]">
                          Select your symptoms
                        </h2>

                        <p className="mt-1 text-sm text-[#7a877f]">
                          Choose all symptoms that
                          currently apply.
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-full border border-[#d7e4da] bg-[#f3f8f4] px-3.5 py-2 text-xs font-bold text-[#46705a]">

                    {selectedSymptoms.length} selected

                  </div>

                </div>


                <div className="mt-7 grid gap-3 sm:grid-cols-2">

                  {symptoms.map(
                    (symptom) => {

                      const selected =
                        selectedSymptoms.includes(
                          symptom
                        );

                      return (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() =>
                            toggleSymptom(
                              symptom
                            )
                          }
                          aria-pressed={
                            selected
                          }
                          className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                            selected
                              ? "border-[#8bb99d] bg-[#edf7f0] shadow-[0_8px_24px_rgba(23,107,77,0.08)]"
                              : "border-[#e1e7e2] bg-white hover:-translate-y-0.5 hover:border-[#bfd4c6] hover:bg-[#fbfdfb] hover:shadow-[0_8px_25px_rgba(23,34,28,0.05)]"
                          }`}
                        >

                          <div className="flex items-center gap-4">


                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                                selected
                                  ? "border-[#176b4d] bg-[#176b4d] text-white"
                                  : "border-[#cbd6cf] bg-white text-transparent group-hover:border-[#8fb49f]"
                              }`}
                            >

                              {selected && (
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                >

                                  <path
                                    d="M4.5 10.2L8.2 14L15.5 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />

                                </svg>
                              )}

                            </div>


                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                selected
                                  ? "bg-white text-[#176b4d]"
                                  : "bg-[#f2f5f2] text-[#75847b] group-hover:bg-[#edf5ef] group-hover:text-[#176b4d]"
                              }`}
                            >

                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                              >

                                <path
                                  d="M12 3.5C12 3.5 6.5 9.3 6.5 14.1C6.5 17.3 8.96 20 12 20C15.04 20 17.5 17.3 17.5 14.1C17.5 9.3 12 3.5 12 3.5Z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />

                                <path
                                  d="M9.5 14.2C9.8 16 10.7 17 12.2 17.2"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />

                              </svg>

                            </div>


                            <div className="min-w-0">

                              <p
                                className={`font-semibold ${
                                  selected
                                    ? "text-[#176b4d]"
                                    : "text-[#34453c]"
                                }`}
                              >
                                {symptom}
                              </p>

                              <p className="mt-0.5 text-xs text-[#98a39d]">
                                {selected
                                  ? "Selected"
                                  : "Tap to select"}
                              </p>

                            </div>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>


                {message && (
                  <div className="mt-5 flex gap-3 rounded-2xl border border-[#edcece] bg-[#fff5f5] p-4">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f9dfdf] text-[#ad4545]">

                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />

                        <path
                          d="M12 8V12"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <circle
                          cx="12"
                          cy="16"
                          r="1"
                          fill="currentColor"
                        />

                      </svg>

                    </div>

                    <p className="text-sm leading-6 text-[#9b4949]">
                      {message}
                    </p>

                  </div>
                )}


                <button
                  type="button"
                  onClick={
                    assessSymptoms
                  }
                  disabled={
                    loading ||
                    patientId === null
                  }
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#176b4d] px-6 py-4 font-bold text-white shadow-[0_12px_28px_rgba(23,107,77,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#125b41] hover:shadow-[0_16px_32px_rgba(23,107,77,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Analyzing Symptoms...
                    </>
                  ) : patientId === null ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Loading Patient...
                    </>
                  ) : (
                    <>
                      Analyze My Symptoms

                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <path
                          d="M5 12H19M13 6L19 12L13 18"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                      </svg>

                    </>
                  )}

                </button>

                <p className="mt-3 text-center text-xs text-[#929d96]">
                  Your assessment is securely
                  processed through the
                  HealthAssist backend.
                </p>

              </div>


              <aside className="health-card h-fit p-6 sm:p-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f1e7] text-[#176b4d]">

                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <path
                        d="M12 3L19 6V11C19 15.6 16.2 19.2 12 21C7.8 19.2 5 15.6 5 11V6L12 3Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />

                      <path
                        d="M9 12L11 14L15.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </div>

                  <div>

                    <h2 className="font-bold text-[#263a30]">
                      How it works
                    </h2>

                    <p className="text-xs text-[#89968f]">
                      A simple three-step
                      assessment
                    </p>

                  </div>

                </div>

                <div className="relative mt-7 space-y-7">

                  <div className="absolute left-5 top-6 bottom-6 w-px bg-[#dce7df]" />


                  <div className="relative flex gap-4">

                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#cfe2d5] bg-[#edf7f0] text-sm font-bold text-[#176b4d]">
                      01
                    </div>

                    <div className="pt-0.5">

                      <p className="font-semibold text-[#2e4138]">
                        Select symptoms
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#7d8982]">
                        Choose the symptoms
                        you are currently
                        experiencing.
                      </p>

                    </div>

                  </div>


                  <div className="relative flex gap-4">

                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#cfe2d5] bg-[#edf7f0] text-sm font-bold text-[#176b4d]">
                      02
                    </div>

                    <div className="pt-0.5">

                      <p className="font-semibold text-[#2e4138]">
                        AI assessment
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#7d8982]">
                        The trained machine
                        learning model
                        analyzes the available
                        information.
                      </p>

                    </div>

                  </div>


                  <div className="relative flex gap-4">

                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#cfe2d5] bg-[#edf7f0] text-sm font-bold text-[#176b4d]">
                      03
                    </div>

                    <div className="pt-0.5">

                      <p className="font-semibold text-[#2e4138]">
                        Review your result
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#7d8982]">
                        Review the predicted
                        condition, risk level
                        and recommendation.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="mt-8 rounded-2xl border border-[#dce8df] bg-[#f5f9f5] p-4">

                  <div className="flex gap-3">

                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#4d7c61]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />

                      <path
                        d="M8 10V7.5C8 5.3 9.8 3.5 12 3.5C14.2 3.5 16 5.3 16 7.5V10"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />

                      <circle
                        cx="12"
                        cy="15"
                        r="1.2"
                        fill="currentColor"
                      />

                    </svg>

                    <p className="text-xs leading-5 text-[#68786e]">
                      Your triage assessment is
                      associated with your
                      authenticated patient profile.
                    </p>

                  </div>

                </div>

              </aside>

            </section>


            {result && (
              <section className="animate-scale-in mt-8">

                <div className="health-card overflow-hidden">


                  <div className="border-b border-[#e3e9e4] bg-[#f8faf7] px-6 py-5 sm:px-8">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff0e5] text-[#176b4d]">

                          <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                          >

                            <path
                              d="M12 3L19 6V11C19 15.6 16.2 19.2 12 21C7.8 19.2 5 15.6 5 11V6L12 3Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />

                            <path
                              d="M8.5 12L11 14.5L15.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                          </svg>

                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7e8b83]">
                            Assessment result
                          </p>

                          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#20382c]">
                            Your assessment is complete
                          </h2>

                        </div>

                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cce7d6] bg-[#edf8f1] px-3.5 py-2 text-xs font-bold text-[#28734b]">

                        <span className="h-1.5 w-1.5 rounded-full bg-[#3c9563]" />

                        Complete

                      </span>

                    </div>

                  </div>


                  <div className="p-6 sm:p-8">

                    <div className="grid gap-5 md:grid-cols-2">


                      <div className="rounded-2xl border border-[#dce5df] bg-white p-6">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5ef] text-[#176b4d]">

                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >

                              <circle
                                cx="11"
                                cy="11"
                                r="6.5"
                                stroke="currentColor"
                                strokeWidth="1.7"
                              />

                              <path
                                d="M16 16L20 20"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                              />

                            </svg>

                          </div>

                          <p className="text-sm font-semibold text-[#738078]">
                            Predicted Condition
                          </p>

                        </div>

                        <p className="mt-5 text-2xl font-bold tracking-tight text-[#176b4d]">
                          {result.prediction}
                        </p>

                      </div>


                      <div className="rounded-2xl border border-[#dce5df] bg-white p-6">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              getRiskStyles(
                                result.risk_level
                              ).icon
                            }`}
                          >

                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >

                              <path
                                d="M12 3L19 6V11C19 15.6 16.2 19.2 12 21C7.8 19.2 5 15.6 5 11V6L12 3Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                              />

                            </svg>

                          </div>

                          <p className="text-sm font-semibold text-[#738078]">
                            Risk Level
                          </p>

                        </div>

                        <div className="mt-4">

                          <span
                            className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold ${
                              getRiskStyles(
                                result.risk_level
                              ).badge
                            }`}
                          >
                            {result.risk_level}
                          </span>

                        </div>

                      </div>

                    </div>


                    <div
                      className={`mt-5 rounded-2xl border p-6 ${
                        getRiskStyles(
                          result.risk_level
                        ).accent
                      }`}
                    >

                      <div className="flex gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#176b4d] shadow-sm">

                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                          >

                            <path
                              d="M9 18H15"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />

                            <path
                              d="M10 21H14"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />

                            <path
                              d="M8.5 15.5C7.2 14.4 6.5 12.8 6.5 11C6.5 7.96 8.96 5.5 12 5.5C15.04 5.5 17.5 7.96 17.5 11C17.5 12.8 16.8 14.4 15.5 15.5C14.8 16.1 14.5 16.6 14.5 17H9.5C9.5 16.6 9.2 16.1 8.5 15.5Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />

                          </svg>

                        </div>

                        <div>

                          <p className="font-bold text-[#34493d]">
                            Recommendation
                          </p>

                          <p className="mt-2 text-sm leading-7 text-[#66756c]">
                            {result.recommendation}
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="mt-5 rounded-2xl border border-[#e1e7e2] bg-[#fafcf9] p-5">

                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8a958f]">
                        Symptoms assessed
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {result.symptoms
                          .split(",")
                          .map(
                            (symptom) => (
                              <span
                                key={symptom}
                                className="rounded-full border border-[#d9e5dc] bg-white px-3 py-1.5 text-xs font-medium text-[#52645a]"
                              >
                                {symptom.trim()}
                              </span>
                            )
                          )}

                      </div>

                    </div>


                    <div className="mt-5 flex gap-3 rounded-xl bg-[#f5f7f5] p-4">

                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8a9690]"
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />

                        <path
                          d="M12 11V16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />

                        <circle
                          cx="12"
                          cy="8"
                          r="1"
                          fill="currentColor"
                        />

                      </svg>

                      <p className="text-xs leading-5 text-[#7c8781]">
                        This result is generated
                        by the application&apos;s machine
                        learning model and should not
                        be treated as a medical
                        diagnosis.
                      </p>

                    </div>

                  </div>

                </div>

              </section>
            )}


            <section className="animate-fade-up mt-8">

              <div className="health-card p-6 sm:p-8">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9f2eb] text-[#176b4d]">

                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <path
                          d="M6 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6C4 4.9 4.9 4 6 4Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />

                        <path
                          d="M8 9H16M8 12.5H16M8 16H13"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />

                      </svg>

                    </div>

                    <div>

                      <h2 className="text-xl font-bold tracking-tight text-[#263a30]">
                        Previous assessments
                      </h2>

                      <p className="mt-1 text-sm text-[#7c8981]">
                        Review your previous triage
                        assessment records.
                      </p>

                    </div>

                  </div>

                  <span className="w-fit rounded-full border border-[#dce6df] bg-[#f4f7f4] px-3.5 py-2 text-xs font-bold text-[#65736b]">

                    {history.length}{" "}

                    {history.length === 1
                      ? "Assessment"
                      : "Assessments"}

                  </span>

                </div>


                {history.length === 0 ? (

                  <div className="mt-7 rounded-2xl border border-dashed border-[#d7e0d9] bg-[#fafcf9] px-6 py-12 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ef] text-[#71907d]">

                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <path
                          d="M6 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6C4 4.9 4.9 4 6 4Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />

                        <path
                          d="M8 9H16M8 12.5H14"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />

                      </svg>

                    </div>

                    <p className="mt-4 font-semibold text-[#52645a]">
                      No previous assessments
                    </p>

                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#8b9690]">
                      Your completed triage
                      assessments will appear
                      here.
                    </p>

                  </div>

                ) : (

                  <div className="mt-7 space-y-4">

                    {history.map(
                      (item) => {

                        const riskStyles =
                          getRiskStyles(
                            item.risk_level
                          );

                        return (
                          <article
                            key={
                              item.triage_id
                            }
                            className="rounded-2xl border border-[#e0e7e1] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cad9ce] hover:shadow-[0_12px_30px_rgba(23,34,28,0.055)] sm:p-6"
                          >

                            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-3">

                                  <h3 className="text-lg font-bold text-[#2b4035]">
                                    {item.prediction}
                                  </h3>

                                  <span
                                    className={`rounded-full border px-3 py-1 text-xs font-bold ${riskStyles.badge}`}
                                  >
                                    {item.risk_level}
                                  </span>

                                </div>


                                <div className="mt-4 flex flex-wrap gap-2">

                                  {item.symptoms
                                    .split(",")
                                    .map(
                                      (
                                        symptom
                                      ) => (
                                        <span
                                          key={
                                            symptom
                                          }
                                          className="rounded-full bg-[#f3f6f3] px-3 py-1.5 text-xs font-medium text-[#64736a]"
                                        >
                                          {symptom.trim()}
                                        </span>
                                      )
                                    )}

                                </div>

                              </div>


                              <div className="flex shrink-0 items-center gap-2 text-xs text-[#8b9690]">

                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >

                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="8.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />

                                  <path
                                    d="M12 7V12L15 14"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />

                                </svg>

                                {new Date(
                                  item.created_at
                                ).toLocaleString()}

                              </div>

                            </div>


                            <div className="mt-5 border-t border-[#edf0ed] pt-5">

                              <div className="flex gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf5ef] text-[#176b4d]">

                                  <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >

                                    <path
                                      d="M12 3.5V20.5M4.5 12H19.5"
                                      stroke="currentColor"
                                      strokeWidth="1.7"
                                      strokeLinecap="round"
                                    />

                                  </svg>

                                </div>

                                <div>

                                  <p className="text-sm font-bold text-[#52635a]">
                                    Recommendation
                                  </p>

                                  <p className="mt-1 text-sm leading-6 text-[#78857e]">
                                    {
                                      item.recommendation
                                    }
                                  </p>

                                </div>

                              </div>

                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>

                )}

              </div>

            </section>


            <div className="mt-10 pb-4 text-center">

              <p className="text-xs leading-5 text-[#929d96]">
                HealthAssist provides
                technology-assisted health
                information and does not replace
                professional medical care.
              </p>

            </div>

          </div>

        </div>

      </main>

    </AuthGuard>
  );
}
