# 🏥 NHS Healthcare Appointment & Triage Assistant

> An AI-powered healthcare platform inspired by the National Health Service (NHS) to simplify appointment management, provide intelligent symptom triage, and improve digital healthcare accessibility.

---

## 🚧 Project Status

- **Status:** Completed / Internship Project
- **Internship Organization:** NeoSkillz
- **Academic Program:** Master of Computer Applications (MCA)
- **Project Type:** Full Stack Application with Artificial Intelligence
- **Development Methodology:** Agile

---

# 📖 Abstract

The **NHS Healthcare Appointment & Triage Assistant** is a full-stack healthcare management application designed to provide users with a simple and accessible digital platform for managing healthcare appointments and understanding their symptoms.

The application combines modern web technologies with Artificial Intelligence to provide an AI-assisted symptom triage system. Patients can create accounts, manage their profiles, search for available clinicians, book appointments, cancel appointments, receive appointment reminders, and perform an initial symptom assessment.

The platform also provides separate functionality for clinicians and administrators to support efficient healthcare management.

The project is inspired by the digital healthcare services provided by the **National Health Service (NHS)** and is developed as an academic and internship project.

---

# 📌 Introduction

Healthcare applications are becoming increasingly important as people look for convenient ways to access healthcare services digitally.

Traditional appointment systems can require patients to spend significant time searching for available healthcare providers and managing appointments manually. In addition, patients may not always know whether their symptoms require immediate medical attention or a routine consultation.

The **NHS Healthcare Appointment & Triage Assistant** addresses these challenges by providing a centralized healthcare platform where patients can manage appointments and perform an initial AI-assisted symptom assessment.

The system is designed to improve accessibility, reduce unnecessary manual processes, and provide users with useful healthcare guidance before consulting a qualified healthcare professional.

---

# ❗ Problem Statement

Patients commonly face several challenges when accessing healthcare services:

- Difficulty finding suitable healthcare providers.
- Difficulty managing appointments.
- Lack of immediate guidance about symptoms.
- Long manual processes for appointment management.
- Limited access to centralized healthcare information.
- Difficulty determining the urgency of certain symptoms.
- Lack of an integrated digital healthcare platform.

The proposed system attempts to address these problems through a unified healthcare appointment and symptom-triage platform.

---

# 🔬 Research Motivation

The motivation behind this project is to explore how modern technologies such as:

- Artificial Intelligence
- Machine Learning
- Full Stack Web Development
- REST APIs
- Database Management
- Natural Language Processing
- Healthcare Information Systems

can be combined to develop a practical healthcare application.

The project also provides an opportunity to understand how AI-assisted systems can support healthcare decision-making while ensuring that such systems do not replace professional medical diagnosis.

---

# 🎯 Objectives

## Primary Objectives

- Develop a full-stack healthcare management platform.
- Provide secure patient authentication.
- Allow patients to manage their profiles.
- Provide appointment booking functionality.
- Allow patients to view and cancel appointments.
- Provide appointment reminders.
- Provide AI-assisted symptom triage.
- Provide clinician availability information.
- Provide administrative functionality.
- Store healthcare-related application data securely.

## Technical Objectives

- Build a responsive frontend using Next.js and React.
- Develop REST APIs using FastAPI and Python.
- Use PostgreSQL for persistent data storage.
- Implement authentication and authorization.
- Integrate AI-assisted symptom analysis.
- Implement role-based access.
- Design a modular application architecture.
- Validate user input and API requests.
- Handle appointment conflicts and availability.

## Learning Objectives

Through this project, the following areas are explored:

- Full Stack Development
- Python Programming
- FastAPI
- Next.js
- React.js
- PostgreSQL
- REST API Development
- Authentication
- Database Management
- Artificial Intelligence
- Machine Learning
- Healthcare Application Development
- Git and GitHub
- Agile Development

---

# 📊 Expected Outcomes

The expected outcomes of the project include:

