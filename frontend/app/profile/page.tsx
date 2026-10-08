"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";
import PatientHeader from "../../components/PatientHeader";
import BackToDashboard from "../../components/BackToDashboard";

interface Patient {
  patient_id: number;
  user_id?: number | null;
  age: number;
  gender: string;
  bmi: number;
  smoking_status?: string;
  alcohol_consumption?: string;
  exercise_level?: string;
  diet_type?: string;
  sun_exposure?: string;
  income_level?: string;
  latitude_region?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  export default function ProfilePage() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // LOAD PATIENT
  // =========================================================

  useEffect(() => {
    async function loadPatient() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/patients/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_id");

          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Unable to load patient information."
          );
        }

        const data = await response.json();

        setPatient(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, []);

  // =========================================================
  // HANDLE FIELD CHANGE
  // =========================================================

  const handleChange = (
    field: keyof Patient,
    value: string | number
  ) => {
    if (!patient) return;

    setPatient({
      ...patient,
      [field]: value,
    });
  };

  // =========================================================
  // UPDATE PATIENT
  // =========================================================

  const updatePatient = async () => {
    if (!patient) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/patients/${patient.patient_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            age: patient.age,
            gender: patient.gender,
            bmi: patient.bmi,
            smoking_status: patient.smoking_status,
            alcohol_consumption:
              patient.alcohol_consumption,
            exercise_level: patient.exercise_level,
            diet_type: patient.diet_type,
            sun_exposure: patient.sun_exposure,
            income_level: patient.income_level,
            latitude_region: patient.latitude_region,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");

        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to update patient information."
        );
      }

      const updatedPatient = await response.json();

