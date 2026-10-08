"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";
import PatientHeader from "../../components/PatientHeader";
import BackToDashboard from "../../components/BackToDashboard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Patient {
  patient_id: number;
  user_id?: number | null;
  age: number;
  gender: string;
  bmi: number;
}

interface Clinician {
  clinician_id: number;
  name: string;
  specialization: string;
  department?: string;
  availability_status?: string;
}

interface Appointment {
  appointment_id: number;
  patient_id: number;
  clinician_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_type?: string;
  reason?: string;
  appointment_status?: string;
}

interface AppointmentReminder {
  appointment_id: number;
  reminder_minutes: number;
  reminder_at: string;
  notified?: boolean;
}

const REMINDER_STORAGE_KEY =
  "healthassist_appointment_reminders";

export default function AppointmentsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [clinicians, setClinicians] =
    useState<Clinician[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingClinicians, setLoadingClinicians] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [cancellingId, setCancellingId] =
    useState<number | null>(null);

  const [reminders, setReminders] =
    useState<AppointmentReminder[]>(() => {
      if (typeof window === "undefined") return [];
      try {
        return JSON.parse(
          localStorage.getItem(REMINDER_STORAGE_KEY) || "[]"
        );
      } catch {
        return [];
      }
    });

  const [reminderModalId, setReminderModalId] =
    useState<number | null>(null);

  const [selectedReminderMinutes, setSelectedReminderMinutes] =
    useState(30);

  const [formData, setFormData] = useState({
    clinician_id: "",
    appointment_date: "",
    appointment_time: "",
    appointment_type: "Consultation",
    reason: "",
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getCurrentTime() {
    const now = new Date();

    const hours = String(
      now.getHours()
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function getMinimumTime() {
    if (
      formData.appointment_date ===
      getTodayDate()
    ) {
      return getCurrentTime();
    }

    return "00:00";
  }

  function isClinicianAlreadyBooked() {
    if (
      !formData.clinician_id ||
      !formData.appointment_date ||
      !formData.appointment_time
    ) {
      return false;
    }

    const selectedClinicianId =
      Number(formData.clinician_id);

    return appointments.some(
      (appointment) => {
        const existingTime =
          appointment.appointment_time.substring(
            0,
            5
          );

        return (
          appointment.clinician_id ===
            selectedClinicianId &&
          appointment.appointment_date ===
            formData.appointment_date &&
          existingTime ===
            formData.appointment_time &&
          appointment.appointment_status !==
            "Cancelled"
        );
      }
    );
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) {
    const {
      name,
      value,
    } = event.target;

    if (name === "appointment_date") {
      setFormData({
        ...formData,
        appointment_date: value,
        appointment_time: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setError("");
    setMessage("");
  }

  async function loadPatient() {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/patients/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");

        router.push("/login");
        return null;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load patient profile"
        );
      }

      const data =
        await response.json();

      setPatient(data);

      return data as Patient;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load patient profile"
      );

      return null;
    }
  }

  async function loadClinicians() {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoadingClinicians(true);

      const response = await fetch(
        `${API_URL}/clinicians/available`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");

        router.push("/login");
        return;
      }

      if (!response.ok) {
        const data =
          await response.json();

        throw new Error(
          data.detail ||
            "Unable to load clinicians"
        );
      }

      const data =
        await response.json();

      setClinicians(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load clinicians"
      );
    } finally {
      setLoadingClinicians(false);
    }
  }

  async function loadAppointments(
    patientId?: number
  ) {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/appointments/`,
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

        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load appointments"
        );
      }

      const data: Appointment[] =
        await response.json();

      if (patientId !== undefined) {
        setAppointments(
          data.filter(
            (appointment) =>
              appointment.patient_id ===
              patientId
          )
        );
      } else {
        setAppointments(data);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load appointments"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initializePage() {
      const currentPatient =
        await loadPatient();

      if (currentPatient) {
        await Promise.all([
          loadAppointments(
            currentPatient.patient_id
          ),
          loadClinicians(),
        ]);
      }
    }

    initializePage();
  }, []);

  function validateAppointmentDate() {
    if (!formData.appointment_date) {
      setError(
        "Please select an appointment date."
      );

      return false;
    }

    if (
      formData.appointment_date <
      getTodayDate()
    ) {
      setError(
        "Appointment date cannot be in the past."
      );

      return false;
    }

    return true;
  }

  function validateAppointmentTime() {
    if (!formData.appointment_time) {
      setError(
        "Please select an appointment time."
      );

      return false;
    }

    if (
      formData.appointment_date ===
      getTodayDate()
    ) {
      if (
        formData.appointment_time <=
        getCurrentTime()
      ) {
        setError(
          "Please select a future time for today's appointment."
        );

        return false;
      }
    }

    return true;
  }

  async function createAppointment(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!patient) {
      setError(
        "Patient information could not be loaded."
      );

      return;
    }

    if (!formData.clinician_id) {
      setError(
        "Please select a clinician."
      );

      return;
    }

    if (!validateAppointmentDate()) {
      return;
    }

    if (!validateAppointmentTime()) {
      return;
    }

    if (isClinicianAlreadyBooked()) {
      setError(
        "This clinician already has an appointment at the selected date and time. Please choose another time."
      );

      return;
    }

    if (!formData.reason.trim()) {
      setError(
        "Please enter the reason for the appointment."
      );

      return;
    }

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/appointments/`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient_id:
              patient.patient_id,

            clinician_id:
              Number(
                formData.clinician_id
              ),

            appointment_date:
              formData.appointment_date,

            appointment_time:
              formData.appointment_time,

            appointment_type:
              formData.appointment_type,

            reason:
              formData.reason.trim(),

            appointment_status:
              "Scheduled",
          }),
        }
      );

      const data =
        await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_role"
        );

        localStorage.removeItem(
          "user_id"
        );

        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to create appointment"
        );
      }

      setMessage(
        `Appointment #${data.appointment_id} created successfully.`
      );

      setFormData({
        clinician_id: "",
        appointment_date: "",
        appointment_time: "",
        appointment_type:
          "Consultation",
        reason: "",
      });

      setShowForm(false);

      await loadAppointments(
        patient.patient_id
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create appointment"
      );
    } finally {
      setSaving(false);
    }
  }

  async function cancelAppointment(
    appointmentId: number
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setCancellingId(appointmentId);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_role"
        );

        localStorage.removeItem(
          "user_id"
        );

        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to cancel appointment"
        );
      }

      setMessage(
        `Appointment #${appointmentId} has been cancelled successfully.`
      );

      removeAppointmentReminder(
        appointmentId
      );

      if (patient) {
        await loadAppointments(
          patient.patient_id
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel appointment"
      );
    } finally {
      setCancellingId(null);
    }
  }

  useEffect(() => {
    const checkReminders = () => {
      try {
        const stored =
          localStorage.getItem(
            REMINDER_STORAGE_KEY
          );

        if (!stored) {
          return;
        }

        const currentReminders:
          AppointmentReminder[] =
          JSON.parse(stored);

        const now = Date.now();

        let changed = false;

        const updatedReminders =
          currentReminders.map(
            (reminder) => {
              if (
                !reminder.notified &&
                new Date(
                  reminder.reminder_at
                ).getTime() <= now
              ) {
                changed = true;

                if (
                  "Notification" in window &&
                  Notification.permission ===
                    "granted"
                ) {
                  new Notification(
                    "HealthAssist Appointment Reminder",
                    {
                      body: `Your appointment #${reminder.appointment_id} is coming up.`,
                    }
                  );
                }

                return {
                  ...reminder,
                  notified: true,
                };
              }

              return reminder;
            }
          );

        if (changed) {
          localStorage.setItem(
            REMINDER_STORAGE_KEY,
            JSON.stringify(
              updatedReminders
            )
          );

          setReminders(
            updatedReminders
          );
        }
      } catch {
        // Ignore invalid reminder data.
      }
    };

    checkReminders();

    const interval =
      window.setInterval(
        checkReminders,
        30 * 1000
      );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  function getReminderLabel(
    minutes: number
  ) {
    if (minutes === 1440) {
      return "1 day before";
    }

    if (minutes === 60) {
      return "1 hour before";
    }

    return `${minutes} minutes before`;
  }

  function getReminderForAppointment(
    appointmentId: number
  ) {
    return reminders.find(
      (reminder) =>
        reminder.appointment_id ===
        appointmentId
    );
  }

  async function saveAppointmentReminder(
    appointment: Appointment
  ) {
    const appointmentDateTime =
      new Date(
        `${appointment.appointment_date}T${appointment.appointment_time.substring(
          0,
          8
        )}`
      );

    if (
      Number.isNaN(
        appointmentDateTime.getTime()
      )
    ) {
      setError(
        "Unable to calculate the appointment reminder time."
      );

      return;
    }

    const reminderAt =
      new Date(
        appointmentDateTime.getTime() -
          selectedReminderMinutes *
            60 *
            1000
      );

    if (
      reminderAt.getTime() <=
      Date.now()
    ) {
      setError(
        "This reminder time has already passed. Please choose a shorter reminder period."
      );

      return;
    }

    if (
      "Notification" in window &&
      Notification.permission ===
        "default"
    ) {
      try {
        await Notification.requestPermission();
      } catch {
        // Browser may block permission requests.
      }
    }

    const newReminder:
      AppointmentReminder = {
        appointment_id:
          appointment.appointment_id,

        reminder_minutes:
          selectedReminderMinutes,

        reminder_at:
          reminderAt.toISOString(),

        notified: false,
      };

    const updatedReminders = [
      ...reminders.filter(
        (reminder) =>
          reminder.appointment_id !==
          appointment.appointment_id
      ),

      newReminder,
    ];

    localStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify(
        updatedReminders
      )
    );

    setReminders(
      updatedReminders
    );

    setReminderModalId(null);

    setMessage(
      `Reminder set for appointment #${appointment.appointment_id}: ${getReminderLabel(
        selectedReminderMinutes
      )}.`
    );

    setError("");
  }

  function removeAppointmentReminder(
    appointmentId: number
  ) {
    const updatedReminders =
      reminders.filter(
        (reminder) =>
          reminder.appointment_id !==
          appointmentId
      );

    localStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify(
        updatedReminders
      )
    );

    setReminders(
      updatedReminders
    );
  }

  function getClinician(
    clinicianId: number
  ) {
    return clinicians.find(
      (clinician) =>
        clinician.clinician_id ===
        clinicianId
    );
  }

  return (
    <AuthGuard allowedRoles={["patient"]}>
      <main className="min-h-screen bg-[#f4f7ef] text-[#17221c]">


        <PatientHeader />


        <section className="relative overflow-hidden">

          <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#dcebd5] opacity-50 blur-3xl" />

          <div className="pointer-events-none absolute -right-40 top-[30%] h-[450px] w-[450px] rounded-full bg-[#e7efd9] opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 lg:pb-12 lg:pt-14">


            <BackToDashboard />


            <div className="animate-fade-up">

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d3e1cd] bg-[#f9fbf7] px-4 py-2">

                    <span className="h-2 w-2 rounded-full bg-[#72a846] animate-gentle-pulse" />

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#628c42]">
                      Appointments
                    </span>

                  </div>

                  <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-[#14251d] sm:text-5xl">

                    Appointment

                    <span className="text-[#72a846]">
                      {" "}Management
                    </span>

                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#68756d]">
                    Schedule healthcare appointments,
                    view upcoming visits and manage
                    your appointment history.
                  </p>

                </div>

                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setMessage("");
                    setError("");

                    if (!showForm) {
                      loadClinicians();
                    }
                  }}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#176b4d] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#176b4d]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f5139] hover:shadow-xl"
                >

                  <span className="text-lg leading-none">
                    {showForm ? "×" : "+"}
                  </span>

                  {showForm
                    ? "Close Form"
                    : "New Appointment"}

                </button>

              </div>

            </div>


            {patient && (
              <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#d7e4d2] bg-[#edf5e8] p-5 sm:flex-row sm:items-center">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#176b4d] shadow-sm">

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

                </div>

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#71954f]">
                    Booking appointment for
                  </p>

                  <p className="mt-1 font-extrabold text-[#304239]">

                    Patient #{patient.patient_id}

                    <span className="font-medium text-[#738078]">
                      {" "}•{" "}
                      {patient.gender}
                      {" "}• Age {patient.age}
                    </span>

                  </p>

                </div>

              </div>
            )}


            {message && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#cfe2d1] bg-[#eff8f0] p-5 text-[#3e7246] animate-fade-in">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#4f8a6b] shadow-sm">
                  ✓
                </div>

                <div>

                  <p className="font-extrabold">
                    Success
                  </p>

                  <p className="mt-1 text-sm">
                    {message}
                  </p>

                </div>

              </div>
            )}

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#f0cccc] bg-[#fff6f6] p-5 text-[#b64242] animate-fade-in">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fee4e4] font-bold">
                  !
                </div>

                <div>

                  <p className="font-extrabold">
                    Unable to process appointment
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>

                </div>

              </div>
            )}


            {showForm && (
              <div className="mt-8 health-card p-6 sm:p-8 animate-scale-in">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f0df] text-[#6a963f]">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-6 w-6"
                    >

                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                      />

                      <path
                        strokeLinecap="round"
                        d="M16 3v4M8 3v4M3 10h18"
                      />

                      <path
                        strokeLinecap="round"
                        d="M8 15h4"
                      />

                    </svg>

                  </div>

                  <div>

                    <h2 className="text-xl font-black text-[#24372d]">
                      Create New Appointment
                    </h2>

                    <p className="mt-1 text-sm text-[#7b8780]">
                      Choose a clinician, date and
                      time for your visit.
                    </p>

                  </div>

                </div>

                <form
                  onSubmit={createAppointment}
                  className="mt-8 grid gap-6 md:grid-cols-2"
                >


                  <div>

                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
                      Patient
                    </label>

                    <div className="rounded-xl border border-[#dfe7dc] bg-[#f7f9f5] px-4 py-3.5 text-sm font-bold text-[#53645a]">

                      Patient #{patient?.patient_id}

                      {patient &&
                        ` — ${patient.gender}, Age ${patient.age}`}

                    </div>

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
                      Clinician
                    </label>

                    <select
                      name="clinician_id"
                      value={
                        formData.clinician_id
                      }
                      onChange={
                        handleChange
                      }
                      required
                      disabled={
                        loadingClinicians
                      }
                      className="w-full rounded-xl border border-[#d2dfce] bg-white px-4 py-3.5 text-sm font-medium text-[#304239] outline-none transition-all focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
                    >

                      <option value="">
                        {loadingClinicians
                          ? "Loading clinicians..."
                          : "Select a clinician"}
                      </option>

                      {clinicians.map(
                        (clinician) => (
                          <option
                            key={
                              clinician.clinician_id
                            }
                            value={
                              clinician.clinician_id
                            }
                          >
                            {clinician.name}
                            {" — "}
                            {
                              clinician.specialization
                            }
                          </option>
                        )
                      )}

                    </select>

                    {formData.clinician_id && (
                      <div className="mt-3 rounded-2xl border border-[#d7e5d2] bg-[#edf5e8] p-4 text-sm text-[#53645a]">

                        {(() => {
                          const clinician =
                            getClinician(
                              Number(
                                formData.clinician_id
                              )
                            );

                          if (!clinician) {
                            return null;
                          }

                          return (
                            <div className="space-y-1.5">

                              <p>
                                <span className="font-extrabold text-[#304239]">
                                  Doctor:
                                </span>{" "}
                                {clinician.name}
                              </p>

                              <p>
                                <span className="font-extrabold text-[#304239]">
                                  Specialization:
                                </span>{" "}
                                {
                                  clinician.specialization
                                }
                              </p>

                              {clinician.department && (
                                <p>
                                  <span className="font-extrabold text-[#304239]">
                                    Department:
                                  </span>{" "}
                                  {
                                    clinician.department
                                  }
                                </p>
                              )}

                              <p>
                                <span className="font-extrabold text-[#304239]">
                                  Availability:
                                </span>{" "}
                                {
                                  clinician.availability_status ||
                                  "Available"
                                }
                              </p>

                            </div>
                          );
                        })()}

                      </div>
                    )}

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
                      Appointment Date
                    </label>

                    <input
                      type="date"
                      name="appointment_date"
                      value={
                        formData.appointment_date
                      }
                      onChange={
                        handleChange
                      }
                      min={getTodayDate()}
                      required
                      className="w-full rounded-xl border border-[#d2dfce] bg-white px-4 py-3.5 text-sm font-medium text-[#304239] outline-none transition-all focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
                    />

                    <p className="mt-2 text-xs text-[#8a958e]">
                      You can select today or a
                      future date.
                    </p>

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
                      Appointment Time
                    </label>

                    <input
                      type="time"
                      name="appointment_time"
                      value={
                        formData.appointment_time
                      }
                      onChange={
                        handleChange
                      }
                      min={getMinimumTime()}
                      required
                      className="w-full rounded-xl border border-[#d2dfce] bg-white px-4 py-3.5 text-sm font-medium text-[#304239] outline-none transition-all focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
                    />

                    <p className="mt-2 text-xs text-[#8a958e]">

                      {formData.appointment_date ===
                      getTodayDate()
                        ? "For today, select a future time."
                        : "Select a suitable appointment time."}

                    </p>

                    {isClinicianAlreadyBooked() && (
                      <p className="mt-2 rounded-xl bg-[#fff1f1] px-3 py-2 text-xs font-bold text-[#c94c4c]">
                        ⚠ This clinician already has
                        an appointment at this date
                        and time.
                      </p>
                    )}

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
                      Appointment Type
                    </label>

                    <select
                      name="appointment_type"
                      value={
                        formData.appointment_type
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-xl border border-[#d2dfce] bg-white px-4 py-3.5 text-sm font-medium text-[#304239] outline-none transition-all focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
                    >

                      <option value="Consultation">
                        Consultation
                      </option>

                      <option value="Follow-up">
                        Follow-up
                      </option>

                      <option value="General Checkup">
                        General Checkup
                      </option>

                      <option value="Specialist Consultation">
                        Specialist Consultation
                      </option>

                    </select>

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
                      Appointment Status
                    </label>

                    <div className="flex items-center gap-2 rounded-xl border border-[#dfe7dc] bg-[#f7f9f5] px-4 py-3.5">

                      <span className="h-2 w-2 rounded-full bg-[#72a846]" />

                      <span className="text-sm font-bold text-[#53645a]">
                        Scheduled
                      </span>

                    </div>

                  </div>


                  <div className="md:col-span-2">

                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#738078]">
                      Reason for Appointment
                    </label>

                    <textarea
                      name="reason"
                      value={
                        formData.reason
                      }
                      onChange={
                        handleChange
                      }
                      required
                      rows={4}
                      placeholder="Briefly describe the reason for your appointment..."
                      className="w-full resize-none rounded-xl border border-[#d2dfce] bg-white px-4 py-3.5 text-sm font-medium text-[#304239] outline-none transition-all placeholder:text-[#9ca8a0] focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
                    />

                  </div>


                  <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row">

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setError("");
                        setMessage("");
                      }}
                      disabled={saving}
                      className="rounded-xl border border-[#d2ddd0] bg-white px-6 py-3.5 text-sm font-extrabold text-[#5d6962] transition-all hover:bg-[#f8faf6] disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        saving ||
                        isClinicianAlreadyBooked()
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#176b4d] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#176b4d]/15 transition-all hover:-translate-y-0.5 hover:bg-[#0f5139] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {saving ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Creating...
                        </>
                      ) : (
                        <>
                          Create Appointment
                          <span>
                            →
                          </span>
                        </>
                      )}

                    </button>

                  </div>

                </form>

              </div>
            )}


            <div className="mt-8 health-card p-6 sm:p-8">

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f0df] text-[#6a963f]">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-6 w-6"
                    >

                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                      />

                      <path
                        strokeLinecap="round"
                        d="M16 3v4M8 3v4M3 10h18"
                      />

                    </svg>

                  </div>

                  <div>

                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#71954f]">
                      Your healthcare visits
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-tight text-[#24372d]">
                      Appointment History
                    </h2>

                    <p className="mt-1 text-sm text-[#7b8780]">
                      View your scheduled and previous
                      appointments.
                    </p>

                  </div>

                </div>

                <div className="flex h-10 items-center rounded-full bg-[#edf5e8] px-4 text-xs font-extrabold text-[#628c42]">

                  {appointments.length}{" "}

                  {appointments.length === 1
                    ? "Appointment"
                    : "Appointments"}

                </div>

              </div>


              {loading ? (

                <div className="mt-7 flex min-h-[180px] items-center justify-center rounded-2xl bg-[#f7f9f5]">

                  <div className="text-center">

                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#dce8d8] border-t-[#176b4d]" />

                    <p className="mt-4 text-sm font-semibold text-[#7b8780]">
                      Loading appointments...
                    </p>

                  </div>

                </div>

              ) : appointments.length === 0 ? (

                <div className="mt-7 rounded-2xl border border-dashed border-[#ccd9c8] bg-[#f8faf6] p-10 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6a963f] shadow-sm">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-7 w-7"
                    >

                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                      />

                      <path
                        strokeLinecap="round"
                        d="M16 3v4M8 3v4M3 10h18"
                      />

                    </svg>

                  </div>

                  <h3 className="mt-5 text-lg font-black text-[#304239]">
                    No appointments yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7b8780]">
                    You currently have no
                    appointments. Create a new
                    appointment to schedule your
                    next healthcare visit.
                  </p>

                  <button
                    onClick={() => {
                      setShowForm(true);
                      setMessage("");
                      setError("");
                      loadClinicians();
                    }}
                    className="mt-5 rounded-xl bg-[#176b4d] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#0f5139]"
                  >
                    + New Appointment
                  </button>

                </div>

              ) : (

                <div className="mt-7 space-y-5">

                  {appointments.map(
                    (appointment) => {

                      const clinician =
                        getClinician(
                          appointment.clinician_id
                        );

                      const isScheduled =
                        appointment.appointment_status ===
                        "Scheduled";

                      const isCancelled =
                        appointment.appointment_status ===
                        "Cancelled";

                      const reminder =
                        getReminderForAppointment(
                          appointment.appointment_id
                        );

                      return (
                        <div
                          key={
                            appointment.appointment_id
                          }
                          className="group rounded-2xl border border-[#e0e8dd] bg-[#fbfcf9] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d0dfca] hover:bg-white hover:shadow-md sm:p-6"
                        >


                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f0df] text-[#6a963f]">

                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  className="h-6 w-6"
                                >

                                  <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="16"
                                    rx="2"
                                  />

                                  <path
                                    strokeLinecap="round"
                                    d="M16 3v4M8 3v4M3 10h18"
                                  />

                                </svg>

                              </div>

                              <div>

                                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8a958e]">
                                  Appointment
                                </p>

                                <h3 className="mt-0.5 text-xl font-black text-[#304239]">
                                  #{appointment.appointment_id}
                                </h3>

                              </div>

                            </div>

                            <span
                              className={
                                isCancelled
                                  ? "w-fit rounded-full bg-[#f0f2ef] px-4 py-2 text-xs font-extrabold text-[#68756d]"
                                  : "flex w-fit items-center gap-2 rounded-full bg-[#e5f0df] px-4 py-2 text-xs font-extrabold text-[#55783d]"
                              }
                            >

                              {!isCancelled && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#72a846]" />
                              )}

                              {appointment.appointment_status ||
                                "Scheduled"}

                            </span>

                          </div>


                          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <AppointmentInfo
                              label="Clinician"
                              value={
                                clinician
                                  ? clinician.name
                                  : `Clinician #${appointment.clinician_id}`
                              }
                            />

                            <AppointmentInfo
                              label="Specialization"
                              value={
                                clinician?.specialization ||
                                "Not available"
                              }
                            />

                            <AppointmentInfo
                              label="Date"
                              value={
                                appointment.appointment_date
                              }
                            />

                            <AppointmentInfo
                              label="Time"
                              value={
                                appointment.appointment_time
                              }
                            />

                            <AppointmentInfo
                              label="Appointment Type"
                              value={
                                appointment.appointment_type ||
                                "Not provided"
                              }
                            />

                            <AppointmentInfo
                              label="Reason"
                              value={
                                appointment.reason ||
                                "Not provided"
                              }
                            />

                          </div>


                          {!isCancelled && (
                            <div className="mt-6 border-t border-[#e4ebe1] pt-5">

                              <div className="rounded-2xl border border-[#d9e7d3] bg-[#f6faf2] p-4">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                  <div className="flex items-start gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6a963f] shadow-sm">

                                      <span className="text-lg">
                                        🔔
                                      </span>

                                    </div>

                                    <div>

                                      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#71954f]">
                                        Appointment Reminder
                                      </p>

                                      {reminder ? (

                                        <p className="mt-1 text-sm font-bold text-[#405047]">
                                          Reminder set for{" "}
                                          {getReminderLabel(
                                            reminder.reminder_minutes
                                          )}
                                        </p>

                                      ) : (

                                        <p className="mt-1 text-sm text-[#748078]">
                                          Get a browser notification
                                          before your appointment.
                                        </p>

                                      )}

                                    </div>

                                  </div>

                                  <div className="flex flex-wrap gap-2">

                                    <button
                                      type="button"
                                      onClick={() => {

                                        setSelectedReminderMinutes(
                                          reminder?.reminder_minutes ??
                                            30
                                        );

                                        setReminderModalId(
                                          appointment.appointment_id
                                        );

                                        setError("");
                                        setMessage("");
                                      }}
                                      className="rounded-xl bg-[#176b4d] px-4 py-2.5 text-xs font-extrabold text-white transition-all hover:bg-[#0f5139]"
                                    >
                                      {reminder
                                        ? "Change Reminder"
                                        : "Set Reminder"}
                                    </button>

                                    {reminder && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeAppointmentReminder(
                                            appointment.appointment_id
                                          )
                                        }
                                        className="rounded-xl border border-[#d9e2db] bg-white px-4 py-2.5 text-xs font-extrabold text-[#65736b] transition-all hover:bg-[#f2f5f1]"
                                      >
                                        Remove
                                      </button>
                                    )}

                                  </div>

                                </div>

                              </div>

                            </div>
                          )}


                          {isScheduled && (
                            <div className="mt-6 flex justify-end border-t border-[#e4ebe1] pt-5">

                              <button
                                type="button"
                                onClick={() =>
                                  cancelAppointment(
                                    appointment.appointment_id
                                  )
                                }
                                disabled={
                                  cancellingId ===
                                  appointment.appointment_id
                                }
                                className="flex items-center gap-2 rounded-xl border border-[#efcccc] bg-white px-5 py-2.5 text-sm font-extrabold text-[#c94c4c] transition-all duration-300 hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                {cancellingId ===
                                appointment.appointment_id ? (
                                  <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#f0cccc] border-t-[#c94c4c]" />
                                    Cancelling...
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
                                        d="M6 7h12M10 11v6M14 11v6M8 7l1 13h6l1-13M9 7l1-3h4l1 3"
                                      />

                                    </svg>

                                    Cancel Appointment
                                  </>
                                )}

                              </button>

                            </div>
                          )}


                          {isCancelled && (
                            <div className="mt-6 rounded-xl bg-[#f4f6f2] p-4">

                              <p className="text-sm font-medium text-[#78837c]">
                                This appointment has been cancelled.
                              </p>

                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>


            {reminderModalId !== null && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271d]/55 p-4 backdrop-blur-sm">

                <div className="w-full max-w-md rounded-[1.5rem] border border-[#dfe7e0] bg-white p-6 shadow-[0_30px_90px_rgba(18,48,35,0.25)]">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f0df] text-[#6a963f]">

                        <span className="text-xl">
                          🔔
                        </span>

                      </div>

                      <h2 className="mt-4 text-xl font-black text-[#24372d]">
                        Appointment Reminder
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-[#7b8780]">
                        Choose when you want to be
                        reminded about this appointment.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setReminderModalId(null)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-[#819087] hover:bg-[#edf2ed] hover:text-[#31493c]"
                      aria-label="Close reminder dialog"
                    >
                      ×
                    </button>

                  </div>

                  <div className="mt-6 space-y-3">

                    {[10, 30, 60, 1440].map(
                      (minutes) => (

                        <label
                          key={minutes}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                            selectedReminderMinutes ===
                            minutes
                              ? "border-[#72a846] bg-[#f1f8ed]"
                              : "border-[#dfe7dc] bg-white hover:bg-[#f8faf6]"
                          }`}
                        >

                          <span className="text-sm font-bold text-[#405047]">
                            {getReminderLabel(
                              minutes
                            )}
                          </span>

                          <input
                            type="radio"
                            name="appointment-reminder"
                            value={minutes}
                            checked={
                              selectedReminderMinutes ===
                              minutes
                            }
                            onChange={() =>
                              setSelectedReminderMinutes(
                                minutes
                              )
                            }
                            className="h-4 w-4 accent-[#176b4d]"
                          />

                        </label>

                      )
                    )}

                  </div>

                  <div className="mt-6 rounded-xl bg-[#f7f9f5] p-3 text-xs leading-5 text-[#748078]">
                    Browser notifications must be
                    allowed for the reminder notification
                    to appear.
                  </div>

                  <div className="mt-6 flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setReminderModalId(null)
                      }
                      className="rounded-xl border border-[#d2ddd0] bg-white px-5 py-2.5 text-sm font-extrabold text-[#5d6962] hover:bg-[#f8faf6]"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => {

                        const selectedAppointment =
                          appointments.find(
                            (item) =>
                              item.appointment_id ===
                              reminderModalId
                          );

                        if (
                          selectedAppointment
                        ) {
                          saveAppointmentReminder(
                            selectedAppointment
                          );
                        }

                      }}
                      className="rounded-xl bg-[#176b4d] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-[#176b4d]/15 hover:bg-[#0f5139]"
                    >
                      Save Reminder
                    </button>

                  </div>

                </div>

              </div>
            )}


            <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#dfe7dc] pt-6 text-center sm:flex-row sm:text-left">

              <p className="text-xs text-[#8a958e]">
                HealthAssist • Appointment Management
              </p>

              <p className="text-xs text-[#8a958e]">
                Schedule and manage your healthcare
                visits securely.
              </p>

            </div>

          </div>

        </section>

      </main>
    </AuthGuard>
  );
}

function AppointmentInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#e5ebe2] bg-white p-4">

      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8a958e]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-extrabold text-[#405047]">
        {value}
      </p>

    </div>
  );
}
