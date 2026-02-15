# API Contract Documentation

This document outlines the API endpoints, their expected inputs, and response formats. All API endpoints are prefixed with `/api/v1`.

---

## 🔐 Authentication
**Base Path:** `/auth`

### 1. Register
- **URL**: `/register`
- **Method**: `POST`
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Success Response**: `201 Created` with JWT in cookie and `{ "token": "...", "data": { "user": { ... } } }`

### 2. Login
- **URL**: `/login`
- **Method**: `POST`
- **Body**: `{ "email": "string", "password": "string" }`
- **Success Response**: `200 OK` with JWT in cookie and `{ "token": "...", "data": { "user": { ... } } }`

### 3. Get Me
- **URL**: `/me`
- **Method**: `GET`
- **Auth**: Required
- **Success Response**: `200 OK` with `{ "data": { "user": { ... } } }`

### 4. Logout
- **URL**: `/logout`
- **Method**: `GET`
- **Success Response**: `200 OK` (Clears JWT cookie)

---

## 📂 Workspaces
**Base Path:** `/workspaces`

### 1. Create Workspace
- **URL**: `/`
- **Method**: `POST`
- **Body**: `{ "name": "string" }`
- **Success Response**: `201 Created`

### 2. List Workspaces
- **URL**: `/`
- **Method**: `GET`
- **Success Response**: `200 OK`

### 3. Get Workspace Trash
- **URL**: `/:workspaceId/trash`
- **Method**: `GET`
- **Details**: Fetches all trashed boards, lists, and tasks in the workspace.

### 4. Join Workspace
- **URL**: `/join`
- **Method**: `POST`
- **Body**: `{ "inviteCode": "string" }`

---

## 📊 Boards
**Base Path:** `/workspaces/:workspaceId/boards`

### 1. Create Board
- **URL**: `/`
- **Method**: `POST`
- **Body**: `{ "title": "string" }`

### 2. Get Board Details
- **URL**: `/:boardId`
- **Method**: `GET`
- **Details**: Includes nested lists and tasks.

### 3. Trash/Restore Board
- **URL**: `/:boardId/trash` or `/:boardId/restore`
- **Method**: `PATCH`

---

## 📑 Lists
**Base Path:** `/workspaces/:workspaceId/boards/:boardId/lists`

### 1. Create List
- **URL**: `/`
- **Method**: `POST`
- **Body**: `{ "title": "string" }`

### 2. Copy List
- **URL**: `/copy`
- **Method**: `POST`
- **Body**: `{ "listId": "string" }`

### 3. Trash/Restore List
- **URL**: `/:listId/trash` or `/:listId/restore`
- **Method**: `PATCH`

---

## ✅ Tasks
**Base Path:** `/workspaces/:workspaceId/boards/:boardId/lists/:listId/tasks`

### 1. Create Task
- **URL**: `/`
- **Method**: `POST`
- **Body**: `{ "title": "string" }`

### 2. Update Task
- **URL**: `/:taskId`
- **Method**: `PUT`
- **Body**: `{ "title": "?string", "description": "?string", "status": "?string", "priority": "?string", "dueDate": "?string", "assigneeId": "?string" }`

### 3. Get Task
- **URL**: `/:taskId`
- **Method**: `GET`

---

## 👥 Members & Audits
- **List Members**: `GET /workspaces/:workspaceId/members`
- **Change Role**: `PATCH /workspaces/:workspaceId/members/:memberId`
- **Get Audit Logs**: `GET /workspaces/:workspaceId/audits`

---

## 📡 Real-time Events (Socket.io)
Clients can join rooms based on board IDs to receive live updates:
- **Join Room**: `socket.emit("join-board", boardId)`
- **Events Emitted by Server**:
  - `task:created`, `task:updated`, `task:deleted`
  - `list:created`, `list:updated`, `list:deleted`
