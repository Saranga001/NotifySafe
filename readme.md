# NotifySafe - Multi-Channel Notification Delivery Simulator

A production-ready React + Appwrite web application that demonstrates how user-triggered events flow through a multi-channel notification delivery system in real-time. This project simulates event generation, template rendering, delivery attempts across SMS, Email, and In-App channels, with fallback handling and comprehensive analytics.

### Live Website: https://notifysafe.pages.dev/home

### Credentials

- email: `admin@notifysafe.com`
- password: `12345678`

## 🎯 Project Overview

NotifySafe is an **event-driven notification simulator** that shows the complete lifecycle of notifications:

1. **Event Triggering**: Users manually trigger predefined event types from the dashboard
2. **Template Rendering**: Events are matched with notification templates and rendered with dynamic variables
3. **Multi-Channel Delivery**: Notifications attempt delivery across 3 channels with configurable success rates:
   - **Email**: 85% success rate
   - **SMS**: 60% success rate
   - **In-App**: 100% success rate
4. **Fallback Logic**: Failed deliveries fall back to user inbox storage
5. **Real-Time Logging**: All delivery attempts and outcomes are tracked in Appwrite Database
6. **Analytics Dashboard**: Visualize delivery metrics, success rates, and channel breakdown

## ✨ Key Features

### Event Management

- **Pre-defined Event Types**:
  - `LOGIN_SUCCESS` - User authentication events
  - `ACCOUNT_DEBITED` - Financial transaction alerts
  - `PASSWORD_CHANGED` - Security notifications
  - `OTP_SENT` - Multi-factor authentication codes
- **Manual Event Triggering**: Skip user input forms; directly simulate events with one click
- **Event Type Selection**: Choose which event to trigger from the UI

### Multi-Channel Notification Delivery

- **Email Channel**: Simulated SMTP delivery (85% success)
- **SMS Channel**: Simulated SMS provider delivery (60% success)
- **In-App Channel**: Browser-based notifications (100% reliable)
- **Automatic Fallback**: Undelivered notifications stored in user inbox for later retrieval

### Template System

- **Versioned Templates**: Track template changes over time
- **Handlebars Syntax**: Support for dynamic variables (`{{username}}`, `{{amount}}`, etc.)
- **Template Editor**: Create and edit notification templates with version history
- **Built-in Templates**: 4 default templates for common events

### Activity & Monitoring

- **Activity Logs**: Complete audit trail of all notification events and delivery attempts
- **User Inbox**: Per-user message storage for failed or undelivered notifications
- **Real-time Synchronization**: Appwrite Database integration for live data updates
- **Timestamp Tracking**: Precise logging of all events with server timestamps

### Analytics Dashboard

- **KPI Cards**:
  - Total events triggered
  - Successful deliveries
  - Failed deliveries
  - Total delivery attempts
- **Delivery Rate Chart**: Success vs. failure pie chart
- **Channel Breakdown**: Bar chart showing delivery counts by channel (Email, SMS, In-App)
- **Event Type Distribution**: Bar chart of events by type (LOGIN_SUCCESS, ACCOUNT_DEBITED, etc.)
- **Real-time Data**: Charts update as events are triggered

### Authentication & Authorization

- **Appwrite Authentication**: Email/password signup and login with session management
- **Role-Based Access Control**:
  - `user` role: Access inbox, activity, dashboard
  - `privileged` role: Additional access to template editor
- **Protected Routes**: Client-side authorization guards
- **Session Management**: Persistent authentication with Appwrite

## 🛠 Tech Stack

| Layer               | Technology                           | Purpose                                   |
| ------------------- | ------------------------------------ | ----------------------------------------- |
| **Frontend**        | React 18 + Vite 7.2                  | Modern, fast UI with HMR                  |
| **Styling**         | Tailwind CSS (v4 @tailwindcss/vite)  | Utility-first CSS                         |
| **Routing**         | React Router 6                       | Client-side navigation & protected routes |
| **Backend**         | Appwrite (Auth, Database, Functions) | Open-source backend-as-a-service          |
| **Database**        | Appwrite Database                    | Real-time NoSQL document storage          |
| **Cloud Functions** | Appwrite Functions (Node.js)         | Server-side notification delivery engine  |
| **Notifications**   | React Hot Toast                      | In-app toast notifications                |
| **Testing**         | Vitest + React Testing Library       | Unit tests with jsdom environment         |

## 📦 Project Structure

