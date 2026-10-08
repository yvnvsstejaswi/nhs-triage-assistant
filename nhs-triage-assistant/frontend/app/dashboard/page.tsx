"use client";

import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import PatientHeader from "../../components/PatientHeader";

export default function DashboardPage() {

  return (
    <AuthGuard allowedRoles={["patient"]}>
      <main className="min-h-screen bg-[#f4f7ef] text-[#17221c]">

        <PatientHeader />

        <section className="relative overflow-hidden">

          <div className="pointer-events-none absolute -left-40 top-10 h-[400px] w-[400px] rounded-full bg-[#dcebd5] opacity-50 blur-3xl" />

          <div className="pointer-events-none absolute -right-40 top-72 h-[450px] w-[450px] rounded-full bg-[#e7efd9] opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">

            <div className="animate-fade-up">

              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d3e1cd] bg-[#f9fbf7] px-4 py-2">

                    <span className="h-2 w-2 rounded-full bg-[#72a846] animate-gentle-pulse" />

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#628c42]">
                      Patient Dashboard
                    </span>

                  </div>

                  <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-[#14251d] sm:text-5xl">

                    Welcome to

                    <span className="text-[#72a846]">
                      {" "}HealthAssist.
                    </span>

                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#68756d]">
                    Manage your healthcare information, appointments and
                    AI-assisted triage services from one simple place.
                  </p>

                </div>

                <div className="health-card flex shrink-0 items-center gap-4 px-5 py-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f0df] text-[#6a963f]">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.5 12l2.2 2.2 4.8-5"
                      />
                    </svg>

                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#8a968f]">
                      Account status
                    </p>

                    <p className="mt-0.5 text-sm font-extrabold text-[#304239]">
                      Active
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="mt-10">

              <div className="mb-5 flex items-end justify-between">

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#71954f]">
                    Quick access
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[#1d3026]">
                    Your healthcare services
                  </h2>
                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-3">

                <Link
                  href="/profile"
                  className="group health-card animate-scale-in p-6"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f0df] text-[#6a963f] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#dcebd5]">

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-7 w-7"
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

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f6f1] text-[#718078] transition-all duration-300 group-hover:bg-[#176b4d] group-hover:text-white">

                      →
                    </span>

                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#24372d]">
                    Patient Profile
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#748078]">
                    View and manage your personal and health information.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-[#176b4d]">

                    View Profile

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                </Link>

                <Link
                  href="/appointments"
                  className="group health-card animate-scale-in p-6"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f2df] text-[#176b4d] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#dcebd5]">

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

                        <path
                          strokeLinecap="round"
                          d="M8 14h2M14 14h2M8 17h2"
                        />
                      </svg>

                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f6f1] text-[#718078] transition-all duration-300 group-hover:bg-[#176b4d] group-hover:text-white">
                      →
                    </span>

                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#24372d]">
                    Appointments
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#748078]">
                    Create and manage your healthcare appointments.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-[#176b4d]">

                    Manage Appointments

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                </Link>

                <Link
                  href="/triage"
                  className="group health-card animate-scale-in p-6"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e4f1e8] text-[#176b4d] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#d7e9dc]">

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-7 w-7"
                      >

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v18M3 12h18"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7l2 2M17 7l-2 2M7 17l2-2M17 17l-2-2"
                        />

                      </svg>

                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f6f1] text-[#718078] transition-all duration-300 group-hover:bg-[#176b4d] group-hover:text-white">
                      →
                    </span>

                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#24372d]">
                    AI Triage Support
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#748078]">
                    Access symptom assessment and AI-assisted healthcare
                    support.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-[#176b4d]">

                    Open Triage

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                </Link>

              </div>

            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

              <div className="health-card overflow-hidden">

                <div className="p-7 sm:p-8">

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                    <div>

                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#71954f]">
                        Healthcare overview
                      </p>

                      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#24372d]">
                        Everything you need in one place
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#748078]">
                        HealthAssist brings essential patient services
                        together in one convenient platform.
                      </p>

                    </div>

                    <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f0df] text-[#6a963f] sm:flex">

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
                          d="M12 3a9 9 0 100 18 9 9 0 000-18z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h8M12 8v8"
                        />
                      </svg>

                    </div>

                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl border border-[#e1e9de] bg-[#f8faf6] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4e1cf]">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#176b4d] shadow-sm">

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="h-5 w-5"
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

                        <p className="font-extrabold text-[#304239]">
                          Appointment Management
                        </p>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#7b8780]">
                        Manage appointment details and booking information
                        through your patient dashboard.
                      </p>

                    </div>

                    <div className="rounded-2xl border border-[#e1e9de] bg-[#f8faf6] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4e1cf]">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#176b4d] shadow-sm">

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="h-5 w-5"
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

                        <p className="font-extrabold text-[#304239]">
                          Patient Information
                        </p>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#7b8780]">
                        Maintain your demographic and lifestyle information
                        through your profile.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              <Link
                href="/triage"
                className="group relative overflow-hidden rounded-[1.5rem] bg-[#176b4d] p-7 text-white shadow-[0_20px_50px_rgba(23,107,77,0.20)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(23,107,77,0.25)]"
              >

                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/5" />

                <div className="relative">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

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
                        d="M12 3v18M3 12h18"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 7l2 2M17 7l-2 2M7 17l2-2M17 17l-2-2"
                      />
                    </svg>

                  </div>

                  <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.16em] text-[#cfe5d8]">
                    AI-assisted healthcare
                  </p>

                  <h3 className="mt-3 text-2xl font-black leading-tight">
                    Need help understanding your symptoms?
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#dceee5]">
                    Use our triage support feature to provide your symptoms
                    and receive a preliminary model-based assessment.
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-[#176b4d] transition-all duration-300 group-hover:gap-3">

                    Start Triage

                    <span>
                      →
                    </span>

                  </div>

                </div>

              </Link>

            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#dfe7dc] pt-6 text-center sm:flex-row sm:text-left">

              <p className="text-xs text-[#8a958e]">
                HealthAssist • Smart healthcare support
              </p>

              <p className="text-xs text-[#8a958e]">
                AI-assisted assessments are not a substitute for professional medical advice.
              </p>

            </div>

          </div>

        </section>

      </main>
    </AuthGuard>
  );
}