- A functional healthcare appointment management system.
- Secure patient authentication.
- Easy appointment booking and cancellation.
- Clinician availability management.
- AI-assisted symptom assessment.
- Appointment reminder functionality.
- Role-based application access.
- Centralized healthcare data management.
- User-friendly healthcare interface.
- Scalable full-stack architecture.

---

# 🔍 Project Scope

The project focuses on developing a digital healthcare platform with the following major areas.

## 👤 Patient

Patients can:

- Register and log in.
- View their profile.
- Update personal information.
- Search available clinicians.
- Book appointments.
- View appointment history.
- Cancel appointments.
- Receive appointment reminders.
- Select symptoms.
- Receive AI-assisted triage results.
- View previous triage assessments.

## 👨‍⚕️ Doctor / Clinician

Clinicians can:

- Access clinician-related information.
- View available appointments.
- Manage healthcare appointment information.
- Support patient consultation workflows.

## 👨‍💼 Administrator

Administrators can:

- Manage users.
- Manage clinicians.
- Monitor appointments.
- Manage application data.
- Support overall system administration.

## 🤖 AI & Machine Learning

The AI component focuses on:

- Symptom analysis.
- Initial risk assessment.
- Providing general healthcare guidance.
- Identifying potential urgency levels.
- Supporting patients before professional consultation.

### Out of Scope

The following features are outside the current project scope:

- Online payment processing.
- Video consultations.
- Direct integration with live NHS APIs.
- Electronic prescription generation.
- Wearable device integration.
- Medical billing.
- Direct medical diagnosis.
- Emergency medical services.

---

# 🧩 System Modules

The application consists of the following major modules:

1. Authentication Module
2. Patient Management Module
3. Clinician Module
4. Appointment Module
5. AI Triage Module
6. Notification / Reminder Module
7. Administrator Module
8. Database Module

### High-Level Module Flow

```text
┌──────────────────────────────────────────┐
│          NHS Healthcare Assistant        │
└──────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
   Patient      Clinician    Administrator
     Module        Module        Module
        │
        ▼
 Appointment Management
        │
        ▼
 AI Symptom Triage
        │
        ▼
 PostgreSQL Database
```

---

# ⚙️ Functional Requirements

## Authentication

The system should:

- Allow users to register.
- Allow users to log in.
- Authenticate users securely.
- Support role-based access.
- Maintain authenticated sessions.

## Patient Management

The system should allow patients to:

- View profile information.
- Update profile information.
- Access appointment history.
- Access triage history.

## Appointment Management

The system should allow users to:

- View available clinicians.
- Select appointment dates.
- Select appointment times.
- Book appointments.
- View appointments.
- Cancel appointments.
- Prevent double booking.

## AI Triage

The system should allow users to:

- Select symptoms.
- Submit symptoms for analysis.
- Receive an AI-assisted assessment.
- View risk information.
- View recommended next steps.
- View previous assessments.

## Administration

Administrators should be able to:

- Manage application users.
- Manage clinicians.
- Monitor appointments.
- Manage system information.

---

# 🛡️ Non-Functional Requirements

## Security

- Secure authentication.
- Password protection.
- JWT-based authentication.
- Role-based authorization.
- Environment variable protection.
- Secure database connection.

## Performance

- Fast API responses.
- Efficient database queries.
- Responsive user interface.

## Scalability

The system should be designed so that additional modules can be added in the future.

## Usability

The application should provide:

- Simple navigation.
- Clear forms.
- Responsive design.
- Meaningful error messages.
- User-friendly healthcare workflows.

## Reliability

The system should validate input and handle errors gracefully.

---

# 🛠️ Technology Stack

## Frontend

- Next.js
- React.js
- HTML5
- CSS3
- JavaScript

## Backend

- Python
- FastAPI
- REST APIs
- SQLAlchemy

## Database

- PostgreSQL

## Artificial Intelligence / Machine Learning

