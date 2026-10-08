"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";
import AdminHeader from "../../../components/AdminHeader";
import Icon from "../../../components/Icon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type TriageRecord = {
  triage_id: number;
  patient_id: number;
  symptoms: string;
  prediction: string;
  risk_level: string;
  recommendation: string;
  created_at: string;
};

function getRiskClass(risk: string) {
  const value = risk.toLowerCase();

  if (value === "low") {
    return {
      badge: "bg-[#e6f3ea] text-[#237348]",
      dot: "bg-[#4f9a68]",
      iconBg: "bg-[#eaf5ed]",
    };
  }

  if (value === "moderate") {
    return {
      badge: "bg-[#f8efd9] text-[#9a6a1c]",
      dot: "bg-[#c39135]",
      iconBg: "bg-[#fbf3df]",
    };
  }

  return {
    badge: "bg-[#f9e5e3] text-[#a74743]",
    dot: "bg-[#c95b55]",
    iconBg: "bg-[#fae9e7]",
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminTriagePage() {
  const router = useRouter();
  const [records, setRecords] = useState<TriageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const [selectedRecord, setSelectedRecord] =
    useState<TriageRecord | null>(null);

  useEffect(() => {
    async function loadTriageRecords() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const adminResponse = await fetch(
          `${API_URL}/auth/admin-test`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (adminResponse.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_id");

          router.replace("/login");
          return;
        }

        if (adminResponse.status === 403) {
          setError("Access denied. Admin access required.");
          setLoading(false);
          return;
        }

        if (!adminResponse.ok) {
          throw new Error(
            "Unable to verify admin access."
          );
        }

        const response = await fetch(
          `${API_URL}/triage/admin`,
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

        if (response.status === 403) {
          setError("Access denied. Admin access required.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load triage records."
          );
        }

        const data: TriageRecord[] =
          await response.json();

        setRecords(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTriageRecords();
  }, []);


  const totalRecords = records.length;

  const uniquePatients = new Set(
    records.map((record) => record.patient_id)
  ).size;

  const moderateRecords = records.filter(
    (record) =>
      record.risk_level?.toLowerCase() ===
      "moderate"
  ).length;

  const lowRecords = records.filter(
    (record) =>
      record.risk_level?.toLowerCase() ===
      "low"
  ).length;

  const otherRecords =
    totalRecords -
    moderateRecords -
    lowRecords;

  const predictions = records.reduce(
    (result, record) => {
      const prediction =
        record.prediction || "Unknown";

      result[prediction] =
        (result[prediction] || 0) + 1;

      return result;
    },
    {} as Record<string, number>
  );

  const mostCommonPrediction =
    Object.entries(predictions).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "No data";

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesRisk =
        riskFilter === "All" ||
        record.risk_level?.toLowerCase() ===
          riskFilter.toLowerCase();

      const matchesSearch =
        !query ||
        String(record.triage_id).includes(query) ||
        String(record.patient_id).includes(query) ||
        record.symptoms
          .toLowerCase()
          .includes(query) ||
        record.prediction
          .toLowerCase()
          .includes(query) ||
        record.recommendation
          .toLowerCase()
          .includes(query);

      return matchesRisk && matchesSearch;
    });
  }, [records, search, riskFilter]);

  const lowPercentage =
    totalRecords > 0
      ? Math.round(
          (lowRecords / totalRecords) * 100
        )
      : 0;

  const moderatePercentage =
    totalRecords > 0
      ? Math.round(
          (moderateRecords / totalRecords) * 100
        )
      : 0;

  const otherPercentage =
    totalRecords > 0
      ? Math.max(
          0,
          100 -
            lowPercentage -
            moderatePercentage
        )
      : 0;

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <main className="min-h-screen bg-[#f5f7f3] text-[#17221c]">


        <AdminHeader />

        <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10 lg:py-8">


          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#668075] transition-colors hover:text-[#176b4d]"
          >
            <span>←</span>
            Back to Admin Dashboard
          </Link>

          <section className="relative mb-7 overflow-hidden rounded-[1.8rem] bg-[#174936] shadow-[0_16px_40px_rgba(23,73,54,0.12)]">

            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#74a887]/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 left-1/2 h-64 w-64 rounded-full bg-[#9dc8a9]/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-7 px-6 py-7 sm:px-9 sm:py-8 lg:flex-row lg:items-center lg:px-10">

              <div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#c4dfce]">
                  <span className="h-2 w-2 rounded-full bg-[#82c397]" />
                  Triage management
                </div>

                <h1 className="text-[2.3rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-white sm:text-4xl lg:text-[3.1rem]">
                  Review every assessment{" "}
                  <span className="text-[#9acb7c]">
                    with clarity.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#c0d5c8] sm:text-[15px]">
                  Review AI-assisted triage records,
                  understand recorded risk levels and
                  keep patient assessment information
                  organized in one workspace.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a9c8b6]">
                    Total assessments
                  </p>

                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    {totalRecords.toLocaleString()}
                  </p>
                </div>

                <div className="hidden rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-sm sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a9c8b6]">
                    Patients assessed
                  </p>

                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    {uniquePatients.toLocaleString()}
                  </p>
                </div>

              </div>
            </div>
          </section>


          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}


          {loading && (
            <div className="flex min-h-[260px] items-center justify-center rounded-[1.5rem] border border-[#e3e9e3] bg-white">
              <div className="text-center">

                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#dce8df] border-t-[#176b4d]" />

                <p className="mt-4 text-sm font-semibold text-[#617067]">
                  Loading triage assessments...
                </p>

              </div>
            </div>
          )}

          {!loading && !error && (
            <>


              <section className="mb-8">

                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4f8a6b]">
                    Assessment overview
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#1b2921]">
                    Triage performance at a glance
                  </h2>

                  <p className="mt-1 text-sm text-[#77837c]">
                    A quick summary of the assessment
                    records currently available.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  <div className="rounded-[1.5rem] border border-[#e2e8e2] bg-white p-5 shadow-[0_8px_30px_rgba(23,34,28,0.04)] transition-all duration-300 hover:-translate-y-1">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-xs font-semibold text-[#748078]">
                          Total assessments
                        </p>

                        <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#193027]">
                          {totalRecords}
                        </p>

                        <p className="mt-1 text-xs text-[#8b968f]">
                          All recorded assessments
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5f1e9] text-[#24734d]">
                        <Icon
                          name="clipboard"
                          size={21}
                        />
                      </div>

                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#e2e8e2] bg-white p-5 shadow-[0_8px_30px_rgba(23,34,28,0.04)] transition-all duration-300 hover:-translate-y-1">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-xs font-semibold text-[#748078]">
                          Patients assessed
                        </p>

                        <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#193027]">
                          {uniquePatients}
                        </p>

                        <p className="mt-1 text-xs text-[#8b968f]">
                          Unique patient records
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ef] text-[#4f8a6b]">
                        <Icon
                          name="users"
                          size={21}
                        />
                      </div>

                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#e2e8e2] bg-white p-5 shadow-[0_8px_30px_rgba(23,34,28,0.04)] transition-all duration-300 hover:-translate-y-1">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-xs font-semibold text-[#748078]">
                          Low-risk assessments
                        </p>

                        <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#193027]">
                          {lowRecords}
                        </p>

                        <p className="mt-1 text-xs text-[#8b968f]">
                          {lowPercentage}% of assessments
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf5ed] text-[#43865a]">
                        <Icon
                          name="check"
                          size={21}
                        />
                      </div>

                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#e2e8e2] bg-white p-5 shadow-[0_8px_30px_rgba(23,34,28,0.04)] transition-all duration-300 hover:-translate-y-1">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-xs font-semibold text-[#748078]">
                          Moderate-risk assessments
                        </p>

                        <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#193027]">
                          {moderateRecords}
                        </p>

                        <p className="mt-1 text-xs text-[#8b968f]">
                          {moderatePercentage}% of assessments
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbf2df] text-[#a47322]">
                        <Icon
                          name="alert"
                          size={21}
                        />
                      </div>

                    </div>
                  </div>

                </div>
              </section>


              <section className="mb-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">

                <div className="rounded-[1.5rem] border border-[#e2e8e2] bg-white p-6 shadow-[0_8px_30px_rgba(23,34,28,0.04)] sm:p-7">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4f8a6b]">
                        Assessment profile
                      </p>

                      <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#1b2921]">
                        Risk distribution
                      </h2>

                      <p className="mt-1 text-sm text-[#77837c]">
                        Understand how recorded assessments
                        are distributed across risk levels.
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5ef] text-[#347b55]">
                      <Icon
                        name="activity"
                        size={19}
                      />
                    </div>

                  </div>

                  <div className="mt-8">

                    <div className="flex h-5 overflow-hidden rounded-full bg-[#edf0eb]">

                      {lowPercentage > 0 && (
                        <div
                          className="bg-[#5d9d70] transition-all duration-700"
                          style={{
                            width: `${lowPercentage}%`,
                          }}
                        />
                      )}

                      {moderatePercentage > 0 && (
                        <div
                          className="bg-[#c69a43] transition-all duration-700"
                          style={{
                            width: `${moderatePercentage}%`,
                          }}
                        />
                      )}

                      {otherPercentage > 0 && (
                        <div
                          className="bg-[#aeb8b1] transition-all duration-700"
                          style={{
                            width: `${otherPercentage}%`,
                          }}
                        />
                      )}

                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                      <div className="rounded-2xl bg-[#f5faf6] p-4">

                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#5d9d70]" />

                          <span className="text-xs font-semibold text-[#627068]">
                            Low risk
                          </span>
                        </div>

                        <p className="mt-2 text-2xl font-extrabold text-[#203129]">
                          {lowRecords}
                        </p>

                        <p className="mt-1 text-xs text-[#8b968f]">
                          {lowPercentage}% of total
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#fcf8ee] p-4">

                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#c69a43]" />

                          <span className="text-xs font-semibold text-[#75694e]">
                            Moderate risk
                          </span>
                        </div>

                        <p className="mt-2 text-2xl font-extrabold text-[#403824]">
                          {moderateRecords}
                        </p>

                        <p className="mt-1 text-xs text-[#8b968f]">
                          {moderatePercentage}% of total
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#f5f6f4] p-4">

                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#aeb8b1]" />

                          <span className="text-xs font-semibold text-[#68736d]">
                            Other
                          </span>
                        </div>

                        <p className="mt-2 text-2xl font-extrabold text-[#303a35]">
                          {otherRecords}
                        </p>

                        <p className="mt-1 text-xs text-[#8b968f]">
                          {otherPercentage}% of total
                        </p>

                      </div>

                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-[#153d2d] p-6 text-white shadow-[0_16px_40px_rgba(21,61,45,0.12)] sm:p-7">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#a8d792]">
                    <Icon
                      name="clipboard"
                      size={21}
                    />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a9c9b5]">
                    Assessment insight
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">
                    Most recorded condition
                  </h2>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-5">

                    <p className="text-xs font-semibold text-[#a9c9b5]">
                      Top prediction
                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-[#a8d792]">
                      {mostCommonPrediction}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#bfd2c6]">
                      This represents the prediction that
                      appears most frequently among the
                      recorded triage assessments.
                    </p>

                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">

                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8fbe79]/15 text-[#a8d792]">
                      <Icon
                        name="shield"
                        size={17}
                      />
                    </div>

                    <p className="text-xs leading-5 text-[#c3d6ca]">
                      AI-assisted assessments are preliminary
                      results and should support, not replace,
                      professional healthcare evaluation.
                    </p>

                  </div>
                </div>
              </section>


              <section className="overflow-hidden rounded-[1.5rem] border border-[#e2e8e2] bg-white shadow-[0_8px_30px_rgba(23,34,28,0.04)]">

                <div className="border-b border-[#e8ece7] px-5 py-5 sm:px-7">

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4f8a6b]">
                        Assessment records
                      </p>

                      <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#1b2921]">
                        Triage history
                      </h2>

                      <p className="mt-1 text-sm text-[#7a857e]">
                        {filteredRecords.length} record
                        {filteredRecords.length !== 1
                          ? "s"
                          : ""}{" "}
                        shown
                      </p>

                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">

                      <div className="relative">

                        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89948d]">
                          <Icon
                            name="search"
                            size={17}
                          />
                        </div>

                        <input
                          type="text"
                          value={search}
                          onChange={(event) =>
                            setSearch(event.target.value)
                          }
                          placeholder="Search assessments..."
                          className="h-11 w-full rounded-xl border border-[#dfe6e0] bg-[#fbfcf9] pl-10 pr-4 text-sm text-[#26342c] outline-none transition placeholder:text-[#9aa49e] focus:border-[#6c9e80] focus:bg-white focus:ring-4 focus:ring-[#176b4d]/5 sm:w-64"
                        />

                      </div>

                      <div className="relative">

                        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89948d]">
                          <Icon
                            name="filter"
                            size={17}
                          />
                        </div>

                        <select
                          value={riskFilter}
                          onChange={(event) =>
                            setRiskFilter(event.target.value)
                          }
                          className="h-11 w-full appearance-none rounded-xl border border-[#dfe6e0] bg-[#fbfcf9] pl-10 pr-9 text-sm font-semibold text-[#536159] outline-none transition focus:border-[#6c9e80] focus:bg-white focus:ring-4 focus:ring-[#176b4d]/5 sm:w-40"
                        >
                          <option value="All">
                            All risk levels
                          </option>

                          <option value="Low">
                            Low risk
                          </option>

                          <option value="Moderate">
                            Moderate risk
                          </option>
                        </select>

                      </div>
                    </div>
                  </div>
                </div>


                <div className="hidden overflow-x-auto lg:block">

                  <table className="min-w-full">

                    <thead>
                      <tr className="border-b border-[#edf0ec] bg-[#fbfcf9]">

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b877f]">
                          Assessment
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b877f]">
                          Patient
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b877f]">
                          Symptoms
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b877f]">
                          Prediction
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b877f]">
                          Risk
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b877f]">
                          Created
                        </th>

                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b877f]">
                          View
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {filteredRecords.map((record) => {
                        const risk = getRiskClass(
                          record.risk_level
                        );

                        return (
                          <tr
                            key={record.triage_id}
                            className="border-b border-[#edf0ec] transition hover:bg-[#fbfcf9]"
                          >

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${risk.iconBg}`}
                                >
                                  <Icon
                                    name="clipboard"
                                    size={18}
                                  />
                                </div>

                                <div>

                                  <p className="text-sm font-bold text-[#26342c]">
                                    TRI-
                                    {String(
                                      record.triage_id
                                    ).padStart(4, "0")}
                                  </p>

                                  <p className="mt-0.5 text-xs text-[#8b958f]">
                                    Assessment record
                                  </p>

                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-2.5">

                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f1eb] text-xs font-bold text-[#347653]">
                                  P
                                </div>

                                <span className="text-sm font-semibold text-[#3a4840]">
                                  Patient #
                                  {record.patient_id}
                                </span>

                              </div>
                            </td>

                            <td className="max-w-[220px] px-6 py-5">

                              <p className="truncate text-sm text-[#66736b]">
                                {record.symptoms}
                              </p>

                            </td>

                            <td className="px-6 py-5">

                              <p className="max-w-[180px] truncate text-sm font-bold text-[#2a3930]">
                                {record.prediction}
                              </p>

                            </td>

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${risk.badge}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${risk.dot}`}
                                />

                                {record.risk_level}
                              </span>

                            </td>

                            <td className="whitespace-nowrap px-6 py-5 text-sm text-[#718078]">
                              {formatDate(
                                record.created_at
                              )}
                            </td>

                            <td className="px-6 py-5 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedRecord(record)
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfe6e0] bg-white px-3 py-2 text-xs font-bold text-[#47705b] transition hover:border-[#c7d7cc] hover:bg-[#f7faf7]"
                              >
                                View

                                <Icon
                                  name="arrow"
                                  size={14}
                                />
                              </button>

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>
                  </table>
                </div>


                <div className="grid gap-3 p-4 lg:hidden">

                  {filteredRecords.map((record) => {
                    const risk = getRiskClass(
                      record.risk_level
                    );

                    return (
                      <button
                        type="button"
                        key={record.triage_id}
                        onClick={() =>
                          setSelectedRecord(record)
                        }
                        className="w-full rounded-2xl border border-[#e5ebe6] bg-[#fbfcf9] p-4 text-left transition hover:border-[#cad9ce] hover:bg-white"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${risk.iconBg}`}
                            >
                              <Icon
                                name="clipboard"
                                size={18}
                              />
                            </div>

                            <div>

                              <p className="text-sm font-bold text-[#26342c]">
                                TRI-
                                {String(
                                  record.triage_id
                                ).padStart(4, "0")}
                              </p>

                              <p className="mt-0.5 text-xs text-[#8b958f]">
                                Patient #
                                {record.patient_id}
                              </p>

                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${risk.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${risk.dot}`}
                            />

                            {record.risk_level}
                          </span>

                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#929c96]">
                              Prediction
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#334139]">
                              {record.prediction}
                            </p>

                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#929c96]">
                              Created
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#68756d]">
                              {formatDate(
                                record.created_at
                              )}
                            </p>

                          </div>

                        </div>

                        <div className="mt-4">

                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#929c96]">
                            Symptoms
                          </p>

                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#68756d]">
                            {record.symptoms}
                          </p>

                        </div>

                        <div className="mt-4 flex items-center justify-end gap-1 text-xs font-bold text-[#47705b]">
                          View assessment
                          <Icon
                            name="arrow"
                            size={14}
                          />
                        </div>

                      </button>
                    );
                  })}

                </div>

                {filteredRecords.length === 0 && (
                  <div className="px-6 py-16 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ef] text-[#4f8a6b]">
                      <Icon
                        name="search"
                        size={23}
                      />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-[#334139]">
                      No assessments found
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-sm text-[#7c8780]">
                      Try changing your search term
                      or risk filter to find another
                      triage record.
                    </p>

                  </div>
                )}

              </section>
            </>
          )}
        </div>


        {selectedRecord && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#12251c]/45 p-4 backdrop-blur-sm"
            onClick={() =>
              setSelectedRecord(null)
            }
          >

            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] bg-[#fbfcf9] shadow-[0_30px_80px_rgba(0,0,0,0.2)]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="sticky top-0 z-10 border-b border-[#e5ebe6] bg-[#fbfcf9]/95 px-5 py-5 backdrop-blur-xl sm:px-7">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6f1e9] text-[#347653]">
                      <Icon
                        name="clipboard"
                        size={21}
                      />
                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b8174]">
                        Triage assessment
                      </p>

                      <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#203027]">
                        TRI-
                        {String(
                          selectedRecord.triage_id
                        ).padStart(4, "0")}
                      </h2>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRecord(null)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0e7e1] bg-white text-[#6f7b74] transition hover:bg-[#f1f5f1]"
                    aria-label="Close"
                  >
                    <Icon
                      name="close"
                      size={18}
                    />
                  </button>

                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-7">

                <div className="grid gap-4 sm:grid-cols-3">

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-[#e8ede9]">

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#929c96]">
                      Patient
                    </p>

                    <p className="mt-2 text-lg font-extrabold text-[#2a3930]">
                      #{selectedRecord.patient_id}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-[#e8ede9]">

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#929c96]">
                      Risk level
                    </p>

                    <div className="mt-2">

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                          getRiskClass(
                            selectedRecord.risk_level
                          ).badge
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            getRiskClass(
                              selectedRecord.risk_level
                            ).dot
                          }`}
                        />

                        {selectedRecord.risk_level}

                      </span>

                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-[#e8ede9]">

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#929c96]">
                      Created
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#425148]">
                      {formatDateTime(
                        selectedRecord.created_at
                      )}
                    </p>

                  </div>
                </div>

                <div className="rounded-2xl border border-[#e1e9e3] bg-[#f5faf6] p-5">

                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5e806c]">
                    Predicted condition
                  </p>

                  <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#214333]">
                    {selectedRecord.prediction}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#718178]">
                    This is an AI-assisted prediction
                    generated from the recorded triage
                    information.
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#87938c]">
                    Symptoms reported
                  </p>

                  <div className="mt-2 rounded-2xl border border-[#e5ebe6] bg-white p-5">

                    <p className="text-sm leading-6 text-[#536159]">
                      {selectedRecord.symptoms}
                    </p>

                  </div>
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#87938c]">
                    Recommendation
                  </p>

                  <div className="mt-2 flex gap-3 rounded-2xl border border-[#e5ebe6] bg-white p-5">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf4ef] text-[#4d8764]">
                      <Icon
                        name="activity"
                        size={17}
                      />
                    </div>

                    <p className="text-sm leading-6 text-[#536159]">
                      {selectedRecord.recommendation}
                    </p>

                  </div>
                </div>

                <div className="rounded-2xl border border-[#eadfbd] bg-[#fffaf0] p-4">

                  <div className="flex gap-3">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5e9c9] text-[#9b7228]">
                      <Icon
                        name="alert"
                        size={16}
                      />
                    </div>

                    <p className="text-xs leading-5 text-[#806d45]">
                      AI-assisted triage is a preliminary
                      assessment and is not a medical
                      diagnosis. Clinical decisions should
                      be made by qualified healthcare
                      professionals.
                    </p>

                  </div>
                </div>

              </div>

              <div className="border-t border-[#e5ebe6] bg-white px-5 py-4 sm:px-7">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRecord(null)
                  }
                  className="w-full rounded-xl bg-[#176b4d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f5139]"
                >
                  Close Assessment
                </button>

              </div>

            </div>
          </div>
        )}


        <footer className="border-t border-[#e2e8e2] bg-[#f4f6f1]">

          <div className="mx-auto flex max-w-[1450px] flex-col gap-2 px-5 py-6 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left">

            <p className="text-xs font-medium text-[#849088]">
              HealthAssist Administration
            </p>

            <p className="text-xs text-[#9aa49e]">
              AI-assisted triage records are for
              preliminary support only.
            </p>

          </div>

        </footer>

      </main>
    </AuthGuard>
  );
}
