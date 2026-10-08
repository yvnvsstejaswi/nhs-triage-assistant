"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthGuard from "../../components/AuthGuard";
import AdminHeader from "../../components/AdminHeader";
import Icon from "../../components/Icon";

type AdminSummary = {
  total_patients: number;
  total_appointments: number;
  total_triage_records: number;
  moderate_triage_records: number;
  low_triage_records: number;
};

function AdminDashboardContent() {
  const router = useRouter();

  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8000/admin/summary",
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

          router.replace("/login");
          return;
        }

        if (response.status === 403) {
          setError("Admin access required.");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load dashboard.");
        }

        const data = await response.json();

        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const patients = summary?.total_patients ?? 0;
  const appointments = summary?.total_appointments ?? 0;
  const triage = summary?.total_triage_records ?? 0;
  const moderate = summary?.moderate_triage_records ?? 0;
  const low = summary?.low_triage_records ?? 0;

  const lowPercentage =
    triage > 0 ? Math.round((low / triage) * 100) : 0;

  const moderatePercentage =
    triage > 0
      ? Math.round((moderate / triage) * 100)
      : 0;

  const otherPercentage = Math.max(
    0,
    100 - lowPercentage - moderatePercentage
  );

  return (
    <main className="min-h-screen bg-[#f6f8f4] text-[#17221c]">
      <AdminHeader />

      <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="relative mb-7 overflow-hidden rounded-[1.8rem] bg-[#174936] text-white shadow-[0_16px_40px_rgba(23,73,54,0.13)]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#5e9f78]/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-[38%] h-56 w-56 rounded-full bg-[#8bb89a]/8 blur-3xl" />

          <div className="pointer-events-none absolute right-[34%] top-7 h-28 w-28 rounded-full border border-white/[0.08]" />

          <div className="pointer-events-none absolute right-[37%] top-12 h-20 w-20 rounded-full border border-white/[0.06]" />

          <div className="relative grid lg:grid-cols-[1fr_300px]">
            <div className="px-6 py-7 sm:px-9 sm:py-8 lg:px-10 lg:py-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#c4dfce] backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#82c397] shadow-[0_0_10px_rgba(130,195,151,0.55)]" />

                Administration workspace
              </div>

              <h1 className="max-w-2xl text-[2.35rem] font-extrabold leading-[1.03] tracking-[-0.05em] text-white sm:text-4xl lg:text-[3.15rem]">
                Welcome to{" "}
                <span className="text-[#9acb7c]">
                  HealthAssist.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#c0d5c8] sm:text-[15px]">
                Keep your healthcare operations organized with
                one clear view of patients, appointments and
                AI-assisted assessments.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[11px] font-semibold text-[#c4d9cc]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#83c397]" />
                  Centralized management
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2 text-[11px] font-semibold text-[#b8cec1]">
                  <Icon name="shield" size={13} />
                  Secure workspace
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[230px] items-center justify-center lg:flex">
              <div className="absolute inset-y-8 left-0 w-px bg-white/[0.08]" />

              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/[0.08]">
                <div className="absolute inset-4 rounded-full border border-white/[0.065]" />

                <div className="absolute inset-8 flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] shadow-[0_18px_40px_rgba(0,0,0,0.1)] backdrop-blur-md">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#8cbd72]/12 text-[#a8d78f]">
                      <Icon name="clipboard" size={24} />
                    </div>

                    <p className="mt-3 text-xs font-bold text-white">
                      Admin center
                    </p>

                    <p className="mt-1 text-[9px] text-[#aec7b8]">
                      Manage with clarity
                    </p>
                  </div>
                </div>

                <span className="absolute right-3 top-6 h-2 w-2 rounded-full bg-[#91c979]" />

                <span className="absolute bottom-5 left-5 h-1.5 w-1.5 rounded-full bg-[#6aa882]" />

                <span className="absolute left-2 top-1/2 h-1 w-1 rounded-full bg-white/25" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-7">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87948c]">
              Platform overview
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#20372c]">
              Everything at a glance
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-[1.5rem] border border-[#dfe7e0] bg-white p-6 shadow-[0_5px_25px_rgba(33,54,41,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(33,54,41,0.08)]">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#e5f1e8] blur-3xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4f1e8] text-[#176b4d]">
                    <Icon name="users" size={23} />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b978f]">
                    Registered
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-[2.5rem] font-extrabold leading-none tracking-[-0.05em] text-[#19382a]">
                    {loading
                      ? "—"
                      : patients.toLocaleString()}
                  </p>

                  <p className="mt-3 text-sm font-medium text-[#718078]">
                    Patient records
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#edf2ed]">
                    <span className="block h-full w-[82%] rounded-full bg-[#65a078]" />
                  </span>

                  <span className="text-[10px] font-semibold text-[#849087]">
                    Records
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.5rem] border border-[#dfe7e0] bg-white p-6 shadow-[0_5px_25px_rgba(33,54,41,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(33,54,41,0.08)]">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#eaf1eb] blur-3xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0ea] text-[#176b4d]">
                    <Icon name="calendar" size={23} />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b978f]">
                    Healthcare
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-[2.5rem] font-extrabold leading-none tracking-[-0.05em] text-[#19382a]">
                    {loading ? "—" : appointments}
                  </p>

                  <p className="mt-3 text-sm font-medium text-[#718078]">
                    Scheduled appointments
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#edf2ed]">
                    <span className="block h-full w-[54%] rounded-full bg-[#779f87]" />
                  </span>

                  <span className="text-[10px] font-semibold text-[#849087]">
                    Visits
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.5rem] border border-[#dfe7e0] bg-white p-6 shadow-[0_5px_25px_rgba(33,54,41,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(33,54,41,0.08)]">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#edf1e7] blur-3xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0e7] text-[#176b4d]">
                    <Icon name="activity" size={23} />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b978f]">
                    AI assisted
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-[2.5rem] font-extrabold leading-none tracking-[-0.05em] text-[#19382a]">
                    {loading ? "—" : triage}
                  </p>

                  <p className="mt-3 text-sm font-medium text-[#718078]">
                    Health assessments
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#edf2ed]">
                    <span className="block h-full w-[68%] rounded-full bg-[#8cae94]" />
                  </span>

                  <span className="text-[10px] font-semibold text-[#849087]">
                    Assessments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[1.8rem] border border-[#dfe7e0] bg-white shadow-[0_6px_28px_rgba(33,54,41,0.05)]">
            <div className="border-b border-[#e7ece7] bg-[#fbfcfa] px-6 py-6 sm:px-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87948c]">
                Assessment analytics
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#20372c]">
                Triage insights
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7b887f]">
                Understand the current distribution of AI-assisted
                assessment classifications.
              </p>
            </div>

            <div className="p-6 sm:p-7">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        triage > 0
                          ? `conic-gradient(
                              #5c9c72 0% ${lowPercentage}%,
                              #c8a35b ${lowPercentage}% ${
                                lowPercentage + moderatePercentage
                              }%,
                              #dce5df ${
                                lowPercentage + moderatePercentage
                              }% 100%
                            )`
                          : "#dce5df",
                    }}
                  />

                  <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(23,34,28,0.07)]">
                    <span className="text-3xl font-extrabold tracking-tight text-[#20372c]">
                      {loading ? "—" : triage}
                    </span>

                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a958e]">
                      Total
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="rounded-2xl border border-[#e1e9e3] bg-[#f7faf7] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-[#5c9c72]" />

                        <span className="text-sm font-bold text-[#536158]">
                          Low risk
                        </span>
                      </div>

                      <span className="text-lg font-extrabold text-[#30483a]">
                        {loading
                          ? "—"
                          : `${lowPercentage}%`}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e6eee8]">
                      <div
                        className="h-full rounded-full bg-[#5c9c72] transition-all duration-700"
                        style={{
                          width: `${lowPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#ece4d3] bg-[#fdfaf4] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-[#c8a35b]" />

                        <span className="text-sm font-bold text-[#5b5548]">
                          Moderate
                        </span>
                      </div>

                      <span className="text-lg font-extrabold text-[#554a35]">
                        {loading
                          ? "—"
                          : `${moderatePercentage}%`}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eeeadd]">
                      <div
                        className="h-full rounded-full bg-[#c8a35b] transition-all duration-700"
                        style={{
                          width: `${moderatePercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e3e8e4] bg-[#f7f8f7] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-[#c5cec8]" />

                        <span className="text-sm font-bold text-[#66736c]">
                          Other
                        </span>
                      </div>

                      <span className="text-lg font-extrabold text-[#536158]">
                        {loading
                          ? "—"
                          : `${otherPercentage}%`}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8ece9]">
                      <div
                        className="h-full rounded-full bg-[#bfcac3] transition-all duration-700"
                        style={{
                          width: `${otherPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex gap-3 rounded-2xl border border-[#dfe9e2] bg-[#f3f9f4] p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dceee2] text-[#176b4d]">
                  <Icon name="shield" size={17} />
                </div>

                <p className="text-xs leading-5 text-[#718078]">
                  AI-assisted assessment results are informational
                  and should not be treated as a medical diagnosis.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.8rem] bg-[#123a2b] p-6 text-white shadow-[0_18px_50px_rgba(18,58,43,0.16)] sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-[40px] border-white/[0.025]" />

            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-48 rounded-full bg-[#6ba47e]/[0.06] blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#afcbb9]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#72b88b]" />
                    Administration
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Open a workspace
                  </h2>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-[#a8c2b2]">
                    Choose where you want to work. Each management
                    area has its own dedicated workspace.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.035] text-[#9fc5ad] sm:flex">
                  <Icon name="clipboard" size={23} />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  href="/admin/patients"
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#194635] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.1] hover:bg-[#1d4c3a]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.05] bg-[#21513f] text-[#9fcbb0]">
                    <Icon name="users" size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white">
                      Patient Management
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#9db9a8]">
                      Manage registered patient records
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#173e30] text-[#8fb8a0] transition-all group-hover:bg-[#245844] group-hover:text-white">
                    <Icon name="arrow" size={16} />
                  </div>
                </Link>

                <Link
                  href="/admin/appointments"
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#194635] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.1] hover:bg-[#1d4c3a]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.05] bg-[#21513f] text-[#9fcbb0]">
                    <Icon name="calendar" size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white">
                      Appointment Management
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#9db9a8]">
                      Manage scheduled healthcare visits
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#173e30] text-[#8fb8a0] transition-all group-hover:bg-[#245844] group-hover:text-white">
                    <Icon name="arrow" size={16} />
                  </div>
                </Link>

                <Link
                  href="/admin/triage"
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#194635] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.1] hover:bg-[#1d4c3a]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.05] bg-[#21513f] text-[#9fcbb0]">
                    <Icon name="activity" size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white">
                      Triage Management
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#9db9a8]">
                      Review AI-assisted health assessments
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#173e30] text-[#8fb8a0] transition-all group-hover:bg-[#245844] group-hover:text-white">
                    <Icon name="arrow" size={16} />
                  </div>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#70b789]" />

                  <span className="text-[11px] font-medium text-[#9bb7a6]">
                    Secure administration workspace
                  </span>
                </div>

                <div className="text-[#8eafa0]">
                  <Icon name="shield" size={15} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-7 flex flex-col gap-3 border-t border-[#dfe6e0] pt-6 text-xs text-[#89948e] sm:flex-row sm:items-center sm:justify-between">
          <p>HealthAssist Administration</p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4f9870]" />

            Secure healthcare workspace
          </div>
        </footer>
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