- Python
- Scikit-learn
- Pandas
- NumPy
- Matplotlib
- AI-assisted symptom analysis
- RAG / LLM concepts

## DevOps

- Docker
- Docker Compose
- GitHub Actions

## Version Control

- Git
- GitHub

## Development Tools

- Visual Studio Code
- Postman
- pgAdmin
- Jupyter Notebook

---

# 🏗️ System Architecture

The application follows a modern three-layer architecture.

```text
                    ┌─────────────────────┐
                    │       Patient       │
                    │     Clinician       │
                    │   Administrator     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Next.js         │
                    │      Frontend       │
                    │                     │
                    │ React Components    │
                    │ Authentication      │
                    │ Patient Dashboard   │
                    │ Appointments        │
                    │ AI Triage           │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │       Backend       │
                    │                     │
                    │ Authentication      │
                    │ Patient APIs        │
                    │ Appointment APIs    │
                    │ Triage APIs         │
                    │ Clinician APIs      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL       │
                    │      Database       │
                    │                     │
                    │ Users               │
                    │ Patients            │
                    │ Clinicians          │
                    │ Appointments        │
                    │ Triage Records      │
                    └─────────────────────┘
```

---

# 📁 Repository Structure

```text
nhs-healthcare-appointment-triage/
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── patient/
│   │   ├── appointments/
│   │   ├── triage/
│   │   └── admin/
│   │
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   └── database/
│   │
│   ├── requirements.txt
│   └── .env
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── project-documentation.md
│
├── README.md
├── .gitignore
└── LICENSE
```

---

# 🔄 Development Workflow

The project follows an Agile development approach.

```text
Requirement Analysis
        ↓
System Design
        ↓
Database Design
        ↓
Frontend Development
        ↓
Backend Development
        ↓
API Integration
        ↓
AI Triage Integration
        ↓
Testing
        ↓
Bug Fixing
        ↓
Documentation
        ↓
Deployment
```

Development is divided into smaller modules so that each component can be developed and tested independently.

---

# 🗓️ Development Roadmap

## Week 1 – Requirement Analysis

- Understand project requirements.
- Identify user roles.
- Define system scope.
- Research healthcare applications.

## Week 2 – System Design

- Design system architecture.
- Design database.
- Create application workflow.
- Design UI structure.

## Week 3 – Frontend Setup

- Create Next.js application.
- Create reusable components.
- Design authentication pages.
- Create dashboard layouts.

## Week 4 – Backend Setup

- Create FastAPI project.
- Configure PostgreSQL.
- Create database models.
- Configure API routing.

## Week 5 – Authentication

- Implement registration.
- Implement login.
- Implement JWT authentication.
- Implement role-based authorization.

## Week 6 – Patient Module

- Create patient dashboard.
- Create patient profile.
- Implement profile management.

## Week 7 – Appointment Module

- Implement clinician availability.
- Implement appointment booking.
- Implement appointment history.
- Implement cancellation.

## Week 8 – AI Triage

- Implement symptom selection.
- Develop triage logic.
- Integrate AI-assisted assessment.
- Store triage history.

## Week 9 – Clinician and Admin Modules

- Implement clinician functionality.
- Implement administrator functionality.
- Add role-specific dashboards.

## Week 10 – Testing

- Test APIs.
- Test frontend.
- Test database operations.
- Test authentication.
- Test appointment conflicts.

## Week 11 – Optimization

- Fix bugs.
- Improve UI.
- Improve validation.
- Improve performance.

## Week 12 – Documentation

