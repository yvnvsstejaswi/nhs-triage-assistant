"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles?: ("patient" | "admin")[];
};

export default function AuthGuard({
  children,
  allowedRoles,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");

    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (
      allowedRoles &&
      (!role || !allowedRoles.includes(role as "patient" | "admin"))
    ) {
      if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }

      return;
    }

    const timer = window.setTimeout(() => setChecking(false), 0);
    return () => window.clearTimeout(timer);
  }, [allowedRoles, pathname, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />

          <p className="mt-4 text-sm text-slate-500">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