      setPatient(updatedPatient);
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["patient"]}>
      <main className="min-h-screen bg-[#f4f7ef] text-[#17221c]">


        <PatientHeader />
                

        <section className="relative overflow-hidden">


          <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#dcebd5] opacity-50 blur-3xl" />

          <div className="pointer-events-none absolute -right-40 top-[35%] h-[450px] w-[450px] rounded-full bg-[#e7efd9] opacity-60 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">


            <BackToDashboard />


            <div className="animate-fade-up">

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d3e1cd] bg-[#f9fbf7] px-4 py-2">

                    <span className="h-2 w-2 rounded-full bg-[#72a846] animate-gentle-pulse" />

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#628c42]">
                      Patient Profile
                    </span>

                  </div>

                  <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-[#14251d] sm:text-5xl">
                    Personal & Health
                    <span className="text-[#72a846]">
                      {" "}Information
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#68756d]">
                    View and manage your demographic and lifestyle
                    information in one secure place.
                  </p>

                </div>


                {patient && !editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-[#176b4d] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#176b4d]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f5139] hover:shadow-xl"
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20h9"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 3.5a2.12 2.12 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                      />
                    </svg>

                    Edit Profile

                  </button>
                )}

              </div>

            </div>


            {loading && (
              <div className="mt-8 health-card flex min-h-[250px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dce8d8] border-t-[#176b4d]" />

                  <p className="mt-4 text-sm font-semibold text-[#748078]">
                    Loading patient information...
                  </p>

                </div>

              </div>
            )}


            {!loading && error && (
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#f0cccc] bg-[#fff6f6] p-5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fee4e4] font-bold text-[#c94c4c]">
                  !
                </div>

                <div>
                  <p className="font-bold text-[#a83f3f]">
                    Unable to load profile
                  </p>

                  <p className="mt-1 text-sm text-[#b65a5a]">
                    {error}
                  </p>
                </div>

              </div>
            )}


            {!loading && patient && (
              <div className="mt-8 space-y-6">


                <div className="health-card overflow-hidden animate-scale-in">

                  <div className="bg-[#176b4d] px-7 py-7 text-white sm:px-8">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">


                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/15 ring-1 ring-white/20">

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-10 w-10"
                        >

                          <circle
                            cx="12"
                            cy="8"
                            r="3.5"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 20c.8-3.7 3.3-5.5 7.5-5.5s6.7 1.8 7.5 5.5"
                          />

                        </svg>

                      </div>

                      <div className="flex-1">

                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#cfe5d8]">
                          Patient account
                        </p>

                        <h2 className="mt-1 text-2xl font-black">
                          Patient #{patient.patient_id}
                        </h2>

                        <p className="mt-1 text-sm text-[#dceee5]">
                          Your personal healthcare information
                        </p>

                      </div>

                      <div className="flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2">

                        <span className="h-2 w-2 rounded-full bg-[#b9e18e]" />

                        <span className="text-xs font-bold text-[#e7f3e8]">
                          Active profile
                        </span>

                      </div>

                    </div>

                  </div>


                  <div className="grid divide-y divide-[#e4ebe1] sm:grid-cols-3 sm:divide-x sm:divide-y-0">

                    <SummaryStat
                      label="Age"
                      value={`${patient.age} years`}
                    />

                    <SummaryStat
                      label="Gender"
                      value={patient.gender}
                    />

                    <SummaryStat
                      label="BMI"
                      value={String(patient.bmi)}
                    />

                  </div>

                </div>


                <section className="health-card p-6 sm:p-7">

                  <SectionHeader
                    icon="user"
                    title="Basic Information"
                    description="Your primary demographic and health measurements."
                  />

                  <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <InfoCard
                      label="Patient ID"
                      value={String(patient.patient_id)}
                      icon="id"
                    />

                    <InfoCard
                      label="User ID"
                      value={
                        patient.user_id == null
                          ? "Not linked"
                          : String(patient.user_id)
                      }
                      icon="user"
                    />

                    {editing ? (
                      <>
                        <InputCard
                          label="Age"
                          type="number"
                          value={patient.age}
                          onChange={(value) =>
                            handleChange(
                              "age",
                              Number(value)
                            )
                          }
                        />

                        <InputCard
                          label="Gender"
                          value={patient.gender}
                          onChange={(value) =>
                            handleChange(
                              "gender",
                              value
                            )
                          }
                        />

                        <InputCard
                          label="BMI"
                          type="number"
                          value={patient.bmi}
                          onChange={(value) =>
                            handleChange(
                              "bmi",
                              Number(value)
                            )
                          }
                        />
                      </>
                    ) : (
                      <>
                        <InfoCard
                          label="Age"
                          value={`${patient.age} years`}
                          icon="age"
                        />

                        <InfoCard
                          label="Gender"
                          value={patient.gender}
                          icon="gender"
                        />

                        <InfoCard
                          label="BMI"
                          value={String(patient.bmi)}
                          icon="bmi"
                        />
                      </>
                    )}

                  </div>

                </section>


                <section className="health-card p-6 sm:p-7">

                  <SectionHeader
                    icon="heart"
                    title="Lifestyle Information"
                    description="Lifestyle details that can support your healthcare assessment."
                  />

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">

                    {editing ? (
                      <>
                        <InputCard
                          label="Smoking Status"
                          value={
                            patient.smoking_status || ""
                          }
                          onChange={(value) =>
                            handleChange(
                              "smoking_status",
                              value
                            )
                          }
                        />

                        <InputCard
                          label="Alcohol Consumption"
                          value={
                            patient.alcohol_consumption ===
                            "NaN"
                              ? ""
                              : patient.alcohol_consumption || ""
                          }
                          onChange={(value) =>
                            handleChange(
                              "alcohol_consumption",
                              value
                            )
                          }
                        />

                        <InputCard
                          label="Exercise Level"
                          value={
                            patient.exercise_level || ""
                          }
                          onChange={(value) =>
                            handleChange(
                              "exercise_level",
                              value
                            )
                          }
                        />

                        <InputCard
                          label="Diet Type"
                          value={
                            patient.diet_type || ""
                          }
                          onChange={(value) =>
                            handleChange(
                              "diet_type",
                              value
                            )
                          }
                        />

                        <InputCard
                          label="Sun Exposure"
                          value={
                            patient.sun_exposure || ""
                          }
                          onChange={(value) =>
                            handleChange(
                              "sun_exposure",
                              value
                            )
                          }
                        />

                        <InputCard
                          label="Income Level"
                          value={
                            patient.income_level || ""
                          }
                          onChange={(value) =>
                            handleChange(
                              "income_level",
                              value
                            )
                          }
                        />

                        <InputCard
                          label="Latitude Region"
                          value={
                            patient.latitude_region || ""
                          }
                          onChange={(value) =>
                            handleChange(
                              "latitude_region",
                              value
                            )
                          }
                        />
                      </>
                    ) : (
                      <>
                        <InfoCard
                          label="Smoking Status"
                          value={
                            patient.smoking_status ||
                            "Not provided"
                          }
                          icon="smoking"
                        />

                        <InfoCard
                          label="Alcohol Consumption"
                          value={
                            !patient.alcohol_consumption ||
                            patient.alcohol_consumption ===
                              "NaN"
                              ? "Not provided"
                              : patient.alcohol_consumption
                          }
                          icon="alcohol"
                        />

                        <InfoCard
                          label="Exercise Level"
                          value={
                            patient.exercise_level ||
                            "Not provided"
                          }
                          icon="exercise"
                        />

                        <InfoCard
                          label="Diet Type"
                          value={
                            patient.diet_type ||
                            "Not provided"
                          }
                          icon="diet"
                        />

                        <InfoCard
                          label="Sun Exposure"
                          value={
                            patient.sun_exposure ||
                            "Not provided"
                          }
                          icon="sun"
                        />

                        <InfoCard
                          label="Income Level"
                          value={
                            patient.income_level ||
                            "Not provided"
                          }
                          icon="income"
                        />

                        <InfoCard
                          label="Latitude Region"
                          value={
                            patient.latitude_region ||
                            "Not provided"
                          }
                          icon="location"
                        />
                      </>
                    )}

                  </div>

                </section>


                {editing && (
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="rounded-xl border border-[#d2ddd0] bg-white px-6 py-3.5 text-sm font-extrabold text-[#5d6962] transition-all duration-300 hover:bg-[#f8faf6] disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={updatePatient}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#176b4d] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#176b4d]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f5139] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {saving ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Saving...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12l4 4L19 6"
                            />
                          </svg>

                          Save Changes
                        </>
                      )}

                    </button>

                  </div>
                )}


                {!editing && (
                  <div className="flex items-start gap-4 rounded-2xl border border-[#d8e5d3] bg-[#edf5e8] p-5">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6a963f] shadow-sm">

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />

                        <path
                          strokeLinecap="round"
                          d="M12 10v6"
                        />

                        <circle
                          cx="12"
                          cy="7"
                          r=".7"
                          fill="currentColor"
                        />
                      </svg>

                    </div>

                    <div>

                      <p className="font-extrabold text-[#40533f]">
                        Keep your information up to date
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#687965]">
                        Accurate profile information can help provide
                        more relevant healthcare support and assessments.
                      </p>

                    </div>

                  </div>
                )}


                <div className="flex flex-col items-center justify-between gap-3 border-t border-[#dfe7dc] pt-6 text-center sm:flex-row sm:text-left">

                  <p className="text-xs text-[#8a958e]">
                    HealthAssist • Patient Profile
                  </p>

                  <p className="text-xs text-[#8a958e]">
                    Your information is protected by authenticated access.
                  </p>

                </div>

              </div>
            )}

          </div>

        </section>

      </main>
    </AuthGuard>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-7 py-5">

      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#89958e]">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-[#304239]">
        {value}
      </p>

    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: "user" | "heart";
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f0df] text-[#6a963f]">

        {icon === "user" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-6 w-6"
          >
            <circle
              cx="12"
              cy="8"
              r="3"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.8 4.8 0 018 4c1.5 0 3 .7 4 1.9C13 4.7 14.5 4 16 4a4.8 4.8 0 014.8 4.8z"
            />
          </svg>
        )}

      </div>

      <div>

        <h2 className="text-xl font-black tracking-tight text-[#24372d]">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#7b8780]">
          {description}
        </p>

      </div>

    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#e1e9de] bg-[#f8faf6] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4e1cf] hover:bg-white hover:shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#89958e]">
            {label}
          </p>

          <p className="mt-2 break-words font-extrabold text-[#304239]">
            {value}
          </p>

        </div>

        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#6a963f] shadow-sm">

            <InfoIcon type={icon} />

          </div>
        )}

      </div>

    </div>
  );
}