- Complete README.
- Prepare project documentation.
- Prepare presentation.
- Prepare final project demonstration.

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
cd nhs-healthcare-appointment-triage
```

---

# 🐍 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🗄️ PostgreSQL Configuration

Install PostgreSQL and create a database.

Example:

```sql
CREATE DATABASE nhs_healthcare;
```

Create a `.env` file inside the `backend` directory.

Example:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/nhs_healthcare
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Replace the database username, password, host, port, and database name with your local PostgreSQL configuration.

---

# 🔐 Secret Key Generation

A secure secret key should be used for authentication.

Example:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the generated value into:

```env
SECRET_KEY=your_generated_secret_key
```

Do not expose the secret key in frontend code or commit it to GitHub.

---

# 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# ▶️ Running the Complete Application

## Start Backend

From the backend directory:

```bash
uvicorn app.main:app --reload
```

Backend API:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

## Start Frontend

From the frontend directory:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# 🔑 Authentication

The authentication system provides secure access to the application.

The authentication workflow is:

```text
User
  ↓
Login / Registration
  ↓
FastAPI Authentication API
  ↓
Validate Credentials
  ↓
Generate Access Token
  ↓
Frontend Stores Token
  ↓
Authenticated Dashboard
```

Authentication uses:

- Password authentication
- JWT tokens
- Role-based access
- Protected API endpoints

The application supports different user roles such as:

- Patient
- Clinician
- Administrator

---

# 👤 Patient Module

The patient module provides the following functionality.

## Patient Dashboard

Patients can access:

- Profile
- Appointments
- Triage
- Appointment history
- Triage history

## Patient Profile

Patients can:

- View personal information.
- Update profile information.
- Access their healthcare-related application information.

## Patient Workflow

```text
Login
  ↓
Patient Dashboard
  ↓
Profile / Appointments / Triage
  ↓
Select Required Service
  ↓
View Result
```

---

# 📅 Appointment Management

The appointment system allows patients to schedule appointments with available clinicians.

## Appointment Workflow

```text
Patient
   ↓
View Available Clinicians
   ↓
Select Clinician
   ↓
Select Date
   ↓
Select Time
   ↓
Check Availability
   ↓
Book Appointment
   ↓
Appointment Confirmation
```

The system supports:

- Clinician availability.
- Appointment date selection.
- Appointment time selection.
- Appointment creation.
- Appointment history.
- Appointment cancellation.
- Double-booking detection.
- Date/time validation.

---

# ⏰ Appointment Reminders

The application can provide appointment reminders to help patients remember upcoming appointments.

Reminder functionality can include:

- Browser notifications.
- Local reminder storage.
- Upcoming appointment alerts.

The reminder workflow is:

```text
Appointment Created
        ↓
Appointment Stored
        ↓
Reminder Scheduled
        ↓
Upcoming Appointment
        ↓
Patient Notification
```

---

# 🤖 AI-Assisted Symptom Triage

The AI-assisted triage module is one of the major components of the project.

Patients can select or provide symptoms and receive an initial assessment.

## Triage Workflow

```text
Patient
   ↓
Select Symptoms
   ↓
Submit Symptoms
   ↓
Triage API
   ↓
AI / Triage Processing
   ↓
Risk Assessment
   ↓
