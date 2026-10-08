"use client";

import { useRouter } from "next/navigation";
import HealthAssistBrand from "./HealthAssistBrand";

export default function PatientHeader() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe7dc] bg-[#f9fbf7]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <HealthAssistBrand />

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-[#d7e2d2] bg-white px-4 py-2 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5f0df] text-[#6a963f]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-xs font-bold text-[#53645a]">Patient</span>
          </span>

          <button
            type="button"
            onClick={logout}
            className="group flex items-center gap-2 rounded-full border border-[#d2ddd0] bg-white px-4 py-2.5 text-sm font-bold text-[#5b6961] shadow-sm transition hover:-translate-y-0.5 hover:border-[#c7d6c3] hover:bg-[#f8faf6] hover:text-[#176b4d] hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
