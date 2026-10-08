"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthGuard from "../../../components/AuthGuard";
import AdminHeader from "../../../components/AdminHeader";
import Icon from "../../../components/Icon";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Patient = {
  patient_id: number;
  user_id?: number | null;

  age: number;
  gender: string;
  bmi: number;

  smoking_status?: string | null;
  alcohol_consumption?: string | null;
  exercise_level?: string | null;
  diet_type?: string | null;
  sun_exposure?: string | null;
  income_level?: string | null;
  latitude_region?: string | null;
};

type PatientForm = {
  email: string;
  password: string;

  age: number;
  gender: string;
  bmi: number;

  smoking_status: string;
  alcohol_consumption: string;
  exercise_level: string;
  diet_type: string;
  sun_exposure: string;
  income_level: string;
  latitude_region: string;
};

const emptyForm: PatientForm = {
  email: "",
  password: "",

  age: 0,
  gender: "",
  bmi: 0,

  smoking_status: "",
  alcohol_consumption: "",
  exercise_level: "",
  diet_type: "",
  sun_exposure: "",
  income_level: "",
  latitude_region: "",
};

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  max,
  step,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">
        {label}

        {required && (
          <span className="ml-1 text-[#4f9870]">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none transition-all placeholder:text-[#a1aca5] focus:border-[#76a78a] focus:bg-white focus:ring-4 focus:ring-[#dceee2]"
      />
    </div>
  );
}

function PatientFormFields({
  form,
  setForm,
}: {
  form: PatientForm;
  setForm: Dispatch<SetStateAction<PatientForm>>;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">

      <FormField
        label="Patient Email"
        type="email"
        required
        value={form.email}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            email: value,
          }))
        }
        placeholder="patient@example.com"
      />

      <FormField
        label="Patient Password"
        type="password"
        required
        value={form.password}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            password: value,
          }))
        }
        placeholder="Minimum 8 characters"
      />

      <FormField
        label="Age"
        type="number"
        required
        min="1"
        max="120"
        value={form.age || ""}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            age: Number(value),
          }))
        }
        placeholder="Enter age"
      />

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">
          Gender <span className="text-[#4f9870]">*</span>
        </label>

        <select
          value={form.gender}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              gender: event.target.value,
            }))
          }
          className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none focus:border-[#76a78a] focus:bg-white focus:ring-4 focus:ring-[#dceee2]"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <FormField
        label="BMI"
        type="number"
        required
        min="0.1"
        max="100"
        step="0.1"
        value={form.bmi || ""}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            bmi: Number(value),
          }))
        }
        placeholder="Enter BMI"
      />

      <FormField
        label="Smoking Status"
        value={form.smoking_status}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            smoking_status: value,
          }))
        }
        placeholder="e.g. Never"
      />

      <FormField
        label="Alcohol Consumption"
        value={form.alcohol_consumption}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            alcohol_consumption: value,
          }))
        }
        placeholder="e.g. None"
      />

      <FormField
        label="Exercise Level"
        value={form.exercise_level}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            exercise_level: value,
          }))
        }
        placeholder="e.g. Active"
      />

      <FormField
        label="Diet Type"
        value={form.diet_type}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            diet_type: value,
          }))
        }
        placeholder="e.g. Vegetarian"
      />

      <FormField
        label="Sun Exposure"
        value={form.sun_exposure}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            sun_exposure: value,
          }))
        }
        placeholder="e.g. Moderate"
      />

      <FormField
        label="Income Level"
        value={form.income_level}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            income_level: value,
          }))
        }
        placeholder="e.g. Medium"
      />

      <FormField
        label="Latitude Region"
        value={form.latitude_region}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            latitude_region: value,
          }))
        }
        placeholder="e.g. Tropical"
      />
    </div>
  );
}