Recommended Next Step
```

The system may categorize symptoms based on urgency.

Example categories:

- Low Risk
- Moderate Risk
- High Risk
- Emergency / Immediate Attention

The purpose of the system is to provide **initial guidance only**.

It does not replace:

- Doctors
- Nurses
- Emergency services
- Professional medical diagnosis

---

# 🧠 Triage History

Patients can access previous triage assessments.

A triage record may contain:

- Selected symptoms.
- Assessment result.
- Risk level.
- Recommendation.
- Assessment date.

This helps users review their previous interactions with the system.

---

# 👨‍⚕️ Clinician Module

The clinician module supports healthcare providers within the application.

Clinicians can be represented with information such as:

- Name
- Specialization
- Availability
- Appointment information

The system can use clinician availability to help patients select suitable appointment slots.

---

# 👨‍💼 Administrator Module

The administrator module provides management capabilities for the application.

Administrators can manage:

- Users
- Patients
- Clinicians
- Appointments
- Application information

The administrator role is protected using role-based authorization.

---

# 🔌 API Structure

The backend exposes REST APIs for communication between the frontend and backend.

## Authentication

```text
POST /auth/register
POST /auth/login
```

## Patients

```text
GET /patients/me
```

## Clinicians

```text
GET /clinicians/available
```

## Appointments

```text
GET /appointments/
POST /appointments/
POST /appointments/{id}/cancel
```

## Triage

```text
GET /triage/patient/{patient_id}
POST /triage/
```

The frontend communicates with these endpoints using HTTP requests.

---

# 🧪 Testing

Testing is performed across different layers of the application.

## Frontend Testing

Test:

- Login forms.
- Registration forms.
- Navigation.
- Patient dashboard.
- Appointment forms.
- Triage forms.
- Error messages.
- Responsive design.

## Backend Testing

Test:

- Authentication APIs.
- Patient APIs.
- Clinician APIs.
- Appointment APIs.
- Triage APIs.
- Authorization.

## Database Testing

Test:

- User creation.
- Patient records.
- Clinician records.
- Appointment records.
- Triage records.
- Database relationships.

## API Testing

Postman can be used to test backend APIs.

FastAPI also provides interactive API documentation:

```text
http://localhost:8000/docs
```

---

# 📚 Documentation

Project documentation can include:

```text
docs/
│
├── architecture.md
├── api.md
└── project-documentation.md
```

Documentation may cover:

- System architecture.
- Database design.
- API documentation.
- User workflows.
- Installation.
- Testing.
- Future enhancements.

---

# 🔒 Security Considerations

Security is an important part of the application because healthcare-related applications may handle sensitive information.

Security practices include:

- JWT authentication.
- Password protection.
- Role-based authorization.
- Environment variables.
- Secure database credentials.
- Input validation.
- API authorization.
- Protected routes.

Sensitive information should never be hard-coded into the application.

---

# 🌱 Environment Files

Backend environment variables should be stored in:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/nhs_healthcare
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Frontend environment variables should be stored in:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# 🚫 Git Security

Sensitive files should not be committed to GitHub.

Example `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Python
__pycache__/
*.pyc
venv/

# Node
node_modules/
.next/
out/

# IDE
.vscode/
.idea/

# Logs
*.log
```

Never commit:

- Database passwords.
- JWT secret keys.
- API keys.
- Authentication credentials.
- Private certificates.

---

# 🛠️ Common Issues

## `'next' is not recognized`

If the frontend gives:

```text
'next' is not recognized as an internal or external command
```

Run:

```bash
cd frontend
npm install
npm run dev
```

---

## `DATABASE_URL is not set`

Make sure the backend contains:

```text
backend/.env
```

and includes:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/nhs_healthcare
```

---

## Database Connection Error

Verify:

- PostgreSQL is running.
- Database exists.
- Username is correct.
- Password is correct.
- Port is correct.
- `DATABASE_URL` is correct.

---

## Frontend Cannot Connect to Backend

Check:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Also make sure the FastAPI server is running:

```bash
uvicorn app.main:app --reload
```

---

## CORS Error

Ensure the FastAPI backend allows requests from the frontend development server.

Example frontend URL:

```text
http://localhost:3000
```

---

# 🔮 Future Enhancements

The following features can be considered for future versions.

## 🏥 Advanced Healthcare Integration

- Real-time healthcare provider integration.
- Hospital integration.
- Healthcare record interoperability.
- Live NHS service integration.

## 💳 Payment Integration

- Online consultation payments.
- Appointment payment processing.
- Digital receipts.

## 📹 Telemedicine

- Video consultation.
- Audio consultation.
- Secure patient-doctor communication.

## 💊 Prescription Management

- Digital prescriptions.
- Prescription history.
- Medication reminders.

## 🧠 Advanced AI

- Natural language symptom input.
- Advanced NLP.
- Personalized health recommendations.
- Medical knowledge retrieval.
- Improved risk prediction models.
- Explainable AI.

