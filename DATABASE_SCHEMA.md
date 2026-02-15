# Database Schema Documentation

<img width="1355" height="965" alt="Screenshot 2026-02-16 025050" src="https://github.com/user-attachments/assets/cab67fd3-c2d1-4076-907b-40a0478c95b6" />

---

## 🛠️ Prisma Schema Details

The core of our database design is defined using Prisma ORM. 

- **Prisma Schema Path**: `be/src/prisma/schema.prisma`
- **Database Engine**: PostgreSQL

---

## 🏗️ Core Entities & Relationships

### 1. User (`User`)
The central identity of the system.
- **Email**: Unique login identifier.
- **Relationships**: 
  - Owns multiple `Workspace` (as creator).
  - Can be a `Member` of many Workspaces.

### 2. Workspace (`Workspace`)
The top-level container for collaboration.
- **Invite Code**: A unique generated string used for adding new members.
- **Trash**: Soft-delete flag for the entire workspace.
- **Relationships**:
  - One `Creator` (User).
  - Many `Members`.
  - Many `Boards`.
  - Many `AuditLogs`.

### 3. Member (`Member`)
The bridge between Users and Workspaces, handling permissions and assignments.
- **Role**: `ADMIN` or `MEMBER`.
- **Relationships**:
  - Belongs to one `User` and one `Workspace`.
  - Can be an `Assignee` for many Tasks.
  - Can be the `Assigner` for many Tasks.

### 4. Board (`Board`)
The primary project board within a workspace.
- **Trash**: Soft-delete flag.
- **Relationships**:
  - Belongs to one `Workspace`.
  - Contains many `Lists`.

### 5. List (`List`)
Vertical columns within a board.
- **Trash**: Soft-delete flag.
- **Relationships**:
  - Belongs to one `Board`.
  - Contains many `Tasks`.

### 6. Task (`Task`)
The granular unit of work.
- **Priority**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
- **Status**: `TO_DO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`.
- **Trash**: Soft-delete flag.
- **Relationships**:
  - Belongs to one `List`.
  - Optional `Assignee` (Member).
  - Optional `AssignedBy` (Member).

### 7. Audit Log (`AuditLog`)
A historical record of all actions for accountability.
- **Entity Type**: `BOARD`, `LIST`, `TASK`, `MEMBER`.
- **Action**: `CREATE`, `UPDATE`, `DELETE`, `TRASHED`, `RESTORED`, etc.
- **Relationships**:
  - Belongs to one `Workspace`.

---

## 🔄 Soft Deletion (Trash Pattern)
Most major entities (`Workspace`, `Board`, `List`, `Task`) include a `trash` boolean field. 
- When `trash: true`, the item is hidden from the main UI but retained in the database.
- Items can be **Restored** (setting `trash: false`) or **Permanently Deleted** via the Trash interface.