function InputCard({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[#d2dfce] bg-white px-4 py-3.5 text-sm font-medium text-[#304239] outline-none transition-all duration-200 placeholder:text-[#9ca8a0] focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
      />

    </div>
  );
}

function InfoIcon({
  type,
}: {
  type: string;
}) {
  if (type === "id") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
        />

        <path
          strokeLinecap="round"
          d="M8 9h8M8 13h5M8 17h3"
        />
      </svg>
    );
  }

  if (type === "age") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <circle
          cx="12"
          cy="8"
          r="3"
        />

        <path
          strokeLinecap="round"
          d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5"
        />
      </svg>
    );
  }

  if (type === "gender") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <circle
          cx="9"
          cy="15"
          r="4"
        />

        <path
          strokeLinecap="round"
          d="M12 12l7-7M14 5h5v5"
        />
      </svg>
    );
  }

  if (type === "bmi") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 19a7 7 0 0114 0"
        />

        <path
          strokeLinecap="round"
          d="M12 12l3-3"
        />

        <path
          strokeLinecap="round"
          d="M8 19h8"
        />
      </svg>
    );
  }

  if (type === "exercise") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          d="M6 12h12M4 9v6M20 9v6M7 8v8M17 8v8"
        />
      </svg>
    );
  }

  if (type === "sun") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <circle
          cx="12"
          cy="12"
          r="4"
        />

        <path
          strokeLinecap="round"
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </svg>
    );
  }

  if (type === "location") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
        />

        <circle
          cx="12"
          cy="10"
          r="2.5"
        />
      </svg>
    );
  }

  if (type === "heart") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.8 4.8 0 018 4c1.5 0 3 .7 4 1.9C13 4.7 14.5 4 16 4a4.8 4.8 0 014.8 4.8z"
        />
      </svg>
    );
  }

  // Generic icon for remaining lifestyle fields
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <path
        strokeLinecap="round"
        d="M12 8v4l2.5 2"
      />
    </svg>
  );
}
