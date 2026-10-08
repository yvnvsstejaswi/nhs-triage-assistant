"use client";

import { useRouter } from "next/navigation";

export default function BackToDashboard() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard")}
      className="inline-flex items-center gap-2 text-[14px] font-semibold leading-none text-[#607168] transition-colors hover:text-[#176b4d]"
    >
      <svg viewBox="0 0 20 20" className="h-[17px] w-[17px]" fill="none" aria-hidden="true">
        <path d="M15.5 10H4.5M4.5 10L9 5.5M4.5 10L9 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Back to Dashboard</span>
    </button>
  );
}
