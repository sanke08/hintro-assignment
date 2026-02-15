# Real-time Synchronization Strategy

This document explains how the application maintains a consistent and live state across multiple users working on the same board simultaneously.

---

## 🚀 Technology Stack
- **Engine**: [Socket.io](https://socket.io/) (WebSockets with polling fallback).
- **Backend**: Integrated into Express Service Layer.
- **Frontend**: Custom React Hooks and Context Provider.

---

## 🏗️ Architectural Overview

The synchronization logic follows a **"One-Way Source of Truth"** pattern:
1.  **Request**: A client initiates a change via a standard **REST API (HTTP)** call.
2.  **Persistence**: The backend updates the PostgreSQL database.
3.  **Propagation**: After a successful database update, the backend emits a Socket.io event to all clients currently viewing that board.
4.  **Reaction**: Clients receive the event and refresh their local UI state (via React Query invalidation).

---

## 📡 Connection & Room Management

### 1. The Global Provider (`SocketProvider`)
The application initializes a single socket connection when the user logs in. This connection is shared across all features via a React Context Provider.

### 2. Board Rooms
To prevent data leakage and save bandwidth, clients only receive updates for the board they are currently viewing.
- **Workflow**: 
  - When a user enters a Board page, the `useListSocket` hook emits a `join-board` event with the `boardId`.
  - The server adds that socket to a unique room: `board:${boardId}`.
  - When the user leaves the page or switches boards, the client emits `leave-board`, and the server removes them from the room.

---

## 🔄 Event Dictionary

### List Events
| Event Name | Source | Description |
| :--- | :--- | :--- |
| `list:created` | Server | Emitted when a new list is added to the board. |
| `list:updated` | Server | Emitted when a list title is changed. |
| `list:trashed` | Server | Emitted when a list is moved to the trash. |
| `list:deleted` | Server | Emitted when a list is permanently removed. |

### Task Events
| Event Name | Source | Description |
| :--- | :--- | :--- |
| `task:created` | Server | Emitted when a new task card is added to a list. |
| `task:updated` | Server | Emitted when a task is edited (title, priority, status, etc.). |
| `task:deleted` | Server | Emitted when a task is trashed or permanently deleted. |

---

## 🛠️ Frontend implementation (`useSocket` Hooks)

The application uses feature-specific hooks to handle socket events:

- **`useListSocket(boardId)`**:
  - Manages room joining/leaving.
  - Listens for `list:created` and `list:trashed`.
  - Triggers React Query invalidations for `["board-lists", boardId]`.

- **`useTaskSocket(listId)`**:
  - Listens for task-level changes.
  - Ensures that if User A updates a task, User B sees the updated card immediately without refreshing the page.

---

## 🛡️ Reliability & Resilience

- **Polling Fallback**: If WebSockets are blocked by a firewall, the system automatically falls back to HTTP long-polling.
- **Automatic Reconnection**: Socket.io handles dropped connections automatically.
- **Manual "Pull" as Backup**: Since every socket event triggers a React Query invalidation (which performs a standard HTTP `GET`), the system remains robust. Even if a socket event is missed, the next manual action by the user will synchronize the entire state.
