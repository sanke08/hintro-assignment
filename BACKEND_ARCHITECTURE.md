# Backend Architecture Documentation

The backend is built with **Node.js**, **Express**, and **Prisma ORM**, following a robust **Layered Architecture**. This design ensures a clear separation of concerns, making the system easy to test, maintain, and scale.

---

## 🏗️ Core Architectural Layers

### 1. Route Layer (`src/routes/`)
Defines the API endpoints and maps them to specific controller methods. This layer is also responsible for applying route-level middlewares (e.g., authentication, role-based access control).

### 2. Controller Layer (`src/controllers/`)
Acts as the entry point for HTTP requests.
- **Responsibility**: Parses request parameters/body, validates them using **DTOs** (Data Transfer Objects), and delegates the business logic to the Service Layer.
- **Response**: sends the final HTTP response (success or error) back to the client.

### 3. Service Layer (`src/services/`)
The "Brain" of the application.
- **Responsibility**: Contains all business logic (e.g., authorization checks, complex calculations, orchestration between different data models).
- **Triggers**: It triggers supplementary actions like **Real-time emits** (via Socket.io) and **Audit logging**.
- **Interaction**: It never interacts with the request/response objects directly; instead, it consumes raw data and returns results or throws errors.

### 4. Repository Layer (`src/repositories/`)
An abstraction over the database.
- **Responsibility**: Contains logic for complex database queries and data persistence.
- **ORM**: Uses **Prisma** to interact with the PostgreSQL database. This layer keeps the Service Layer clean from low-level database implementation details.

---

## 🛠️ Key Technical Features

### 1. Real-time Communication (Socket.io)
Integrated directly into the **Service Layer**. When state changes occur (e.g., a task is moved or a list is created), the service emits an event to the specific room (usually `board:${boardId}`). This ensures that even if several people are working on the same board, they see updates instantly.

### 2. Database & ORM (Prisma)
- **Prisma Schema**: Central definition of the data model (`prisma/schema.prisma`).
- **Type Safety**: Prisma generates TypeScript types based on the schema, ensuring end-to-end type safety from the database to the service layer.

### 3. Error Handling
- **Global Error Middleware**: Catch-all handler (`src/middlewares/globalErrorHandler.ts`) that standardizes error responses.
- **AppError Class**: A custom utility used throughout the services to throw operational errors with specific status codes.

### 4. Audit Logging
Every major action (Create, Update, Delete, Trash) is recorded in an `auditLog` table. This is handled by a dedicated `auditlog.service.ts` which is called by other business services after successful operations.

---

## 📂 Project Structure Overview

```text
src/
├── controllers/      # Route handlers (Request/Response logic)
├── dtos/             # Validation logic and data schemas
├── middlewares/      # Auth, Error handling, and validation middlewares
├── prisma/           # Database schema and generated client
├── repositories/     # Data Access Layer (Prisma queries)
├── routes/           # API endpoint definitions
├── services/         # Business Logic Layer (THE CORE)
├── utils/            # Shared utilities (DB client, error helpers)
├── server.ts         # HTTP Server + Socket.io initialization
└── index.ts          # Application entry point
```

---

## 🔄 Request Lifecycle Example

1.  **Client Request**: `PATCH /api/v1/workspaces/1/boards/2/lists/3/tasks/4/trash`
2.  **Router**: Matches the route and checks the `protect` middleware for a valid JWT.
3.  **Controller**: Extracts IDs from the URL and calls `taskService.trashTask()`.
4.  **Service**: 
    - Checks if the user has permission to trash this task.
    - Calls `taskRepository.trashTask()` to update the database.
    - Emits `"task:deleted"` to the socket room `board:2`.
    - Creates an `AuditLog` entry.
5.  **Controller**: Returns a `200 OK` response to the client.
