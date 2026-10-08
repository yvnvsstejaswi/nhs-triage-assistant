# 🏗️ System Architecture

## Overview

The NHS Healthcare Appointment & Triage Assistant follows a modular full-stack architecture inspired by the digital healthcare services of the National Health Service (NHS). The system integrates appointment management, AI-assisted symptom assessment, healthcare support, and secure user management into a single platform.

The application follows a layered architecture where the frontend communicates with the backend through REST APIs. The backend handles business logic, authentication, appointment management, AI services, and database operations.

---

## System Architecture Diagram

```text
                           User
                              │
                              ▼
                 ┌─────────────────────────┐
                 │ Next.js Frontend (React)│
                 └─────────────────────────┘
                              │
                      REST API (HTTPS)
                              │
                              ▼
                ┌─────────────────────────┐
                │   FastAPI Backend       │
                └─────────────────────────┘
                              │
      ┌──────────────┬──────────────┬──────────────┬──────────────┐
      ▼              ▼              ▼              ▼
 Authentication  Appointment    AI Symptom     AI Healthcare
 (JWT Security)   Management      Checker        Assistant
                                      │
                                      ▼
                           Machine Learning Model
                                      │
                                      ▼
                            RAG Knowledge Base
                                      │
                                      ▼
                               Large Language Model

                              │
                              ▼
                    PostgreSQL Database
```

---

# Architecture Components

## 1. Frontend Layer

The frontend is developed using **Next.js (React)** and provides an interactive and responsive user interface for patients, doctors, and administrators.

### Responsibilities

- User Registration
- Login
- Appointment Booking
- Appointment History
- Doctor Dashboard
- Admin Dashboard
- AI Chat Interface

---

## 2. Backend Layer

The backend is developed using **FastAPI** and exposes REST APIs for communication between the frontend and backend services.

### Responsibilities

- Business Logic
- Appointment Management
- Authentication
- API Validation
- Database Operations
- AI Integration

---

## 3. Authentication Module

Secure authentication is implemented using **JWT (JSON Web Tokens)**.

### Features

- User Registration
- Secure Login
- Password Encryption
- Role-Based Access Control

---

## 4. Appointment Management Module

This module manages appointments between patients and doctors.

### Features

- Book Appointment
- Cancel Appointment
- Reschedule Appointment
- View Appointment History
- Doctor Availability

---

## 5. AI Symptom Checker

The AI Symptom Checker collects user symptoms and provides preliminary healthcare guidance using Machine Learning.

### Features

- Symptom Collection
- Risk Assessment
- Preliminary Recommendations

---

## 6. AI Healthcare Assistant

The AI Assistant uses Retrieval-Augmented Generation (RAG) to provide healthcare-related information and answer user queries.

### Features

- Healthcare Guidance
- Appointment Assistance
- General Health Information

---

## 7. Machine Learning Module

The Machine Learning module analyzes symptoms and supports disease risk prediction.

### Responsibilities

- Data Preprocessing
- Model Training
- Prediction
- Model Evaluation

---

## 8. Database Layer

The application uses **PostgreSQL** for secure data storage.

### Stores

- User Information
- Doctor Information
- Appointment Records
- AI Prediction Logs
- System Data

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js, React.js |
| Backend | FastAPI |
| Database | PostgreSQL |
| Authentication | JWT |
| Machine Learning | Scikit-learn, Pandas, NumPy |
| Generative AI | Retrieval-Augmented Generation (RAG), LLM |
| DevOps | Docker, GitHub Actions |

---

# Architecture Summary

The proposed architecture separates the presentation layer, backend services, artificial intelligence modules, and database into independent components. This modular design improves scalability, maintainability, security, and future extensibility while supporting efficient healthcare appointment management and AI-assisted symptom assessment.