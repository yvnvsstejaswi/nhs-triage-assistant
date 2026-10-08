"use client";

import Link from "next/link";
import HealthAssistBrand from "../components/HealthAssistBrand";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcf8] text-[#14251d]">

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#e3f0df] blur-3xl opacity-70" />

        <div className="absolute right-[-180px] top-[20%] h-[420px] w-[420px] rounded-full bg-[#edf4df] blur-3xl opacity-70" />

        <div className="absolute bottom-[-180px] left-[35%] h-[400px] w-[400px] rounded-full bg-[#e7f1e4] blur-3xl opacity-60" />

      </div>

      <header className="sticky top-0 z-50 border-b border-[#e7ece5] bg-[#fbfcf8]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">


            <HealthAssistBrand href="/" />

          <nav className="hidden items-center gap-8 md:flex">

            <a
              href="#services"
              className="text-sm font-medium text-[#596961] transition-colors hover:text-[#176b4d]"
            >
              Services
            </a>

            <a
              href="#technology"
              className="text-sm font-medium text-[#596961] transition-colors hover:text-[#176b4d]"
            >
              Technology
            </a>

            <a
              href="#why-us"
              className="text-sm font-medium text-[#596961] transition-colors hover:text-[#176b4d]"
            >
              Why Us
            </a>

            <a
              href="#ai-assistance"
              className="text-sm font-medium text-[#596961] transition-colors hover:text-[#176b4d]"
            >
              AI Triage
            </a>

          </nav>

          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-full border border-[#b8cfae] bg-white px-4 py-2.5 text-sm font-bold text-[#173c2d] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d] hover:shadow-md sm:px-5"
          >
            <span>Get Started</span>

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#75ae45] text-white transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

          </Link>

        </div>

      </header>

      <section className="relative">

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-28 lg:pt-20">

          <div className="animate-fade-up">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e5c8] bg-[#f4f8ed] px-4 py-2">

              <span className="text-[#72a846]">
                ♡
              </span>

              <span className="text-[11px] font-bold tracking-wide text-[#55783d]">
                SMART HEALTHCARE, JUST FOR YOU
              </span>

            </div>

            <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-[#111b17] sm:text-6xl lg:text-[4.7rem]">

              Your Health,

              <span className="block">
                Our{" "}
                <span className="text-[#72a846]">
                  Priority.
                </span>
              </span>

            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#657169] sm:text-lg">
              A simple and intelligent healthcare platform that helps you
              manage appointments, access patient information and receive
              AI-assisted preliminary health assessments.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#176b4d] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#176b4d]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0f5139] hover:shadow-xl"
              >

                Get Started

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-[#b9c9b6] bg-white px-6 py-3.5 text-sm font-bold text-[#3f5448] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#176b4d] hover:text-[#176b4d] hover:shadow-md"
              >
                Explore Services
              </a>

            </div>

            <div className="mt-9 flex flex-wrap items-center gap-5">

              <div className="flex -space-x-2">

                <Avatar letter="A" />
                <Avatar letter="S" />
                <Avatar letter="R" />
                <Avatar letter="M" />

              </div>

              <div>

                <div className="flex items-center gap-1">

                  <span className="text-sm font-extrabold text-[#176b4d]">
                    4.9/5
                  </span>

                  <span className="text-[#e1b94e]">
                    ★★★★★
                  </span>

                </div>

                <p className="text-xs text-[#7b8780]">
                  A smarter way to manage healthcare
                </p>

              </div>

            </div>

          </div>

          <div className="relative animate-scale-in">

            <div className="relative mx-auto max-w-[590px]">

              <div className="absolute inset-x-6 bottom-0 top-8 rounded-[3rem] bg-[#e2f0d8]" />

              <div className="absolute -right-4 top-10 h-20 w-20 rounded-full border border-[#cbdcbf] bg-[#edf5e7] animate-soft-float" />

              <div className="absolute -left-5 bottom-14 h-16 w-16 rounded-full border border-[#d6e3c9] bg-[#f4f8ed] animate-soft-float-reverse" />

              <div className="relative mx-auto h-[470px] overflow-hidden rounded-[2.8rem] border border-[#d6e2d0] bg-gradient-to-br from-[#eef7e8] via-[#e8f3e0] to-[#dcebd3] shadow-[0_25px_70px_rgba(50,90,55,0.13)] sm:h-[540px]">

                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85"
                  alt="Healthcare professional"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#143c2d]/20 via-transparent to-transparent" />

              </div>

              <div className="absolute left-[-15px] top-[100px] hidden rounded-2xl border border-[#cddfc5] bg-white/95 p-3 shadow-xl backdrop-blur-md sm:block animate-soft-float">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5e7] text-[#6ba23e]">
                    ♡
                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#829087]">
                      Healthcare
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-[#173126]">
                      Expert Support
                    </p>

                  </div>

                </div>

              </div>

              <div className="absolute right-[-12px] top-[210px] w-[210px] rounded-2xl border border-[#d6e2d0] bg-white/95 p-4 shadow-xl backdrop-blur-md sm:right-[-25px] animate-soft-float-reverse">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f2df] text-[#72a846]">
                    ✦
                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#89958d]">
                      AI Assistance
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#173126]">
                      Preliminary triage
                    </p>

                  </div>

                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e4eadf]">

                  <div className="h-full w-[78%] rounded-full bg-[#72a846]" />

                </div>

              </div>

              <div className="absolute bottom-[35px] left-[25px] rounded-2xl border border-[#d6e2d0] bg-white/95 p-4 shadow-xl backdrop-blur-md sm:left-[55px]">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176b4d] text-white">
                    ✓
                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#89958d]">
                      Appointments
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#173126]">
                      Easy scheduling
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section
        id="services"
        className="border-y border-[#e1e9dd] bg-[#f4f7ef] py-20"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6a963f]">
                Our Services
              </p>

              <h2 className="mt-4 max-w-md text-3xl font-black leading-tight text-[#17221c] sm:text-4xl">
                Better care,
                <span className="block">
                  better experience.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#6b776f]">
                Everything you need to make your healthcare journey simpler,
                more organized and connected.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-3">

              <ServiceCard
                icon="📅"
                title="Appointments"
                text="Manage upcoming healthcare appointments with ease."
              />

              <ServiceCard
                icon="✦"
                title="AI Triage"
                text="Get a preliminary model-based assessment from symptoms."
              />

              <ServiceCard
                icon="🔐"
                title="Secure Access"
                text="Protected access for patients and administrators."
              />

            </div>

          </div>

        </div>

      </section>

      <section
        id="technology"
        className="bg-[#fbfcf8] py-24"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div className="relative">

              <div className="absolute -inset-5 rounded-[3rem] bg-[#e8f1e1] blur-xl" />

              <div className="relative rounded-[2rem] border border-[#dce7d8] bg-white p-5 shadow-xl">

                <div className="rounded-[1.5rem] bg-[#eff6ea] p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#78926a]">
                        HealthAssist
                      </p>

                      <h3 className="mt-2 text-xl font-black text-[#17221c]">
                        Intelligent healthcare
                      </h3>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#176b4d] text-white">
                      ✦
                    </div>

                  </div>

                  <div className="mt-7 space-y-3">

                    <TechnologyRow
                      title="Symptom Assessment"
                      status="Ready"
                    />

                    <TechnologyRow
                      title="AI Prediction"
                      status="Available"
                    />

                    <TechnologyRow
                      title="Healthcare Guidance"
                      status="Connected"
                    />

                  </div>

                </div>

              </div>

            </div>

            <div>

              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6a963f]">
                Smart Technology
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight text-[#17221c] sm:text-4xl">
                Intelligent tools designed around your healthcare journey.
              </h2>

              <p className="mt-6 leading-8 text-[#68756d]">
                HealthAssist combines modern web technology with a machine
                learning model to support healthcare workflows and provide
                useful preliminary information.
              </p>

              <div className="mt-8 space-y-5">

                <Benefit
                  title="AI-assisted preliminary assessment"
                  text="Symptoms can be evaluated using the integrated machine learning model."
                />

                <Benefit
                  title="Connected patient experience"
                  text="Appointments, patient information and triage are available from one platform."
                />

                <Benefit
                  title="Responsible healthcare technology"
                  text="AI results are presented as preliminary assistance and not as a medical diagnosis."
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      <section
        id="ai-assistance"
        className="bg-[#12392d] py-24 text-white"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

                <span className="text-[#9bc56b]">
                  ✦
                </span>

                <span className="text-[10px] font-bold tracking-[0.18em] text-white/70">
                  AI-ASSISTED TRIAGE
                </span>

              </div>

              <h2 className="mt-6 max-w-xl text-3xl font-black leading-tight sm:text-4xl">
                Technology that helps start better healthcare conversations.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-white/60">
                HealthAssist uses a machine learning model to provide a
                preliminary assessment based on the symptoms provided.
                It is designed to support healthcare workflows and does
                not replace professional medical diagnosis.
              </p>

              <Link
                href="/login"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#176b4d] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                Try AI Triage

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </Link>

            </div>

            <div className="animate-soft-float">

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      AI Assistant
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      Preliminary Assessment
                    </h3>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#83b45b]/15 text-[#9bc56b]">
                    ✦
                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  <DarkInfo
                    label="Symptoms"
                    value="Received"
                  />

                  <DarkInfo
                    label="Model assessment"
                    value="Ready"
                  />

                  <DarkInfo
                    label="Next step"
                    value="Consult professional"
                  />

                </div>

                <div className="mt-5 rounded-xl border border-[#9bc56b]/15 bg-[#9bc56b]/5 p-4">

                  <p className="text-xs leading-6 text-[#d4dfc8]">
                    AI output is preliminary information and should not be
                    considered a medical diagnosis.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section
        id="why-us"
        className="bg-[#f4f7ef] py-24"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6a963f]">
              Why Choose Us
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#17221c] sm:text-4xl">
              Better care,
              <span className="text-[#72a846]">
                {" "}better future.
              </span>
            </h2>

            <p className="mt-5 leading-7 text-[#68756d]">
              Built with simplicity, security and intelligent technology
              at the center of the experience.
            </p>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <WhyCard
              number="01"
              title="Simple Experience"
              text="Clean interfaces make everyday healthcare management easier."
            />

            <WhyCard
              number="02"
              title="Personalized Care"
              text="Patient-focused features keep important healthcare information connected."
            />

            <WhyCard
              number="03"
              title="Continuous Support"
              text="Appointments and healthcare assistance stay available in one place."
            />

          </div>

        </div>

      </section>

      <section className="bg-[#fbfcf8] px-6 py-20 lg:px-8">

        <div className="mx-auto max-w-6xl">

          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#176b4d] px-7 py-14 text-center text-white shadow-2xl shadow-[#176b4d]/15 sm:px-14">

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/5" />

            <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#9bc56b]/10" />

            <div className="relative">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

                <svg
                  viewBox="0 0 48 48"
                  className="h-7 w-7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >

                  <path
                    d="M20 8H28V20H40V28H28V40H20V28H8V20H20V8Z"
                    fill="white"
                  />

                  <path
                    d="M7 25H14L18 18L22 31L26 21L30 27H41"
                    stroke="#CFE5D8"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

              </div>

              <h2 className="mt-6 text-3xl font-black sm:text-4xl">
                Your health deserves a simpler experience.
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-white/70">
                Start managing your healthcare journey with HealthAssist.
              </p>

              <Link
                href="/login"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#176b4d] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                Get Started

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </Link>

            </div>

          </div>

        </div>

      </section>

      <footer className="border-t border-[#dfe7dc] bg-[#eef3e9]">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">

            <div>

              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176b4d]">

                  <svg
                    viewBox="0 0 48 48"
                    className="h-5 w-5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <path
                      d="M20 8H28V20H40V28H28V40H20V28H8V20H20V8Z"
                      fill="white"
                    />

                    <path
                      d="M7 25H14L18 18L22 31L26 21L30 27H41"
                      stroke="#CFE5D8"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                  </svg>

                </div>

                <div>

                  <span className="block text-lg font-extrabold text-[#14251d]">
                    HealthAssist
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7b8d83]">
                    Smart Healthcare
                  </span>

                </div>

              </Link>

              <p className="mt-4 max-w-sm text-sm leading-7 text-[#69776f]">
                A healthcare platform for appointments, patient information
                and AI-assisted preliminary health assessment.
              </p>

            </div>

            <div>

              <p className="text-sm font-extrabold text-[#31453b]">
                Platform
              </p>

              <div className="mt-4 space-y-3">

                <Link
                  href="/login"
                  className="block text-sm text-[#6c7972] transition-colors hover:text-[#176b4d]"
                >
                  Patient Login
                </Link>

                <a
                  href="#services"
                  className="block text-sm text-[#6c7972] transition-colors hover:text-[#176b4d]"
                >
                  Services
                </a>

                <a
                  href="#technology"
                  className="block text-sm text-[#6c7972] transition-colors hover:text-[#176b4d]"
                >
                  Technology
                </a>

                <a
                  href="#ai-assistance"
                  className="block text-sm text-[#6c7972] transition-colors hover:text-[#176b4d]"
                >
                  AI Triage
                </a>

              </div>

            </div>

            <div>

              <p className="text-sm font-extrabold text-[#31453b]">
                Important
              </p>

              <p className="mt-4 text-sm leading-7 text-[#6c7972]">
                HealthAssist provides AI-assisted preliminary assessments
                and does not replace professional medical advice, diagnosis
                or treatment.
              </p>

            </div>

          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[#d6e0d3] pt-6 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-[#819087]">
              © {new Date().getFullYear()} HealthAssist. All rights reserved.
            </p>

            <p className="text-xs text-[#89968f]">
              Healthcare Appointment & Triage Assistant
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}

