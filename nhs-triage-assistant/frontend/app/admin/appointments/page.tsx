"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthGuard from "../../../components/AuthGuard";
import AdminHeader from "../../../components/AdminHeader";
import Icon from "../../../components/Icon";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

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
  email?: string;
  phone?: string;
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

interface AppointmentForm {
  patient_id: string;
  clinician_id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  reason: string;
  appointment_status: string;
}

const emptyForm: AppointmentForm = {
  patient_id: "",
  clinician_id: "",
  appointment_date: "",
  appointment_time: "",
  appointment_type: "Consultation",
  reason: "",
  appointment_status: "Scheduled",
};

export default function AdminAppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [clinicians, setClinicians] =
    useState<Clinician[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [formData, setFormData] =
    useState<AppointmentForm>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [completingId, setCompletingId] =
    useState<number | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  function getToken() {
    return localStorage.getItem(
      "access_token"
    );
  }

  function handleUnauthorized() {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user_role"
    );

    localStorage.removeItem(
      "user_id"
    );

    router.replace("/login");
  }

  async function loadAppointments() {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/appointments/admin`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to load appointments"
        );
      }

      setAppointments(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load appointments"
      );
    }
  }

  async function loadPatients() {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/patients/`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to load patients"
        );
      }

      setPatients(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load patients"
      );
    }
  }

  async function loadClinicians() {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/clinicians/`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to load clinicians"
        );
      }

      setClinicians(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load clinicians"
      );
    }
  }

  useEffect(() => {
    async function initializePage() {
      setLoading(true);

      await Promise.all([
        loadAppointments(),
        loadPatients(),
        loadClinicians(),
      ]);

      setLoading(false);
    }

    initializePage();
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  }

  function openCreateForm() {
    setEditingAppointment(null);
    setFormData(emptyForm);

    setMessage("");
    setError("");

    setShowForm(true);
  }

  function openEditForm(
    appointment: Appointment
  ) {
    setEditingAppointment(
      appointment
    );

    setFormData({
      patient_id:
        String(
          appointment.patient_id
        ),

      clinician_id:
        String(
          appointment.clinician_id
        ),

      appointment_date:
        appointment.appointment_date,

      appointment_time:
        appointment.appointment_time,

      appointment_type:
        appointment.appointment_type ||
        "Consultation",

      reason:
        appointment.reason ||
        "",

      appointment_status:
        appointment.appointment_status ||
        "Scheduled",
    });

    setMessage("");
    setError("");

    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingAppointment(null);
    setFormData(emptyForm);
  }

  function validateForm() {

    if (!formData.patient_id) {
      setError(
        "Please select a patient."
      );

      return false;
    }

    if (!formData.clinician_id) {
      setError(
        "Please select a clinician."
      );

      return false;
    }

    if (!formData.appointment_date) {
      setError(
        "Please select an appointment date."
      );

      return false;
    }

    if (!formData.appointment_time) {
      setError(
        "Please select an appointment time."
      );

      return false;
    }

    if (
      !formData.appointment_type.trim()
    ) {
      setError(
        "Please select an appointment type."
      );

      return false;
    }

    return true;
  }

  async function createAppointment(
    event: FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!validateForm()) {
      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/appointments/`,
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
              Number(
                formData.patient_id
              ),

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
              formData.reason,

            appointment_status:
              formData.appointment_status,
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to create appointment"
        );
      }

      setMessage(
        `Appointment #${data.appointment_id} created successfully.`
      );

      setShowForm(false);
      setFormData(emptyForm);

      await loadAppointments();

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

  async function updateAppointment(
    event: FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!editingAppointment) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/appointments/${editingAppointment.appointment_id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            patient_id:
              Number(
                formData.patient_id
              ),

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
              formData.reason,

            appointment_status:
              formData.appointment_status,
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to update appointment"
        );
      }

      setMessage(
        `Appointment #${editingAppointment.appointment_id} updated successfully.`
      );

      setShowForm(false);
      setEditingAppointment(null);
      setFormData(emptyForm);

      await loadAppointments();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update appointment"
      );

    } finally {

      setSaving(false);
    }
  }

  async function completeAppointment(
    appointmentId: number
  ) {
    const confirmed =
      window.confirm(
        `Mark appointment #${appointmentId} as completed?`
      );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setCompletingId(
      appointmentId
    );

    setMessage("");
    setError("");

    try {

      const response =
        await fetch(
          `${API_URL}/appointments/${appointmentId}/complete`,
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to mark appointment as completed"
        );
      }

      setMessage(
        `Appointment #${appointmentId} marked as completed successfully.`
      );

      await loadAppointments();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark appointment as completed"
      );

    } finally {

      setCompletingId(null);
    }
  }

  async function deleteAppointment(
    appointmentId: number
  ) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete appointment #${appointmentId}?`
      );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setDeletingId(
      appointmentId
    );

    setMessage("");
    setError("");

    try {

      const response =
        await fetch(
          `${API_URL}/appointments/${appointmentId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to delete appointment"
        );
      }

      setMessage(
        `Appointment #${appointmentId} deleted successfully.`
      );

      await loadAppointments();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete appointment"
      );

    } finally {

      setDeletingId(null);
    }
  }

  function getPatient(
    patientId: number
  ) {
    return patients.find(
      (patient) =>
        patient.patient_id ===
        patientId
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

  function getPatientName(
    patientId: number
  ) {
    const patient =
      getPatient(patientId);

    if (!patient) {
      return `Patient #${patientId}`;
    }

    return `Patient #${patient.patient_id}`;
  }

  function getClinicianName(
    clinicianId: number
  ) {
    const clinician =
      getClinician(
        clinicianId
      );

    if (!clinician) {
      return `Clinician #${clinicianId}`;
    }

    return clinician.name;
  }

  function getStatusClasses(
    status?: string
  ) {
    switch (status) {

      case "Scheduled":
        return {
          badge:
            "border-[#cce5d5] bg-[#edf7f0] text-[#397352]",

          dot:
            "bg-[#5d9e73]",
        };

      case "Confirmed":
        return {
          badge:
            "border-[#c9ddd5] bg-[#eaf3ef] text-[#376d5a]",

          dot:
            "bg-[#4c8e72]",
        };

      case "Pending":
        return {
          badge:
            "border-[#eadbb9] bg-[#fff8e9] text-[#9a712c]",

          dot:
            "bg-[#c7953c]",
        };

      case "Completed":
        return {
          badge:
            "border-[#cde3d2] bg-[#edf7ee] text-[#3c7a4e]",

          dot:
            "bg-[#5c9b68]",
        };

      case "Cancelled":
        return {
          badge:
            "border-[#e4dddd] bg-[#f7f4f4] text-[#7c7070]",

          dot:
            "bg-[#a39a9a]",
        };

      default:
        return {
          badge:
            "border-[#dce3de] bg-[#f4f6f4] text-[#65736b]",

          dot:
            "bg-[#87948c]",
        };
    }
  }

  function formatDate(
    date: string
  ) {
    if (!date) {
      return "—";
    }

    const parsed =
      new Date(
        `${date}T00:00:00`
      );

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatTime(
    time: string
  ) {
    if (!time) {
      return "—";
    }

    const [
      hours,
      minutes,
    ] = time.split(":");

    if (
      hours === undefined ||
      minutes === undefined
    ) {
      return time;
    }

    const date =
      new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  const scheduledCount =
    appointments.filter(
      (item) =>
        item.appointment_status ===
        "Scheduled"
    ).length;

  const confirmedCount =
    appointments.filter(
      (item) =>
        item.appointment_status ===
        "Confirmed"
    ).length;

  const completedCount =
    appointments.filter(
      (item) =>
        item.appointment_status ===
        "Completed"
    ).length;

  const filteredAppointments =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      return appointments.filter(
        (appointment) => {

          const patient =
            getPatient(
              appointment.patient_id
            );

          const clinician =
            getClinician(
              appointment.clinician_id
            );

          const searchableText = [
            String(
              appointment.appointment_id
            ),

            getPatientName(
              appointment.patient_id
            ),

            clinician?.name ||
              "",

            clinician?.specialization ||
              "",

            appointment.appointment_type ||
              "",

            appointment.reason ||
              "",

            appointment.appointment_status ||
              "",

            patient?.gender ||
              "",
          ]
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            searchableText.includes(
              query
            );

          const matchesStatus =
            statusFilter === "All" ||
            appointment.appointment_status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      appointments,
      patients,
      clinicians,
      search,
      statusFilter,
    ]);

  if (loading) {
    return (
      <AuthGuard
        allowedRoles={["admin"]}
      >
        <main className="flex min-h-screen items-center justify-center bg-[#f6f8f4]">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1efe5] text-[#176b4d]">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#b8d5c2] border-t-[#176b4d]" />

            </div>

            <p className="mt-4 text-sm font-semibold text-[#42564b]">
              Loading appointments...
            </p>

            <p className="mt-1 text-xs text-[#89968f]">
              Preparing appointment workspace
            </p>

          </div>

        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard
      allowedRoles={["admin"]}
    >

      <main className="min-h-screen bg-[#f6f8f4] text-[#17221c]">


        <AdminHeader />

        <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10 lg:py-8">


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

            <div className="relative flex flex-col justify-between gap-7 px-6 py-7 sm:px-9 sm:py-8 lg:flex-row lg:items-center lg:px-10">

              <div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#c4dfce]">

                  <span className="h-2 w-2 rounded-full bg-[#82c397]" />

                  Appointment management

                </div>

                <h1 className="text-[2.3rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-white sm:text-4xl">

                  Keep every appointment{" "}

                  <span className="text-[#9acb7c]">
                    organized.
                  </span>

                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#c0d5c8]">

                  Coordinate patients and clinicians,
                  manage appointment schedules and
                  keep every visit easy to track.

                </p>

              </div>

              <div className="flex shrink-0 items-center gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a9c8b6]">
                    Total appointments
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-white">
                    {appointments.length}
                  </p>

                </div>

                <button
                  onClick={
                    openCreateForm
                  }
                  className="flex items-center gap-2 rounded-2xl bg-[#a9d48d] px-5 py-4 text-sm font-bold text-[#193c2b] hover:bg-[#b8df9f]"
                >

                  <Icon
                    name="plus"
                    size={18}
                  />

                  Add Appointment

                </button>

              </div>

            </div>

          </section>


          {message && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#cfe5d6] bg-[#eef8f1] px-5 py-4 text-sm font-semibold text-[#397352]">

              <Icon
                name="check"
                size={17}
              />

              {message}

            </div>
          )}


          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">

              <span className="font-bold">
                !
              </span>

              {error}

              <button
                onClick={() =>
                  setError("")
                }
                className="ml-auto text-xs font-bold"
              >
                Dismiss
              </button>

            </div>
          )}


          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-[#dfe7e0] bg-white p-5">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#87948c]">
                All appointments
              </p>

              <p className="mt-2 text-3xl font-extrabold text-[#23392e]">
                {appointments.length}
              </p>

              <p className="mt-3 text-xs text-[#839087]">
                Across all statuses
              </p>

            </div>

            <div className="rounded-2xl border border-[#dfe7e0] bg-white p-5">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#87948c]">
                Scheduled
              </p>

              <p className="mt-2 text-3xl font-extrabold text-[#23392e]">
                {scheduledCount}
              </p>

              <p className="mt-3 text-xs text-[#839087]">
                Upcoming visits
              </p>

            </div>

            <div className="rounded-2xl border border-[#dfe7e0] bg-white p-5">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#87948c]">
                Confirmed
              </p>

              <p className="mt-2 text-3xl font-extrabold text-[#23392e]">
                {confirmedCount}
              </p>

              <p className="mt-3 text-xs text-[#839087]">
                Confirmed visits
              </p>

            </div>

            <div className="rounded-2xl border border-[#dfe7e0] bg-white p-5">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#87948c]">
                Completed
              </p>

              <p className="mt-2 text-3xl font-extrabold text-[#23392e]">
                {completedCount}
              </p>

              <p className="mt-3 text-xs text-[#839087]">
                Completed visits
              </p>

            </div>

          </section>


          <section className="overflow-hidden rounded-[1.8rem] border border-[#dfe7e0] bg-white shadow-[0_6px_28px_rgba(33,54,41,0.05)]">


            <div className="border-b border-[#e6ebe6] px-6 py-6 sm:px-7">

              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87948c]">
                    Scheduling workspace
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#20372c]">
                    Appointment Records
                  </h2>

                  <p className="mt-1 text-sm text-[#7b887f]">
                    View, update and manage every appointment.
                  </p>

                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="relative">

                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#789087]">

                      <Icon
                        name="search"
                        size={17}
                      />

                    </div>

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search appointments..."
                      className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#76a78a] sm:w-[300px]"
                    />

                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none focus:border-[#76a78a]"
                  >

                    <option value="All">
                      All Statuses
                    </option>

                    <option value="Scheduled">
                      Scheduled
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>

            </div>


            <div className="flex items-center justify-between border-b border-[#edf0ed] bg-[#fbfcfa] px-6 py-3.5">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#5c9c72]" />

                <span className="text-xs font-semibold text-[#718078]">

                  {filteredAppointments.length}{" "}

                  {filteredAppointments.length === 1
                    ? "appointment"
                    : "appointments"}{" "}

                  shown

                </span>

              </div>

              {(search ||
                statusFilter !== "All") && (

                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="text-xs font-bold text-[#397352] hover:text-[#176b4d]"
                >
                  Clear filters
                </button>

              )}

            </div>


            <div className="hidden overflow-x-auto xl:block">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-[#e9eee9] bg-[#fbfcfa] text-left">

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829087]">
                      Appointment
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829087]">
                      Patient
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829087]">
                      Clinician
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829087]">
                      Date & Time
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829087]">
                      Type
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829087]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#829087]">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredAppointments.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-6 py-14 text-center"
                      >

                        <div className="mx-auto max-w-sm">

                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5ef] text-[#397352]">

                            <Icon
                              name="calendar"
                              size={25}
                            />

                          </div>

                          <p className="mt-4 text-sm font-bold text-[#34483d]">
                            No appointments found
                          </p>

                          <p className="mt-1 text-xs text-[#849088]">
                            Try changing your search or status filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredAppointments.map(
                      (appointment) => {

                        const status =
                          getStatusClasses(
                            appointment.appointment_status
                          );

                        const clinician =
                          getClinician(
                            appointment.clinician_id
                          );

                        return (

                          <tr
                            key={
                              appointment.appointment_id
                            }
                            className="border-b border-[#edf0ed] transition-colors hover:bg-[#fbfdfb]"
                          >


                            <td className="px-5 py-4">

                              <p className="text-sm font-bold text-[#294535]">
                                #
                                {
                                  appointment.appointment_id
                                }
                              </p>

                              <p className="mt-1 text-[11px] text-[#8a968f]">
                                Appointment
                              </p>

                            </td>


                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf3ed] text-[#397352]">

                                  <Icon
                                    name="user"
                                    size={16}
                                  />

                                </div>

                                <div>

                                  <p className="text-sm font-bold text-[#405148]">

                                    {
                                      getPatientName(
                                        appointment.patient_id
                                      )
                                    }

                                  </p>

                                  <p className="mt-0.5 text-[11px] text-[#8a968f]">

                                    Patient ID:{" "}

                                    {
                                      appointment.patient_id
                                    }

                                  </p>

                                </div>

                              </div>

                            </td>


                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf4ef] text-[#397352]">

                                  <Icon
                                    name="doctor"
                                    size={16}
                                  />

                                </div>

                                <div>

                                  <p className="text-sm font-bold text-[#405148]">

                                    {
                                      getClinicianName(
                                        appointment.clinician_id
                                      )
                                    }

                                  </p>

                                  {clinician && (

                                    <p className="mt-0.5 text-[11px] text-[#8a968f]">

                                      {
                                        clinician.specialization
                                      }

                                    </p>

                                  )}

                                </div>

                              </div>

                            </td>


                            <td className="px-5 py-4">

                              <p className="text-sm font-bold text-[#405148]">

                                {
                                  formatDate(
                                    appointment.appointment_date
                                  )
                                }

                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#839087]">

                                <Icon
                                  name="clock"
                                  size={13}
                                />

                                {
                                  formatTime(
                                    appointment.appointment_time
                                  )
                                }

                              </div>

                            </td>


                            <td className="px-5 py-4">

                              <span className="rounded-lg bg-[#f1f5f1] px-2.5 py-1.5 text-xs font-bold text-[#58685f]">

                                {
                                  appointment.appointment_type ||
                                  "—"
                                }

                              </span>

                            </td>


                            <td className="px-5 py-4">

                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${status.badge}`}
                              >

                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                />

                                {
                                  appointment.appointment_status ||
                                  "Unknown"
                                }

                              </span>

                            </td>


                            <td className="px-5 py-4">

                              <div className="flex justify-end gap-2">


                                {appointment.appointment_status !==
                                  "Completed" &&
                                  appointment.appointment_status !==
                                    "Cancelled" && (

                                    <button
                                      onClick={() =>
                                        completeAppointment(
                                          appointment.appointment_id
                                        )
                                      }
                                      disabled={
                                        completingId ===
                                        appointment.appointment_id
                                      }
                                      className="flex h-9 items-center gap-1.5 rounded-xl border border-[#cce5d5] bg-[#edf7f0] px-3 text-xs font-bold text-[#397352] transition-all hover:-translate-y-0.5 hover:border-[#a9c7b2] hover:bg-[#e2f0e5] disabled:cursor-not-allowed disabled:opacity-50"
                                      title="Mark appointment as completed"
                                    >

                                      <Icon
                                        name="check"
                                        size={15}
                                      />

                                      {
                                        completingId ===
                                        appointment.appointment_id
                                          ? "Completing..."
                                          : "Complete"
                                      }

                                    </button>

                                  )}


                                <button
                                  onClick={() =>
                                    openEditForm(
                                      appointment
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#cfe0d4] bg-[#edf6ef] text-[#397352] transition-all hover:-translate-y-0.5 hover:border-[#a9c7b2] hover:bg-[#e2f0e5]"
                                  title="Edit appointment"
                                >

                                  <Icon
                                    name="edit"
                                    size={15}
                                  />

                                </button>


                                <button
                                  onClick={() =>
                                    deleteAppointment(
                                      appointment.appointment_id
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    appointment.appointment_id
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#edd7d4] bg-[#fff5f4] text-[#b05a52] transition-all hover:-translate-y-0.5 hover:bg-[#ffefed] disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Delete appointment"
                                >

                                  <Icon
                                    name="trash"
                                    size={15}
                                  />

                                </button>

                              </div>

                            </td>

                          </tr>

                        );

                      }
                    )

                  )}

                </tbody>

              </table>

            </div>


            <div className="space-y-3 p-4 xl:hidden">

              {filteredAppointments.length === 0 ? (

                <div className="px-4 py-12 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5ef] text-[#397352]">

                    <Icon
                      name="calendar"
                      size={25}
                    />

                  </div>

                  <p className="mt-4 text-sm font-bold text-[#34483d]">
                    No appointments found
                  </p>

                  <p className="mt-1 text-xs text-[#849088]">
                    Try changing your filters.
                  </p>

                </div>

              ) : (

                filteredAppointments.map(
                  (appointment) => {

                    const status =
                      getStatusClasses(
                        appointment.appointment_status
                      );

                    const clinician =
                      getClinician(
                        appointment.clinician_id
                      );

                    return (

                      <div
                        key={
                          appointment.appointment_id
                        }
                        className="rounded-2xl border border-[#e1e8e2] bg-[#fbfcfa] p-4"
                      >


                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <p className="text-sm font-extrabold text-[#294535]">

                              Appointment #

                              {
                                appointment.appointment_id
                              }

                            </p>

                            <p className="mt-1 text-xs text-[#849088]">

                              {
                                getPatientName(
                                  appointment.patient_id
                                )
                              }

                            </p>

                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.badge}`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            {
                              appointment.appointment_status ||
                              "Unknown"
                            }

                          </span>

                        </div>


                        <div className="mt-4 grid gap-3 sm:grid-cols-2">

                          <div className="rounded-xl bg-white p-3">

                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b978f]">
                              Clinician
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#405148]">
                              {
                                getClinicianName(
                                  appointment.clinician_id
                                )
                              }
                            </p>

                            {clinician && (
                              <p className="mt-0.5 text-[11px] text-[#8a968f]">
                                {
                                  clinician.specialization
                                }
                              </p>
                            )}

                          </div>

                          <div className="rounded-xl bg-white p-3">

                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b978f]">
                              Date & Time
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#405148]">
                              {
                                formatDate(
                                  appointment.appointment_date
                                )
                              }
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#8a968f]">
                              {
                                formatTime(
                                  appointment.appointment_time
                                )
                              }
                            </p>

                          </div>

                          <div className="rounded-xl bg-white p-3">

                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b978f]">
                              Appointment Type
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#405148]">
                              {
                                appointment.appointment_type ||
                                "—"
                              }
                            </p>

                          </div>

                          <div className="rounded-xl bg-white p-3">

                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b978f]">
                              Patient ID
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#405148]">
                              {
                                appointment.patient_id
                              }
                            </p>

                          </div>

                        </div>


                        {appointment.reason && (

                          <div className="mt-3 rounded-xl bg-white p-3">

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b978f]">
                              Reason
                            </p>

                            <p className="mt-1 text-sm leading-5 text-[#5e6c64]">
                              {
                                appointment.reason
                              }
                            </p>

                          </div>

                        )}


                        <div className="mt-4 flex flex-wrap gap-2">


                          {appointment.appointment_status !==
                            "Completed" &&
                            appointment.appointment_status !==
                              "Cancelled" && (

                              <button
                                onClick={() =>
                                  completeAppointment(
                                    appointment.appointment_id
                                  )
                                }
                                disabled={
                                  completingId ===
                                  appointment.appointment_id
                                }
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#cce5d5] bg-[#edf7f0] px-3 py-2.5 text-xs font-bold text-[#397352] disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                <Icon
                                  name="check"
                                  size={15}
                                />

                                {
                                  completingId ===
                                  appointment.appointment_id
                                    ? "Completing..."
                                    : "Complete"
                                }

                              </button>

                            )}


                          <button
                            onClick={() =>
                              openEditForm(
                                appointment
                              )
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#cfe0d4] bg-[#edf6ef] px-3 py-2.5 text-xs font-bold text-[#397352]"
                          >

                            <Icon
                              name="edit"
                              size={15}
                            />

                            Edit

                          </button>


                          <button
                            onClick={() =>
                              deleteAppointment(
                                appointment.appointment_id
                              )
                            }
                            disabled={
                              deletingId ===
                              appointment.appointment_id
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#edd7d4] bg-[#fff5f4] px-3 py-2.5 text-xs font-bold text-[#b05a52] disabled:opacity-50"
                          >

                            <Icon
                              name="trash"
                              size={15}
                            />

                            {
                              deletingId ===
                              appointment.appointment_id
                                ? "Deleting..."
                                : "Delete"
                            }

                          </button>

                        </div>

                      </div>

                    );

                  }
                )

              )}

            </div>

          </section>


          <footer className="mt-7 flex flex-col gap-3 border-t border-[#dfe6e0] pt-6 text-xs text-[#89948e] sm:flex-row sm:items-center sm:justify-between">

            <p>
              HealthAssist Administration
            </p>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#4f9870]" />

              Appointment scheduling workspace

            </div>

          </footer>

        </div>


        {showForm && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271d]/55 p-4 backdrop-blur-sm">

            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.8rem] border border-[#dfe7e0] bg-white shadow-[0_30px_90px_rgba(18,48,35,0.25)]">


              <div className="flex items-start justify-between border-b border-[#e7ece7] bg-[#fbfcfa] px-6 py-5 sm:px-7">

                <div>

                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f0e6] text-[#347151]">

                    <Icon
                      name={
                        editingAppointment
                          ? "edit"
                          : "calendar"
                      }
                      size={19}
                    />

                  </div>

                  <h2 className="text-xl font-bold text-[#20372c]">

                    {editingAppointment
                      ? "Edit Appointment"
                      : "Create Appointment"}

                  </h2>

                  <p className="mt-1 text-sm text-[#7b887f]">

                    {editingAppointment
                      ? `Update appointment #${editingAppointment.appointment_id}.`
                      : "Schedule a patient visit with a clinician."}

                  </p>

                </div>

                <button
                  onClick={closeForm}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#819087] hover:bg-[#edf2ed]"
                >

                  <Icon
                    name="close"
                    size={19}
                  />

                </button>

              </div>


              <form
                onSubmit={
                  editingAppointment
                    ? updateAppointment
                    : createAppointment
                }
                className="overflow-y-auto"
              >

                <div className="space-y-6 px-6 py-6 sm:px-7">


                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">

                        Patient *

                      </label>

                      <select
                        name="patient_id"
                        value={
                          formData.patient_id
                        }
                        onChange={
                          handleChange
                        }
                        className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none"
                      >

                        <option value="">
                          Select Patient
                        </option>

                        {patients.map(
                          (patient) => (

                            <option
                              key={
                                patient.patient_id
                              }
                              value={
                                patient.patient_id
                              }
                            >

                              Patient #
                              {
                                patient.patient_id
                              }

                              {" "}

                              —{" "}
                              {
                                patient.gender
                              }

                              , Age{" "}
                              {
                                patient.age
                              }

                            </option>

                          )
                        )}

                      </select>

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">

                        Clinician *

                      </label>

                      <select
                        name="clinician_id"
                        value={
                          formData.clinician_id
                        }
                        onChange={
                          handleChange
                        }
                        className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none"
                      >

                        <option value="">
                          Select Clinician
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

                              {
                                clinician.name
                              }

                              {" — "}

                              {
                                clinician.specialization
                              }

                              {
                                clinician.availability_status
                                  ? ` (${clinician.availability_status})`
                                  : ""
                              }

                            </option>

                          )
                        )}

                      </select>

                    </div>

                  </div>


                  {formData.clinician_id && (

                    <div className="rounded-2xl border border-[#dce9df] bg-[#f3f9f4] p-4">

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

                          <div className="flex items-start gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dceee2] text-[#176b4d]">

                              <Icon
                                name="doctor"
                                size={20}
                              />

                            </div>

                            <div>

                              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#779080]">
                                Selected clinician
                              </p>

                              <p className="mt-0.5 text-sm font-bold text-[#294535]">
                                {
                                  clinician.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#6e8075]">

                                {
                                  clinician.specialization
                                }

                                {
                                  clinician.department
                                    ? ` • ${clinician.department}`
                                    : ""
                                }

                              </p>

                              {clinician.availability_status && (

                                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#527a63]">

                                  <span className="h-1.5 w-1.5 rounded-full bg-[#5c9b68]" />

                                  {
                                    clinician.availability_status
                                  }

                                </div>

                              )}

                            </div>

                          </div>

                        );

                      })()}

                    </div>

                  )}


                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">

                        Appointment Date *

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
                        className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">

                        Appointment Time *

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
                        className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none"
                      />

                    </div>

                  </div>


                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">

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
                        className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none"
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

                        <option value="Emergency">
                          Emergency
                        </option>

                        <option value="Specialist Consultation">
                          Specialist Consultation
                        </option>

                      </select>

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">

                        Appointment Status

                      </label>

                      <select
                        name="appointment_status"
                        value={
                          formData.appointment_status
                        }
                        onChange={
                          handleChange
                        }
                        className="w-full rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium text-[#21372c] outline-none"
                      >

                        <option value="Scheduled">
                          Scheduled
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#52665b]">

                      Reason

                    </label>

                    <textarea
                      name="reason"
                      value={
                        formData.reason
                      }
                      onChange={
                        handleChange
                      }
                      rows={4}
                      placeholder="Enter reason for appointment..."
                      className="w-full resize-none rounded-xl border border-[#dce5de] bg-[#fbfcfa] px-4 py-3 text-sm font-medium leading-6 text-[#21372c] outline-none"
                    />

                  </div>

                </div>


                <div className="flex justify-end gap-3 border-t border-[#e7ece7] bg-[#fbfcfa] px-6 py-4 sm:px-7">

                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-xl border border-[#d9e2db] bg-white px-5 py-2.5 text-sm font-bold text-[#596960] hover:bg-[#f2f5f2] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#176b4d] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f5139] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <Icon
                      name={
                        editingAppointment
                          ? "edit"
                          : "plus"
                      }
                      size={16}
                    />

                    {
                      saving
                        ? "Saving..."
                        : editingAppointment
                        ? "Update Appointment"
                        : "Create Appointment"
                    }

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

    </AuthGuard>
  );
}