export default function AdminPatientsPage() {
  const router = useRouter();

function handleLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_id");

  router.replace("/login");
}



  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [editingPatient, setEditingPatient] =
    useState<Patient | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [newPatient, setNewPatient] =
    useState<PatientForm>(emptyForm);

  const [search, setSearch] =
    useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const adminResponse = await fetch(
        `${API_URL}/auth/admin-test`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (adminResponse.status === 401) {
        handleLogout();
        return;
      }

      if (!adminResponse.ok) {
        router.replace("/dashboard");
        return;
      }

      const response = await fetch(
        `${API_URL}/patients/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load patients"
        );
      }

      const data = await response.json();

      setPatients(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadPatients, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredPatients = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        String(patient.patient_id)
          .toLowerCase()
          .includes(query) ||

        String(patient.user_id ?? "")
          .toLowerCase()
          .includes(query) ||

        patient.gender
          .toLowerCase()
          .includes(query) ||

        String(patient.age)
          .includes(query) ||

        String(patient.bmi)
          .includes(query) ||

        String(patient.smoking_status ?? "")
          .toLowerCase()
          .includes(query) ||

        String(patient.exercise_level ?? "")
          .toLowerCase()
          .includes(query) ||

        String(patient.diet_type ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [patients, search]);

  const createPatient = async () => {
    if (!newPatient.email.trim()) {
      alert(
        "Please enter the patient's email."
      );
      return;
    }

    if (!newPatient.password) {
      alert(
        "Please enter a password for the patient."
      );
      return;
    }

    if (newPatient.password.length < 8) {
      alert(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!newPatient.age) {
      alert(
        "Please enter the patient's age."
      );
      return;
    }

    if (
      newPatient.age < 1 ||
      newPatient.age > 120
    ) {
      alert(
        "Age must be between 1 and 120."
      );
      return;
    }

    if (!newPatient.gender) {
      alert(
        "Please select the patient's gender."
      );
      return;
    }

    if (!newPatient.bmi) {
      alert(
        "Please enter the patient's BMI."
      );
      return;
    }

    if (
      newPatient.bmi <= 0 ||
      newPatient.bmi > 100
    ) {
      alert(
        "BMI must be greater than 0 and less than 100."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/patients/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            email:
              newPatient.email.trim(),

            password:
              newPatient.password,

            age:
              Number(newPatient.age),

            gender:
              newPatient.gender,

            bmi:
              Number(newPatient.bmi),

            smoking_status:
              newPatient.smoking_status ||
              null,

            alcohol_consumption:
              newPatient.alcohol_consumption ||
              null,

            exercise_level:
              newPatient.exercise_level ||
              null,

            diet_type:
              newPatient.diet_type ||
              null,

            sun_exposure:
              newPatient.sun_exposure ||
              null,

            income_level:
              newPatient.income_level ||
              null,

            latitude_region:
              newPatient.latitude_region ||
              null,
          }),
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.detail ||
          "Failed to create patient"
        );
      }

      const createdPatient =
        await response.json();

      setPatients(
        (currentPatients) => [
          ...currentPatients,
          createdPatient,
        ]
      );

      setNewPatient(emptyForm);

      setCreating(false);

      alert(
        "Patient created successfully!"
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to create patient"
      );
    } finally {
      setSaving(false);
    }
  };

  const updatePatient = async () => {
    if (!editingPatient) {
      return;
    }

    if (
      editingPatient.age < 1 ||
      editingPatient.age > 120
    ) {
      alert(
        "Age must be between 1 and 120."
      );
      return;
    }

    if (!editingPatient.gender.trim()) {
      alert("Gender is required.");
      return;
    }

    if (
      editingPatient.bmi <= 0 ||
      editingPatient.bmi > 100
    ) {
      alert(
        "BMI must be greater than 0 and less than 100."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/patients/${editingPatient.patient_id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            age:
              Number(editingPatient.age),

            gender:
              editingPatient.gender,

            bmi:
              Number(editingPatient.bmi),

            smoking_status:
              editingPatient.smoking_status ||
              null,

            alcohol_consumption:
              editingPatient.alcohol_consumption ||
              null,

            exercise_level:
              editingPatient.exercise_level ||
              null,

            diet_type:
              editingPatient.diet_type ||
              null,

            sun_exposure:
              editingPatient.sun_exposure ||
              null,

            income_level:
              editingPatient.income_level ||
              null,

            latitude_region:
              editingPatient.latitude_region ||
              null,
          }),
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.detail ||
          "Failed to update patient"
        );
      }

      const updatedPatient =
        await response.json();

      setPatients(
        (currentPatients) =>
          currentPatients.map(
            (patient) =>
              patient.patient_id ===
              updatedPatient.patient_id
                ? updatedPatient
                : patient
          )
      );

      setEditingPatient(null);

      alert(
        "Patient updated successfully!"
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update patient"
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePatient = async (
    patientId: number
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete patient ${patientId}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(patientId);

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/patients/${patientId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.detail ||
          "Failed to delete patient"
        );
      }

      setPatients(
        (currentPatients) =>
          currentPatients.filter(
            (patient) =>
              patient.patient_id !==
              patientId
          )
      );

      alert(
        "Patient deleted successfully!"
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete patient"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <AuthGuard allowedRoles={["admin"]}>
        <main className="flex min-h-screen items-center justify-center bg-[#f6f8f4]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dceee2] border-t-[#176b4d]" />

            <p className="mt-4 text-sm font-semibold text-[#42564b]">
              Loading patient records...
            </p>
          </div>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <main className="min-h-screen bg-[#f6f8f4] text-[#17221c]">


        <AdminHeader />

        <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10">


          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#668075] hover:text-[#176b4d]"
          >
            <Icon
              name="back"
              size={15}
            />
            Back to Admin Dashboard
          </Link>


          <section className="relative mb-7 overflow-hidden rounded-[1.8rem] bg-[#174936] shadow-[0_16px_40px_rgba(23,73,54,0.12)]">

            <div className="relative flex flex-col justify-between gap-7 px-6 py-7 sm:px-9 sm:py-8 lg:flex-row lg:items-center">

              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#c4dfce]">
                  <span className="h-2 w-2 rounded-full bg-[#82c397]" />
                  Patient management
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-white">
                  Manage patient{" "}
                  <span className="text-[#9acb7c]">
                    records.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#c0d5c8]">
                  Review patient information,
                  maintain healthcare records
                  and keep your patient database
                  organized.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a9c8b6]">
                    Total patients
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-white">
                    {patients.length.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewPatient(emptyForm);
                    setCreating(true);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-[#a9d48d] px-5 py-4 text-sm font-bold text-[#193c2b] hover:bg-[#b8df9f]"
                >
                  <Icon
                    name="plus"
                    size={18}
                  />
                  Add Patient
                </button>
              </div>
            </div>
          </section>


          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}


          <section className="overflow-hidden rounded-[1.8rem] border border-[#dfe7e0] bg-white shadow-sm">

            <div className="flex flex-col gap-5 border-b border-[#e6ebe6] px-6 py-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87948c]">
                  Patient database
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#20372c]">
                  All Patients
                </h2>

                <p className="mt-1 text-sm text-[#7b887f]">
                  View and manage registered
                  patient records.
                </p>
              </div>


              <div className="relative w-full lg:w-[320px]">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#839189]">
                  <Icon
                    name="search"
                    size={18}
                  />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search patient records..."
                  className="w-full rounded-2xl border border-[#dce5de] bg-[#f9fbf9] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#76a78a] focus:ring-4 focus:ring-[#e1efe5]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-[#edf0ed] bg-[#fbfcfa] px-6 py-3.5">

              <span className="text-xs font-semibold text-[#718078]">
                {filteredPatients.length}{" "}
                {filteredPatients.length === 1
                  ? "patient"
                  : "patients"}{" "}
                shown
              </span>

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="text-xs font-bold text-[#5b8269] hover:text-[#176b4d]"
                >
                  Clear search
                </button>
              )}
            </div>


            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px]">

                <thead>
                  <tr className="border-b border-[#e7ece7] bg-[#f7faf7]">

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Patient
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      User ID
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Age
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Gender
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      BMI
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Smoking Status
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Alcohol Consumption
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Exercise Level
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Diet Type
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Sun exposure
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Income Level
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Latitude Region
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={13}
                        className="px-6 py-16 text-center"
                      >
                        <Icon
                          name="users"
                          size={30}
                        />

                        <p className="mt-4 text-sm font-bold text-[#3d5146]">
                          No patients found
                        </p>

                        <p className="mt-1 text-xs text-[#8a968f]">
                          Try changing your search
                          or add a new patient.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map(
                      (patient) => (
                        <tr
                          key={
                            patient.patient_id
                          }
                          className="border-b border-[#edf0ed] hover:bg-[#f8fbf8]"
                        >

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f0e6] text-[#347151]">
                                <Icon
                                  name="user"
                                  size={18}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-bold text-[#263b30]">
                                  Patient #
                                  {
                                    patient.patient_id
                                  }
                                </p>

                                <p className="text-[11px] text-[#8a968f]">
                                  Registered
                                  record
                                </p>
                              </div>
                            </div>
                          </td>


                          <td className="px-5 py-4">

                            {patient.user_id !=
                            null ? (
                              <span className="rounded-lg bg-[#e7f3ea] px-3 py-1.5 text-sm font-bold text-[#286044]">
                                {
                                  patient.user_id
                                }
                              </span>
                            ) : (
                              <span className="rounded-lg bg-[#f1f3f1] px-3 py-1.5 text-sm font-medium text-[#89938d]">
                                Not linked
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-[#f1f5f1] px-2.5 py-1.5 text-sm font-bold text-[#43554b]">
                              {patient.age}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-[#58675f]">
                            {patient.gender}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-[#edf5ef] px-2.5 py-1.5 text-sm font-bold text-[#3f7655]">
                              {patient.bmi}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-[#65736b]">
                            {
                              patient.smoking_status ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-[#65736b]">
                            {
                              patient.alcohol_consumption ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-[#65736b]">
                            {
                              patient.exercise_level ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-[#65736b]">
                            {
                              patient.diet_type ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-[#65736b]">
                            {
                              patient.sun_exposure ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-[#65736b]">
                            {
                              patient.income_level ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-[#65736b]">
                            {
                              patient.latitude_region ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  setEditingPatient(
                                    patient
                                  )
                                }
                                className="flex items-center gap-1.5 rounded-xl border border-[#cfe0d4] bg-[#edf6ef] px-3 py-2 text-xs font-bold text-[#397352] hover:bg-[#e2f0e5]"
                              >
                                <Icon
                                  name="edit"
                                  size={15}
                                />
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  deletePatient(
                                    patient.patient_id
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  patient.patient_id
                                }
                                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                              >
                                <Icon
                                  name="trash"
                                  size={15}
                                />

                                {deletingId ===
                                patient.patient_id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}

                </tbody>
              </table>
            </div>


            <div className="space-y-4 p-5 lg:hidden">

              {filteredPatients.length === 0 ? (
                <div className="py-12 text-center">
                  <Icon
                    name="users"
                    size={30}
                  />

                  <p className="mt-4 text-sm font-bold text-[#3d5146]">
                    No patients found
                  </p>
                </div>
              ) : (
                filteredPatients.map(
                  (patient) => (
                    <div
                      key={
                        patient.patient_id
                      }
                      className="rounded-2xl border border-[#dfe7e0] bg-[#fbfcfa] p-5"
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f0e6] text-[#347151]">
                            <Icon
                              name="user"
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="font-bold text-[#263b30]">
                              Patient #
                              {
                                patient.patient_id
                              }
                            </p>

                            <p className="text-xs text-[#89958e]">
                              Age{" "}
                              {patient.age} •{" "}
                              {
                                patient.gender
                              }
                            </p>
                          </div>

                        </div>

                        <div className="text-right">

                          <p className="text-[10px] font-bold uppercase tracking-wide text-[#849088]">
                            User ID
                          </p>

                          <p className="text-sm font-bold text-[#347151]">
                            {patient.user_id ??
                              "Not linked"}
                          </p>

                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-[#89958e]">
                            BMI
                          </p>
                          <p className="mt-1 font-bold text-[#354b3e]">
                            {patient.bmi}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-[#89958e]">
                            Smoking
                          </p>
                          <p className="mt-1 font-bold text-[#354b3e]">
                            {
                              patient.smoking_status ??
                              "—"
                            }
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-[#89958e]">
                            Exercise
                          </p>
                          <p className="mt-1 font-bold text-[#354b3e]">
                            {
                              patient.exercise_level ??
                              "—"
                            }
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-[#89958e]">
                            Diet
                          </p>
                          <p className="mt-1 font-bold text-[#354b3e]">
                            {
                              patient.diet_type ??
                              "—"
                            }
                          </p>
                        </div>

                      </div>

                      <div className="mt-4 flex gap-2">

                        <button
                          onClick={() =>
                            setEditingPatient(
                              patient
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e6f2e9] px-4 py-2.5 text-xs font-bold text-[#397352]"
                        >
                          <Icon
                            name="edit"
                            size={15}
                          />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deletePatient(
                              patient.patient_id
                            )
                          }
                          disabled={
                            deletingId ===
                            patient.patient_id
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 disabled:opacity-50"
                        >
                          <Icon
                            name="trash"
                            size={15}
                          />
                          Delete
                        </button>

                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>
        </div>


        {creating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271d]/55 p-4 backdrop-blur-sm">

            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.8rem] border border-[#dfe7e0] bg-white shadow-[0_30px_90px_rgba(18,48,35,0.25)]">


              <div className="flex items-start justify-between border-b border-[#e7ece7] bg-[#fbfcfa] px-6 py-5">

                <div>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f0e6] text-[#347151]">
                    <Icon
                      name="plus"
                      size={18}
                    />
                  </div>

                  <h2 className="text-xl font-bold text-[#20372c]">
                    Add New Patient
                  </h2>

                  <p className="mt-1 text-sm text-[#7b887f]">
                    Create a patient profile
                    and login account.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setCreating(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#819087] hover:bg-[#edf2ed]"
                >
                  <Icon
                    name="close"
                    size={19}
                  />
                </button>
              </div>


              <div className="overflow-y-auto px-6 py-6">

                <div className="mb-5 rounded-2xl border border-[#dfe9e2] bg-[#f3f9f4] p-4">

                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#779080]">
                    Patient login
                  </p>

                  <p className="mt-1 text-sm text-[#52665b]">
                    The email and password will
                    create the patient&apos;s login
                    account. The generated User ID
                    will automatically be linked to
                    this patient.
                  </p>

                </div>

                <PatientFormFields
                  form={newPatient}
                  setForm={setNewPatient}
                />

              </div>


              <div className="flex justify-end gap-3 border-t border-[#e7ece7] bg-[#fbfcfa] px-6 py-4">

                <button
                  onClick={() =>
                    setCreating(false)
                  }
                  className="rounded-xl border border-[#d9e2db] bg-white px-5 py-2.5 text-sm font-bold text-[#596960] hover:bg-[#f2f5f2]"
                >
                  Cancel
                </button>

                <button
                  onClick={createPatient}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#176b4d] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f5139] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon
                    name="plus"
                    size={17}
                  />

                  {saving
                    ? "Creating..."
                    : "Create Patient"}
                </button>

              </div>
            </div>
          </div>
        )}


        {editingPatient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271d]/55 p-4 backdrop-blur-sm">

            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.8rem] border border-[#dfe7e0] bg-white shadow-[0_30px_90px_rgba(18,48,35,0.25)]">


              <div className="flex items-start justify-between border-b border-[#e7ece7] bg-[#fbfcfa] px-6 py-5">

                <div>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f0e6] text-[#347151]">
                    <Icon
                      name="edit"
                      size={18}
                    />
                  </div>

                  <h2 className="text-xl font-bold text-[#20372c]">
                    Edit Patient
                  </h2>

                  <p className="mt-1 text-sm text-[#7b887f]">
                    Update Patient #
                    {
                      editingPatient.patient_id
                    }
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingPatient(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#819087] hover:bg-[#edf2ed]"
                >
                  <Icon
                    name="close"
                    size={19}
                  />
                </button>
              </div>


              <div className="overflow-y-auto px-6 py-6">


                <div className="mb-5 rounded-2xl border border-[#dfe9e2] bg-[#f3f9f4] p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#779080]">
                        Linked User ID
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#176b4d]">
                        {editingPatient.user_id ??
                          "Not linked"}
                      </p>
                    </div>

                    <Icon
                      name="user"
                      size={24}
                    />

                  </div>

                </div>

                <div className="grid gap-5 md:grid-cols-2">


                  <FormField
                    label="Age"
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={
                      editingPatient.age
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        age: Number(value),
                      })
                    }
                    placeholder="Enter age"
                  />


                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">
                      Gender{" "}
                      <span className="text-[#4f9870]">
                        *
                      </span>
                    </label>

                    <select
                      value={
                        editingPatient.gender
                      }
                      onChange={(event) =>
                        setEditingPatient({
                          ...editingPatient,
                          gender:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none focus:border-[#76a78a] focus:bg-white focus:ring-4 focus:ring-[#dceee2]"
                    >
                      <option value="">
                        Select gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>
                    </select>
                  </div>


                  <FormField
                    label="BMI"
                    type="number"
                    required
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={
                      editingPatient.bmi
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        bmi: Number(value),
                      })
                    }
                    placeholder="Enter BMI"
                  />


                  <FormField
                    label="Smoking Status"
                    value={
                      editingPatient.smoking_status ??
                      ""
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        smoking_status:
                          value,
                      })
                    }
                    placeholder="e.g. Never"
                  />


                  <FormField
                    label="Alcohol Consumption"
                    value={
                      editingPatient.alcohol_consumption ??
                      ""
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        alcohol_consumption:
                          value,
                      })
                    }
                    placeholder="e.g. None"
                  />


                  <FormField
                    label="Exercise Level"
                    value={
                      editingPatient.exercise_level ??
                      ""
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        exercise_level:
                          value,
                      })
                    }
                    placeholder="e.g. Active"
                  />


                  <FormField
                    label="Diet Type"
                    value={
                      editingPatient.diet_type ??
                      ""
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        diet_type:
                          value,
                      })
                    }
                    placeholder="e.g. Vegetarian"
                  />


                  <FormField
                    label="Sun Exposure"
                    value={
                      editingPatient.sun_exposure ??
                      ""
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        sun_exposure:
                          value,
                      })
                    }
                    placeholder="e.g. Moderate"
                  />


                  <FormField
                    label="Income Level"
                    value={
                      editingPatient.income_level ??
                      ""
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        income_level:
                          value,
                      })
                    }
                    placeholder="e.g. Medium"
                  />


                  <FormField
                    label="Latitude Region"
                    value={
                      editingPatient.latitude_region ??
                      ""
                    }
                    onChange={(value) =>
                      setEditingPatient({
                        ...editingPatient,
                        latitude_region:
                          value,
                      })
                    }
                    placeholder="e.g. Tropical"
                  />

                </div>
              </div>


              <div className="flex justify-end gap-3 border-t border-[#e7ece7] bg-[#fbfcfa] px-6 py-4">

                <button
                  onClick={() =>
                    setEditingPatient(null)
                  }
                  className="rounded-xl border border-[#d9e2db] bg-white px-5 py-2.5 text-sm font-bold text-[#596960] hover:bg-[#f2f5f2]"
                >
                  Cancel
                </button>

                <button
                  onClick={updatePatient}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#176b4d] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f5139] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon
                    name="edit"
                    size={16}
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            </div>
          </div>
        )}

      </main>
    </AuthGuard>
  );
}
