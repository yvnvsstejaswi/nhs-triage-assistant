# HealthAssist refactor

- Shared HealthAssist branding and patient/admin headers are in `frontend/components/`.
- `BackToDashboard` is shared by the patient profile, appointments and triage pages.
- Admin pages share one `Icon` component instead of maintaining separate copies.
- Repeated large separator comments were removed so page files are easier to read.
- The original app behavior and API routes were kept intact.
- Local secrets are not included. Use `.env.example` and `frontend/.env.example` to create local environment files.
