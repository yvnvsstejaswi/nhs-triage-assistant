"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HealthAssistBrand from "../../components/HealthAssistBrand";
import { loginUser } from "../../lib/api";

type TokenPayload = {
  sub: string;
  role: "patient" | "admin";
  exp?: number;
};

function decodeToken(token: string): TokenPayload {
  const payload = token.split(".")[1];

  if (!payload) {
    throw new Error("Invalid authentication token");
  }

  const decoded = JSON.parse(
    atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
  );

  return decoded;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      const accessToken = data.access_token;

      if (!accessToken) {
        throw new Error("Login response did not contain an access token");
      }

      const payload = decodeToken(accessToken);

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_role", payload.role);
      localStorage.setItem("user_id", payload.sub);

      if (payload.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7ef] text-[#17221c]">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#dcebd5] opacity-70 blur-3xl" />

        <div className="absolute -right-40 top-[25%] h-[450px] w-[450px] rounded-full bg-[#e7efd9] opacity-70 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-[#dfeadb] opacity-60 blur-3xl" />

      </div>

      <header className="relative z-10 border-b border-[#dfe7dc] bg-[#f9fbf7]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">


            <HealthAssistBrand href="/" />

          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full border border-[#cbdac6] bg-white px-4 py-2.5 text-sm font-semibold text-[#53645a] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d] hover:text-[#176b4d] hover:shadow-md"
          >

            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            <span>Back to Home</span>

          </Link>

        </div>

      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-76px)] items-center px-6 py-12 lg:px-8">

        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1fr_0.85fr]">

          <div className="hidden lg:block animate-fade-up">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4e2cc] bg-[#f8fbf5] px-4 py-2">

              <span className="flex h-2.5 w-2.5 rounded-full bg-[#72a846] animate-gentle-pulse" />

              <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#55783d]">
                WELCOME TO HEALTHASSIST
              </span>

            </div>

            <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.05] tracking-[-0.05em] text-[#14251d] xl:text-6xl">

              Your healthcare,

              <span className="block text-[#72a846]">
                all in one place.
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#657169]">
              Sign in to manage your appointments, access your healthcare
              information and use HealthAssist&apos;s AI-assisted triage features.
            </p>

            <div className="mt-9 space-y-4">

              <LoginFeature
                icon="✓"
                title="Easy appointment management"
                text="Keep track of your healthcare appointments."
              />

              <LoginFeature
                icon="✦"
                title="AI-assisted triage"
                text="Receive a preliminary assessment based on symptoms."
              />

              <LoginFeature
                icon="🔐"
                title="Secure access"
                text="Protected access for patients and administrators."
              />

            </div>

            <div className="mt-10 max-w-md rounded-[1.5rem] border border-[#d6e3d0] bg-white/75 p-5 shadow-lg backdrop-blur">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7f2df] text-xl text-[#72a846]">
                  ♡
                </div>

                <div>

                  <p className="text-sm font-extrabold text-[#26392f]">
                    A simpler healthcare journey
                  </p>

                  <p className="mt-1 text-xs text-[#7b8780]">
                    Simple • Secure • Connected
                  </p>

                </div>

                <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#176b4d] text-sm font-bold text-white">
                  ✓
                </div>

              </div>

            </div>

          </div>

          <div className="animate-scale-in">

            <div className="mb-7 lg:hidden">

              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6a963f]">
                Smart Healthcare
              </p>

              <h1 className="mt-2 text-3xl font-black text-[#14251d]">
                Welcome back
              </h1>

            </div>

            <div className="rounded-[2rem] border border-[#d8e3d3] bg-[#fbfdf9]/95 p-7 shadow-[0_25px_70px_rgba(35,70,45,0.10)] backdrop-blur-xl sm:p-9">

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f2df] text-[#176b4d]">

                  <svg
                    viewBox="0 0 48 48"
                    className="h-6 w-6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >

                    <path
                      d="M20 8H28V20H40V28H28V40H20V28H8V20H20V8Z"
                      fill="currentColor"
                    />

                    <path
                      d="M7 25H14L18 18L22 31L26 21L30 27H41"
                      stroke="#fbfdf9"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                  </svg>

                </div>

                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-[#6a963f]">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#14251d]">
                  Sign in
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#738078]">
                  Enter your credentials to access your HealthAssist account.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#34443a]"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a998f]">
                      @
                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-[#d3dfd0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#17221c] outline-none transition-all duration-200 placeholder:text-[#a0aaa4] focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
                    />

                  </div>

                </div>

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-[#34443a]"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a998f]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="10"
                          rx="2"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 10V7a4 4 0 018 0v3"
                        />

                        <circle
                          cx="12"
                          cy="15"
                          r="1"
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[#d3dfd0] bg-white py-3.5 pl-11 pr-12 text-sm text-[#17221c] outline-none transition-all duration-200 placeholder:text-[#a0aaa4] focus:border-[#72a846] focus:ring-4 focus:ring-[#72a846]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-[#7b8d83] transition-all duration-200 hover:bg-[#edf5e8] hover:text-[#176b4d]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showPassword ? (

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
                            d="M3 3l18 18"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.58 10.58a2 2 0 002.83 2.83"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.88 5.09A9.77 9.77 0 0112 4.75c5 0 8.27 4.73 9 6.25a12.2 12.2 0 01-3.06 3.72M6.61 6.61C4.84 7.83 3.56 9.6 3 11c.73 1.52 4 6.25 9 6.25a9.77 9.77 0 003.34-.59"
                          />

                        </svg>

                      ) : (

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
                            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                          />

                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                          />

                        </svg>

                      )}

                    </button>

                  </div>

                </div>

                {error && (
                  <div className="flex gap-3 rounded-xl border border-[#f0cccc] bg-[#fff5f5] px-4 py-3.5 text-sm text-[#b64242]">

                    <span className="font-bold">
                      !
                    </span>

                    <p>
                      {error}
                    </p>

                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#176b4d] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#176b4d]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f5139] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}

                </button>

              </form>

              <div className="mt-7 border-t border-[#e4ebe1] pt-6 text-center">

                <p className="text-xs text-[#87928c]">
                  Secure access to your healthcare platform
                </p>

                <Link
                  href="/"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#176b4d] transition-colors hover:text-[#0f5139]"
                >
                  <span>←</span>
                  Back to home
                </Link>

              </div>

            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#7f8b84]">

              <span className="text-[#6a963f]">
                🔐
              </span>

              Your credentials are securely transmitted.

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function LoginFeature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e5f0df] text-sm font-bold text-[#6a963f]">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-extrabold text-[#304239]">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-[#7b8780]">
          {text}
        </p>

      </div>

    </div>
  );
}