## 📱 Mobile Application

Develop dedicated:

- Android application.
- iOS application.

## ⌚ Wearable Integration

Future versions could integrate:

- Heart rate.
- Blood oxygen.
- Activity levels.
- Sleep information.

## ☁️ Cloud Deployment

The system can be deployed using cloud platforms such as:

- AWS
- Microsoft Azure
- Google Cloud

---

# 🌍 Real-World Applications

The concepts developed in this project can be applied to:

- Healthcare appointment systems.
- Hospital management systems.
- Primary healthcare platforms.
- Telemedicine platforms.
- Patient portals.
- Healthcare information systems.
- Symptom assessment applications.
- Digital health assistants.

---

# 💡 Benefits

## For Patients

- Easier appointment booking.
- Simple appointment management.
- Quick initial symptom guidance.
- Appointment reminders.
- Centralized healthcare information.

## For Clinicians

- Organized appointment information.
- Better visibility of scheduled patients.
- Digital workflow support.

## For Administrators

- Centralized user management.
- Appointment monitoring.
- Improved system organization.

## For Students / Developers

The project provides practical experience in:

- Full Stack Development.
- Artificial Intelligence.
- REST APIs.
- Database Management.
- Authentication.
- Healthcare technology.
- Software engineering.

---

# 🤝 Contributing

Contributions can be made by:

1. Forking the repository.
2. Creating a new branch.
3. Implementing changes.
4. Testing the changes.
5. Committing the changes.
6. Creating a pull request.

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

Then create a pull request.

---

# 📄 License

This project is licensed under the **MIT License**.

The project is developed for educational, internship, and demonstration purposes.

---

# 👩‍💻 Author

## Yarasuri V N V Sai Sri Tejaswi

**Master of Computer Applications (MCA)**  
**KL University, Vijayawada**

### Technical Interests

- Full Stack Development
- Python
- Java
- SQL
- Artificial Intelligence
- Machine Learning
- Data Analytics
- Power BI
- Generative AI
- Healthcare Technology

---

# 🙏 Acknowledgements

I would like to express my gratitude to:

- **NeoSkillz** for providing the internship opportunity.
- **KL University** for academic support.
- My mentors and trainers for their guidance.
- Open-source communities for the technologies and resources used in this project.
- Developers and researchers whose work contributed to the technologies used in this application.

---

# ⚠️ Disclaimer

This project is developed for **educational and demonstration purposes**.

The AI-assisted symptom triage functionality is not intended to provide professional medical diagnosis or treatment.

Users should consult a qualified healthcare professional for medical advice.

In case of a medical emergency, users should contact appropriate emergency medical services immediately.

This project is inspired by the concept of digital healthcare services and is **not an official NHS application** and is not affiliated with or endorsed by the National Health Service.

---

# 📌 Project Summary

The **NHS Healthcare Appointment & Triage Assistant** demonstrates how modern web development and Artificial Intelligence can be combined to create a digital healthcare platform.

The application provides:

- 🔐 Secure authentication
- 👤 Patient management
- 👨‍⚕️ Clinician availability
- 📅 Appointment booking
- ❌ Appointment cancellation
- ⏰ Appointment reminders
- 🤖 AI-assisted symptom triage
- 📋 Triage history
- 👨‍💼 Administrator functionality
- 🗄️ PostgreSQL database
- ⚡ FastAPI backend
- ⚛️ Next.js frontend
- 🔑 JWT-based authentication
- 🛡️ Role-based authorization

The project demonstrates practical implementation of **Full Stack Development, Artificial Intelligence, REST API development, database management, authentication, and healthcare application design**.

---

# 🏥 NHS Healthcare Appointment & Triage Assistant

**A Full Stack AI-Assisted Healthcare Management Platform**

> Developed as an internship and academic project using Next.js, React, FastAPI, Python, PostgreSQL, and Artificial Intelligence.
