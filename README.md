# Collaborative Task Manager

A powerful, real-time collaborative task management application built with the PERN stack (PostgreSQL, Express, React, Node.js) and powered by Socket.io for seamless team coordination.

## 🚀 Project Overview

The Collaborative Task Manager is designed to streamline team productivity. It allows users to create workspaces, manage projects through boards, organize tasks into lists, and collaborate in real-time with team members. With feature-rich task cards, audit logs, and a built-in notification system, it provides a comprehensive solution for project management.

## 🛠️ Tech Stack

### Frontend

- **React 19** with **TypeScript**
- **Vite** for fast development and bundling
- **Tailwind CSS 4** for modern, responsive styling
- **Shadcn/UI** & **Radix UI** for accessible, premium components
- **Redux Toolkit** for global state management
- **React Query** for efficient data fetching and caching
- **React Hook Form** with **Zod** for robust form validation
- **Socket.io-client** for real-time updates
- **Lucide React** for beautiful icons

### Backend

- **Node.js** & **Express** (ES Modules)
- **TypeScript** for type safety
- **Prisma ORM** with **PostgreSQL**
- **Socket.io** for real-time bidirectional communication
- **JWT** for secure authentication
- **Bcryptjs** for password hashing
- **Zod** for API request validation

## 🏗️ Architecture

The project follows a modern, scalable architecture. Detailed documentation for each layer is available below:

- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.MD)
- [API Contract Design](./API_CONTRACT.md)
- [Real-time Sync Strategy](./REALTIME_STRATEGY.md)
- [Scalability Considerations](./SCALABILITY.md)

### Backend Structure (MVC-ish)

- **Controllers**: Handle incoming HTTP requests and responses.
- **Services**: Contain business logic and interact with repositories.
- **Repositories**: Direct interaction with the database via Prisma.
- **Routes**: Define API endpoints and apply middleware.
- **Middlewares**: Handle authentication, logging, and error handling.
- **Prisma**: Schema definition and database migration.

### Frontend Structure (Feature-based)

- **Features**: Modularized code grouped by functionality (e.g., `auth`, `boards`, `tasks`).
- **Components**: Shared UI components.
- **Store**: Redux store configuration and slices.
- **App/Layout**: Layout wrappers for different sections of the app.
- **Lib**: Third-party library configurations (e.g., Axios instance).

## ⚡ Real-time Features (Socket.io)

The application leverages **Socket.io** to provide a "Google Docs"-like collaboration experience:

- **Live Board Updates**: Any changes to lists or tasks (creation, movement, updates) are reflected instantly for all users viewing the board.
- **Room Management**: Users are grouped into rooms based on the `boardRef` they are currently viewing, ensuring updates are targeted and efficient.

## ✨ Features

- **Auth System**: Secure signup, login, and profile management.
- **Workspace Management**: Create multiple workspaces and invite members via unique invite codes.
- **Dynamic Boards**: Visual boards to organize project phases.
- **Organized Lists**: Categorize tasks into custom lists (e.g., "To Do", "In Progress", "Done").
- **Advanced Task Cards**:
  - Priority levels (Low, Medium, High, Urgent).
  - Status tracking.
  - Due dates.
  - Assignees.
  - Detailed descriptions.
- **Audit Logs**: Detailed history of all activities within a workspace (Who did what and when).
- **Trash & Recovery**: Safely delete items and restore them from the trash if needed.
- **Advanced Task Search & Filtering**:
  - Search tasks by title or description.
  - Filter by Status and Priority.
  - Sort by Creation Date, Due Date, Priority, or Title.
  - **URL Persistence**: Filters are stored in URL search parameters, ensuring they persist across unmounts and are easily shareable.
- **Member Management**: Role-based access (Admin/Member) and workspace invitation system.

## 📡 API Documentation

### Auth

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate user and get token.
- `GET /api/auth/me`: Get current user details.

### Workspaces

- `GET /api/workspaces`: List user's workspaces.
- `POST /api/workspaces`: Create a new workspace.
- `PATCH /api/workspaces/:workspaceId`: Update workspace settings.
- `GET /api/workspaces/:workspaceId/audit-logs`: Get activity history.

### Boards

- `GET /api/workspaces/:workspaceId/boards`: Get boards in a workspace.
- `POST /api/workspaces/:workspaceId/boards`: Create a board.
- `PATCH /api/boards/:boardId`: Update board details.

### Lists & Tasks

- `POST /api/boards/:boardId/lists`: Add a new list.
- `POST /api/lists/:listId/tasks`: Add a task to a list.
- `PATCH /api/tasks/:taskId`: Edit task properties.
- `DELETE /api/tasks/:taskId`: Move task to trash.

## 🛣️ Frontend Routes

- `/auth`: Login/Signup page.
- `/`: Home/Dashboard.
- `/:workspaceId`: Workspace dashboard.
- `/:workspaceId/boards/:boardId`: Individual board view (Collaboration canvas).
- `/:workspaceId/members`: Member management.
- `/:workspaceId/settings`: Workspace settings.
- `/:workspaceId/audits`: Activity logs.
- `/:workspaceId/trash`: View and restore deleted items.
- `/:workspaceId/:inviteCode`: Page to join a workspace via invite link.

## 🛠️ How to Start

### Prerequisites

- Node.js (v18+)
- pnpm (Recommended)
- PostgreSQL database

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sanke08/hintro-assignment.git
   cd hintro-assignment
   ```

2. **Backend Setup**:

   ```bash
   cd be
   pnpm install
   # Create .env with DATABASE_URL, JWT_SECRET, PORT
   npx prisma generate
   npx prisma db push
   pnpm dev
   ```

3. **Frontend Setup**:

   ```bash
   cd fe
   pnpm install
   # Create .env with VITE_API_URL
   pnpm dev
   ```

4. **Access the App**:
   Open `http://localhost:5173` in your browser.

---

## 💡 Assumptions & Trade-offs

1. **Soft Deletion**: For a task manager, user error (accidental deletion) is common. We implemented a "Trash" pattern for all major entities (Workspaces, Boards, Lists, Tasks) instead of hard deletion to allow for recovery and audit trail persistence.
2. **State Management**: We prioritized **React Query** over Redux for server-related state. This reduces boilerplate and ensures the UI is always in sync with the backend through standardized cache invalidation patterns.
3. **Optimistic Updates**: While some actions use optimistic UI, most rely on the invalidation pattern triggered by successful API/Socket callbacks. This ensures data integrity in a multi-user environment where race conditions could occur.
4. **Auth Flow**: We chose HttpOnly cookies for JWT storage to protect against XSS attacks, sacrificing slightly easier client-side token access for significantly better security.

## 🔑 Demo Credentials

To test the application without creating a new account:
- **Email**: `test@example.com`
- **Password**: `password123`

*(Alternatively, you can register a new account instantly.)*

---

Built with ❤️ for teams that move fast.
