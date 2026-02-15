// Enums
export type ROLE = "ADMIN" | "MEMBER";
export type PRIORITY = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type STATUS = "TO_DO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type ENTITY_TYPE = "BOARD" | "LIST" | "TASK" | "MEMBER";
export type ACTION =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "JOINED"
  | "REMOVE"
  | "ROLE_CHANGED"
  | "TRASHED"
  | "RESTORED";

// Models
export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  members?: Member[];
  createdWorkspaces?: Workspace[];
  createdAt: string;
  updatedAt: string;
};

export type Member = {
  id: string;
  userId: string;
  workspaceId: string;
  user?: User;
  workspace: Workspace;
  role: ROLE;
  taskAssigned?: Task[];
  taskAssignedBy?: Task[];
  createdAt: string;
  updatedAt: string;
};

export type Workspace = {
  id: string;
  name: string;
  inviteCode: string;
  trash: boolean;
  creatorId: string;
  creator?: User;
  members?: Member[];
  boards?: Board[];
  auditLogs?: AuditLog[];
  createdAt: string;
  updatedAt: string;
};

export type Board = {
  id: string;
  title: string;
  trash: boolean;
  workspaceId: string;
  workspace?: Workspace;
  lists?: List[];
  createdAt: string;
  updatedAt: string;
};

export type List = {
  id: string;
  title: string;
  trash: boolean;
  boardId: string;
  board?: Board;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: PRIORITY;
  status: STATUS;
  trash: boolean;
  assigneeId?: string;
  assignee?: Member;
  assignedById?: string;
  assignedBy?: Member;
  listId: string;
  list?: List;
  createdAt: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  workspaceId: string;
  workspace?: Workspace;
  boardId?: string;
  listId?: string;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  userName: string;
  userImage: string;
  action: ACTION;
  changes?: Record<string, any>;
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};