```
NotifySafe/
├── src/
│   ├── pages/
│   │   ├── Login.jsx              # Appwrite Auth (signup/login)
│   │   ├── Home.jsx               # Welcome & event trigger UI
│   │   ├── Dashboard.jsx          # Analytics with Recharts
│   │   ├── Activity.jsx           # Event activity logs
│   │   ├── Inbox.jsx              # Per-user message inbox
│   │   └── TemplateEditor.jsx     # Template management & versioning
│   ├── components/
│   │   ├── Nav.jsx                # Navigation bar with auth state
│   │   └── ProtectedRoute.jsx     # Role-based route guards
│   ├── hooks/
│   │   └── useAuth.js             # Auth state management hook
│   ├── api/
│   │   ├── authService.js         # Appwrite Auth wrapper
│   │   ├── appwrite-backend.js    # Appwrite Database CRUD & Functions
│   │   ├── taskService.js         # Event delivery logic
│   │   └── defaultTemplates.json  # Default notification templates
│   ├── config.js                  # Appwrite configuration
│   ├── widgets/
│   │   └── NotificationSimulator.jsx  # Event trigger simulator
│   ├── test/
│   │   ├── setup.js               # Vitest setup & mocks
│   │   └── Login.test.jsx         # Sample component test
│   ├── styles/
│   │   └── index.css              # Tailwind imports
│   └── App.jsx                    # React Router setup
├── .env.sample                    # Environment variables template
├── .github/workflows/              # GitHub Actions pipeline
├── vitest.config.js               # Test configuration
├── vite.config.js                 # Vite + Tailwind config
└── package.json                   # Dependencies & scripts
```

## 🗄 Appwrite Database Schema

### Collections

**`notification_templates`**

```javascript
{
  $id: "LOGIN_SUCCESS",
  name: "Login Successful",
  subject: "Welcome back!",
  body: "Hi {{username}}, you logged in from {{device}}",
  userId: "user_123",
  $createdAt: "2025-12-10T...",
  $updatedAt: "2025-12-10T..."
}
```

**`activity_logs`**

```javascript
{
  $id: "log_xyz",
  userId: "user_123",
  eventType: "LOGIN_SUCCESS",
  channel: "email", // or "sms", "in-app"
  status: "DELIVERY_SUCCESS", // or "DELIVERY_FAILED"
  templateId: "LOGIN_SUCCESS",
  messageData: { attempt: 1, provider: "sendgrid", ... },
  $createdAt: "2025-12-10T...",
  $updatedAt: "2025-12-10T..."
}
```

**`inbox`**

```javascript
{
  $id: "msg_xyz",
  userId: "user_123",
  eventType: "ACCOUNT_DEBITED",
  subject: "Debit Alert",
  message: "Your account was debited $100",
  read: false,
  $createdAt: "2025-12-10T...",
  $updatedAt: "2025-12-10T..."
}
```

**`events`**

```javascript
{
  $id: "event_xyz",
  userId: "user_123",
  eventType: "LOGIN_SUCCESS",
  eventData: { device: "Chrome", ip: "192.168.1.1" },
  processed: true,
  $createdAt: "2025-12-10T...",
  $updatedAt: "2025-12-10T..."
}
```

## System Context Diagram

