# Frontend Architecture Documentation

This project follows a **Feature-Driven Architecture**, optimized for scalability, maintainability, and real-time collaboration. By grouping code by domain (e.g., `boards`, `tasks`, `auth`) rather than technical type, we ensure that as the application grows, developers can find and modify everything related to a specific feature in one place.

---

## 🏗️ Core Architectural Principles

### 1. Feature-Based Directory Structure
The application is organized under `src/features/`. Each subdirectory represents a distinct business domain and contains its own logic:

- **`api/`**: Axios-based service calls specific to the feature.
- **`components/`**: UI components that are only used within this feature.
- **`hooks/`**: Custom React Query hooks (`useQuery`, `useMutation`) for managing feature-specific server state.
- **`schemas/`**: Zod schemas for form validation and type safety.
- **`utils/`**: Helper functions specific to the domain.

### 2. Server State Management (TanStack Query)
We rely heavily on **React Query** for all asynchronous data fetching. This eliminates the need for complex global state managers (like Redux) for server data.

- **Query Keys**: Standardized keys (e.g., `["board", workspaceId, boardId]`) ensure consistent caching.
- **Cache Invalidation**: On successful mutations (creation, trashing, updates), we use `queryClient.invalidateQueries` to trigger automatic re-fetches, keeping the UI in sync with the database.

### 3. Real-time Synchronization (Socket.io)
For collaborative board editing, the application integrates **Socket.io**.
- Feature-specific hooks (like `useListSocket` and `useTaskSocket`) listen for server events.
- When an external update occurs (e.g., another user moves a card), the local React Query cache is updated or invalidated to reflect changes instantly without page reloads.

### 4. UI Component Strategy
- **Base Components**: Located in `src/components/ui`, these are primitive, reusable atoms (Buttons, Inputs, Dialogs) built using **Tailwind CSS** and **Shadcn UI**.
- **Business Components**: Located within each feature, these combine base components with business logic.
- **Styling**: Utility-first CSS via Tailwind ensures a design-consistent, responsive, and performant interface.

### 5. Type Safety & Validation
- **TypeScript**: Used strictly throughout the codebase to ensure interface consistency between the frontend and backend.
- **Zod**: Used for runtime validation of API responses and form inputs, protecting the app from malformed data.

---

## 📂 Project Structure Overview

```text
src/
├── app/               # App-wide providers, layouts, and global context
├── components/        # Global reusable UI components (shadcn/ui)
├── features/          # Domain-specific logic (THE CORE)
│   ├── auth/          # Login, Register, Middleware
│   ├── boards/        # Board creation, layout, and settings
│   ├── lists/         # Verticals within a board
│   ├── tasks/         # Individual task cards and details
│   └── trash/         # Soft-deleted items management
├── lib/               # Shared libraries (axios, queryClient, types)
└── main.tsx           # Entry point
```

---

## 🔄 Data Flow Example (Task Trashing)

1.  **UI Trigger**: User clicks "Trash" on a `TaskCard`.
2.  **Hook Execution**: `useTrashTask` mutation is called.
3.  **API Call**: Axios sends a `PATCH` request to `/tasks/:id/trash`.
4.  **Cache Invalidation**: On success, `onSuccess` triggers:
    - Invalidate `["board-lists"]`: Trashed task disappears from the board.
    - Invalidate `["trashed-items"]`: Trashed task appears in the Trash bin.
5.  **Re-render**: React Query automatically re-fetches the invalidated data, and the UI updates.
