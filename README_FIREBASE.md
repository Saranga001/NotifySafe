# NotifySafe — Secure Notification & Alerts Demo

A production-grade, event-driven notification and alert system with **real Firebase integration**, **role-based access control**, **multi-channel delivery with fallback**, and comprehensive analytics.

## Features

✅ **Firebase Authentication** — Real MFA/OTP with Firebase Auth  
✅ **Firestore Backend** — Versioned templates, logs, user inbox  
✅ **Cloud Functions** — Server-side notification delivery simulation  
✅ **React Router** — Role-based route guards (guest/privileged)  
✅ **Multi-Channel Delivery** — Email, SMS, In-App with fallback  
✅ **Analytics Dashboard** — Charts for delivery rates and event breakdown  
✅ **Event-Driven** — Production-like event pipeline  
✅ **Local Emulator** — Full Firebase emulator suite for development  
✅ **Tests & CI/CD** — Vitest + GitHub Actions

---

## Tech Stack

**Frontend:** React 18 + Vite + React Router + Tailwind CSS  
**Backend:** Firebase (Auth, Firestore, Cloud Functions)  
**Testing:** Vitest + React Testing Library  
**CI/CD:** GitHub Actions

---

## Quick Start

### 1. Install Dependencies

```powershell
npm install
npm ci --prefix functions
```

### 2. Set Up Firebase

1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Auth, Firestore, Cloud Functions
3. Copy credentials from Project Settings

### 3. Create `.env.local`

```bash
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_USE_FIREBASE_EMULATOR=true
```

### 4. Run Development Server

```powershell
# Terminal 1
npm run dev

# Terminal 2 (optional)
firebase emulators:start --project=notifysafe-demo
```

---

## Architecture

**Pages:**

- `Home.jsx` — Landing page with event simulator
- `Login.jsx` — Firebase Auth + sign-up
- `Activity.jsx` — Firestore activity logs
- `DashboardFirebase.jsx` — Analytics with Recharts
- `TemplateEditor.jsx` — Edit versioned templates (privileged)
- `Inbox.jsx` — User messages from failed delivery fallback

**Lib:**

- `firebase.js` — Firebase SDK init & emulator config
- `firebase-auth.js` — Real MFA with Firebase Auth
- `firestore-backend.js` — Firestore operations + Cloud Functions calls

**Cloud Functions:**

- `deliverNotification()` — Multi-channel delivery with fallback
- `sendMfaOtp()` — Generate and store OTP
- `verifyMfaOtp()` — Validate OTP token

---

## Running Tests

```powershell
npm run test
npm run test:ui
```

---

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`):

1. Run tests on Node 18 & 20
2. Build check
3. Deploy to Firebase (main branch only)

---

## Firestore Collections

- `notification_templates` — Versioned message templates
- `activity_logs` — All events, deliveries, failures
- `user_inbox/{userId}/messages` — Fallback inbox
- `mfa_codes` — OTP storage for verification

---

## Deploy

```powershell
# Build
npm run build

# Deploy to Firebase
firebase deploy --project=notifysafe-demo
```

---

## Environment Variables

| Variable                            | Description                      |
| ----------------------------------- | -------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase API key                 |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Auth domain                      |
| `VITE_FIREBASE_PROJECT_ID`          | Project ID                       |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Storage bucket                   |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID                        |
| `VITE_FIREBASE_APP_ID`              | App ID                           |
| `VITE_USE_FIREBASE_EMULATOR`        | Use local emulators (true/false) |

---

**Happy notifying! 🚀**