<img src="./public/system-context-diagram.png">

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite account (self-hosted or Cloud)
- Appwrite CLI (optional, for setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Saranga001/NotifySafe.git
   cd NotifySafe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Appwrite credentials**

   ```bash
   cp .env.sample .env
   ```

   Edit `.env` and add your Appwrite credentials:

   ```env
   VITE_APPWRITE_ENDPOINT=https://appwrite.example.com/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_TEMPLATES_COLLECTION_ID=your_templates_col_id
   VITE_APPWRITE_LOGS_COLLECTION_ID=your_logs_col_id
   VITE_APPWRITE_EVENTS_COLLECTION_ID=your_events_col_id
   VITE_APPWRITE_ACCOUNTS_COLLECTION_ID=your_accounts_col_id
   VITE_APPWRITE_INBOX_COLLECTION_ID=your_inbox_col_id
   VITE_APPWRITE_BUCKET_ID=your_bucket_id
   VITE_APPWRITE_FUNCTION_ID=your_function_id (optional)
   ```

### Running Locally

**Terminal 1: Start Dev Server**

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

**Using Appwrite Cloud or Self-Hosted**

The app connects directly to your Appwrite instance. No local emulator needed! Just ensure:

- Your Appwrite instance is accessible at the `VITE_APPWRITE_ENDPOINT`
- Database and collections are created with matching IDs
- Proper CORS settings in Appwrite for your dev URL

### Demo Login

Use any email and password (Appwrite will create the account on first use):

- **Email**: `demo@notifysafe.com`
- **Password**: `demo123456`

## 📊 How It Works

### Event Triggering Flow

```
1. User clicks "Trigger Event" button
   ↓
2. Frontend calls Appwrite Function: processNotification()
   ↓
3. Function renders template with event data
   ↓
4. Attempts delivery:
   • Email (85% success)
   • SMS (60% success)
   • In-App (100% success)
   ↓
5. Logs result to activity_logs collection
   ↓
6. If all fail, stores message in inbox collection
   ↓
7. Dashboard updates in real-time with new metrics
```

### Delivery Success Rates

| Channel | Success Rate | Fallback      |
| ------- | ------------ | ------------- |
| Email   | 85%          | Inbox         |
| SMS     | 60%          | Inbox         |
| In-App  | 100%         | (never fails) |

**Fallback Behavior**: If a notification fails on all channels, it's automatically saved to the user's inbox for later retrieval.

## 📱 Pages & Features

### Home Page

- Event type selector
- Manual event trigger buttons
- Quick stats (events this session)

### Dashboard (Analytics)

- KPI metrics (total events, success/failure rates)
- Delivery rate pie chart
- Channel breakdown bar chart
- Event type distribution chart
- Real-time updates as events trigger

### Activity Log

- Complete history of all notification delivery attempts
- Filters by event type, channel, status
- Timestamps and delivery details
- Pagination for large datasets

### Inbox

- Per-user message storage
- Displays failed or undelivered notifications
- Mark as read/unread
- Delete messages

### Template Editor

- View all notification templates
- Create custom templates with Handlebars syntax
- Track version history
- Test template rendering with sample data

## 🔐 Security Features

- **Appwrite Security Rules**: Role-based read/write access control
- **Protected Routes**: Client-side authorization checks
- **Appwrite Authentication**: Email/password with session management
- **No Sensitive Data in Frontend**: Functions and backend logic handle all delivery
- **Audit Logging**: All events logged to activity_logs for compliance

## 🌐 Environment Variables

| Variable                                | Purpose                     | Example                           |
| --------------------------------------- | --------------------------- | --------------------------------- |
| `VITE_APPWRITE_ENDPOINT`                | Appwrite API endpoint       | `https://appwrite.example.com/v1` |
| `VITE_APPWRITE_PROJECT_ID`              | Appwrite project ID         | `abc123xyz`                       |
| `VITE_APPWRITE_DATABASE_ID`             | Appwrite database ID        | `db_main`                         |
| `VITE_APPWRITE_TEMPLATES_COLLECTION_ID` | Templates collection ID     | `col_templates`                   |
| `VITE_APPWRITE_LOGS_COLLECTION_ID`      | Activity logs collection ID | `col_logs`                        |
| `VITE_APPWRITE_EVENTS_COLLECTION_ID`    | Events collection ID        | `col_events`                      |
| `VITE_APPWRITE_ACCOUNTS_COLLECTION_ID`  | Accounts collection ID      | `col_accounts`                    |
| `VITE_APPWRITE_INBOX_COLLECTION_ID`     | Inbox collection ID         | `col_inbox`                       |
| `VITE_APPWRITE_BUCKET_ID`               | File storage bucket ID      | `bucket_main`                     |
| `VITE_APPWRITE_FUNCTION_ID`             | (Optional) Function ID      | `func_process_notify`             |

## 🎓 Learning Resources

This project demonstrates:

- **Event-Driven Architecture**: User actions trigger backend processing
- **Multi-Channel Delivery**: Fallback patterns for reliability
- **Real-Time Analytics**: Appwrite Database + React for live dashboards
- **Appwrite Functions**: Server-side notification engine
- **Role-Based Access**: Protected routes and Appwrite permissions
- **Backend-as-a-Service**: Using Appwrite as a self-hosted Firebase alternative
- **Template Rendering**: Dynamic content generation

## 📝 Example Events

### LOGIN_SUCCESS

Triggered when user authenticates successfully.

```
Template: "Hi {{username}}, you logged in from {{device}}"
Channels: Email, SMS, In-App
```

### ACCOUNT_DEBITED

Triggered when funds are withdrawn.

```
Template: "Alert! Your account was debited {{amount}} on {{date}}"
Channels: Email, SMS (priority), In-App
```

### PASSWORD_CHANGED

Triggered when user updates password.

```
Template: "Your password was changed on {{timestamp}}"
Channels: Email, In-App
```

### OTP_SENT

Triggered for multi-factor authentication.

```
Template: "Your verification code: {{code}} (expires in 10 minutes)"
Channels: SMS, Email, In-App
```

## 🐛 Troubleshooting

### Appwrite Connection Issues

```bash
# Verify endpoint is accessible
curl https://your-appwrite-endpoint.com/v1/health

# Check environment variables are set correctly
cat .env
```

### Vite Dev Server Errors

```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Database Collections Not Found

```bash
# Ensure all collections exist in Appwrite:
# - notification_templates
# - activity_logs
# - inbox
# - events
# - accounts (for user data)

# Verify collection IDs match your .env file
```

### Authentication Not Working

- Ensure Appwrite Auth is enabled in your instance
- Check CORS settings allow your dev URL
- Verify project ID is correct in `.env`

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 References

- Check the [Appwrite Documentation](https://appwrite.io/docs)
- Review [React Router Guide](https://reactrouter.com/)
- See [Recharts Examples](https://recharts.org/examples)
- Explore [Appwrite Community](https://discord.gg/appwrite)

---

**Built with ❤️ by the [Saranga001](https://github.com/Saranga001/)**
