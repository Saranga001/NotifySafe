# 🔐 Secure Notification & Alerts Demo – Requirements Specification

## 1. Overview

This project is a **secure notification and alert demonstration web application**, inspired by real-world high-security environments such as **banking, finance, and enterprise systems**.  
The goal is to showcase **how authenticated access, privileged operations, multi-channel notifications, fallback mechanisms, analytics, and activity logging** work in actual production-grade systems.

---

## 2. Core Functional Requirements

### ✅ 2.1 Authentication System

- Implements **secure login with Multi-Factor Authentication (MFA)**.
- Supports **OTP verification** (email/SMS/Authenticator app).
- Every login activity must record:
  - Browser + device info
  - Timestamp
  - IP (if accessible through Firebase)
- Successful and failed login attempts should trigger email notifications.

---

### ✅ 2.2 User Roles

- **Guest/User (Non-privileged)**
  - Can view general homepage features.
  - Activities are logged.
- **Privileged User**
  - Can access restricted pages.
  - Can edit notification templates.
  - Can view privileged activity logs.
  - Receives additional security alerts.

---

### ✅ 2.3 Application Pages

1. **Homepage**

   - Publicly accessible (no login required).
   - Showcases the main simulation features of real-world notifications.

2. **Activity History Page (Privileged Only)**

   - Two types of logs:
     - Logs for **individual users/guests**
     - Global logs for **privileged activities** (system-wide)

3. **Analytics / Dashboard Page (Privileged Only)**
   - Visual summary of:
     - Notification delivery analytics
     - Failed vs successful delivery rate
     - Channels used (Email, SMS, In-App, etc.)
     - Fallback scenarios

---

## 3. Notification & Messaging Engine

### ✅ 3.1 Notification Types to Simulate

- Transaction alerts (credit, debit, failed transaction)
- Login, logout, failed login attempts
- Password changes
- Notification template edits
- Multi-factor authentication alerts
- Communication failure alerts

---

### ✅ 3.2 Template Editing

- Notification messages are editable **only by privileged users**.
- Templates should be version-controlled inside the database.

---

### ✅ 3.3 Multi-Channel Delivery + Fallback

- Supported channels:
  - Email
  - SMS (simulated)
  - In-App inbox (for authenticated users)

#### Fallback Rules:

1. **If primary channel fails**, system must:
   - Attempt secondary channel
   - Record fallback event
2. **If all channels fail**, system must:
   - Save notification in user’s in-app inbox
   - Record failure in logs

---

### ✅ 3.4 Event-Driven Notification System

- Notification triggers must be **event-driven**, such as:
  - “ACCOUNT_DEBITED”
  - “OTP_SENT”
  - “LOGIN_SUCCESS”
  - “PASSWORD_CHANGED”
- Every event should:
  - Carry metadata
  - Be labeled clearly
  - Reflect real-world banking notification flow

---

## 4. Activity Logging

### ⚡ 4.1 Logging Rules

- **Every action** must be logged:
  - Even for **non-authenticated users**
  - Including:
    - Browser type
    - Device information
    - Page visited
    - Timestamp

### ⚡ 4.2 Log Types

1. **User/Guest Log**

   - Tracks actions for each visitor (authenticated or not)

2. **Privileged Activity Log**
   - Tracks sensitive actions:
     - Template edits
     - Notification system changes
     - Access to restricted pages

---

## 5. Technology Stack

### 🎨 Frontend

- **React + Vite**
- **Tailwind CSS** for styling  
  Installation guide: https://tailwindcss.com/docs/installation/using-vite

### 🔥 Backend

- **Google Firebase (BaaS)**  
  Recommended services:
  - Firebase Authentication (for MFA + login)
  - Firestore (for logs, templates, inbox, events)
  - Firebase Functions (simulate notification engine)
  - Firebase Cloud Messaging (optional)

---

## 6. Additional Notes

- System should be structured to resemble a **real enterprise notification pipeline**, making it easy to demonstrate.
- Codebase should be modular and ready for future integration with:
  - External SMS API
  - Real email service
  - Real transaction data

---

## 7. Reference Documentation

- React Official Docs  
  https://react.dev/

- Vite Official Docs  
  https://vitejs.dev/guide/

- Firebase Documentation  
  https://firebase.google.com/docs

- Tailwind CSS with Vite  
  https://tailwindcss.com/docs/installation/using-vite

---