function Avatar({ letter }: { letter: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fbfcf8] bg-[#dcebd5] text-[10px] font-bold text-[#3f6e2f]">
      {letter}
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[1.5rem] border border-[#cfdcc9] bg-[#fbfcf8] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f2df] text-lg text-[#72a846] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-5 text-base font-extrabold text-[#17221c]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#718078]">
        {text}
      </p>

      <div className="mt-5 text-sm font-bold text-[#72a846]">
        Learn more →
      </div>

    </div>
  );
}

function TechnologyRow({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#dce7d8] bg-white p-4">

      <div className="flex items-center gap-3">

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e6f1df] text-xs font-bold text-[#72a846]">
          ✓
        </span>

        <span className="text-sm font-bold text-[#34443a]">
          {title}
        </span>

      </div>

      <span className="rounded-full bg-[#edf5e8] px-3 py-1 text-[10px] font-bold text-[#628c3e]">
        {status}
      </span>

    </div>
  );
}

function Benefit({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4efdf] text-sm font-black text-[#6b9e42]">
        ✓
      </div>

      <div>

        <h3 className="text-sm font-extrabold text-[#34443a]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-[#748078]">
          {text}
        </p>

      </div>

    </div>
  );
}

function DarkInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] p-4">

      <span className="text-sm text-white/50">
        {label}
      </span>

      <span className="text-sm font-bold text-[#dcebd5]">
        {value}
      </span>

    </div>
  );
}

function WhyCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[1.5rem] border border-[#d2dfcd] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <span className="text-xs font-black tracking-[0.2em] text-[#93a68b]">
          {number}
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#76aa4b] text-sm text-white transition-transform duration-300 group-hover:rotate-45">
          →
        </span>

      </div>

      <h3 className="mt-7 text-xl font-extrabold text-[#17221c]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#718078]">
        {text}
      </p>

    </div>
  );
}
