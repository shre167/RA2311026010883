# CampusNotify - Frontend Notification System

A modern, responsive React application built with Vite and Material UI to manage and display campus notifications.

## 🚀 Features

- **All Notifications**: View a paginated list of all notifications from the campus.
- **Priority Inbox**: Smart inbox that displays the top "n" unread notifications, prioritized by type (Placement > Result > Event) and recency.
- **Filtering**: Filter notifications by type (Event, Result, Placement).
- **Read/Unread Tracking**: Visually distinguish between new and viewed notifications.
- **Responsive Design**: Optimized for both desktop and mobile viewing.
- **Modern UI**: Styled using Material UI for a premium, clean aesthetic.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 8
- **Styling**: Material UI (MUI) 9
- **Routing**: React Router 7
- **State Management**: React Hooks (Custom `useReadState` for persistence)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd notification_app_fe
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

## 🔌 API Integration

The application integrates with the following endpoint:
`http://20.207.122.201/evaluation-service/notifications`

It supports:
- Pagination (`page`, `limit`)
- Filtering (`notification_type`)

## 🏗️ Project Structure

- `src/api`: API service and mock data fallback.
- `src/components`: Reusable UI components (e.g., NotificationCard).
- `src/hooks`: Custom hooks for state management.
- `src/pages`: Main application pages (All Notifications, Priority Inbox).
- `src/App.tsx`: Main routing and theme configuration.
