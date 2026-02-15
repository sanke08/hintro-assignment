import { db } from "../utils/db.js";
import { AppError } from "../utils/appError.js";
import {
  ACTION,
  ENTITY_TYPE,
  PRIORITY,
  ROLE,
  STATUS,
} from "../prisma/generated/prisma/enums.js";
import { io } from "../server.js";
import { findList } from "../repositories/list.repository.js";
import * as taskRepository from "../repositories/task.repository.js";
import { addAuditLog } from "./auditlog.service.js";

export const createTask = async ({
  title,
  listId,
  boardId,
  userId,
  workspaceId,
}: {
  title: string;
  listId: string;
  boardId: string;
  userId: string;
  workspaceId: string;
}) => {
  const list = await findList({ boardId, listId, userId, workspaceId });

  if (!list) throw new AppError("List not found", 404);

  if (list.trash) throw new AppError("List is trashed", 400);

  const task = await taskRepository.createTask({ title, listId });

  io.to(`board:${boardId}`).emit("task:created", task);

  addAuditLog({
    workspaceId: list.board.workspaceId,
    boardId: list.board.id,
    entityId: task.id,
    entityType: ENTITY_TYPE.TASK,
    entityTitle: task.title,
    action: ACTION.CREATE,
    userId: list.board.workspace.members[0]?.id || "",
    userName: list.board.workspace.members[0]?.user.name || "",
    userImage: list.board.workspace.members[0]?.user.avatar || "",
  });

  return task;
};

export const updateTask = async ({
  taskId,
  boardId,
  userId,
  workspaceId,
  listId,
  data,
}: {
  taskId: string;
  boardId: string;
  userId: string;
  workspaceId: string;
  listId: string;
  data: {
    title?: string | undefined;
    description?: string | undefined | null;
    status?: string | undefined;
    priority?: string | undefined;
    dueDate?: string | undefined | null;
    assigneeId?: string | undefined | null;
    assignedById?: string | undefined | null;
  };
}) => {
  const task = await taskRepository.getTask({
    taskId,
    boardId,
    userId,
    workspaceId,
    listId,
  });

  if (!task) throw new AppError("Task not found", 404);

  const updateData: any = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status as STATUS;
  if (data.priority !== undefined)
    updateData.priority = data.priority as PRIORITY;
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  if (data.assigneeId !== undefined) {
    updateData.assigneeId = data.assigneeId;
  }

  if (data.assignedById !== undefined) {
    updateData.assignedById = data.assignedById;
  }

  const updated = await db.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      list: {
        select: {
          board: {
            select: {
              id: true,
              workspace: {
                select: {
                  id: true,
                  members: {
                    select: {
                      id: true,
                      user: {
                        select: {
                          name: true,
                          avatar: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  io.to(`board:${boardId}`).emit("task:updated", updated);

  await db.auditLog.create({
    data: {
      workspaceId: workspaceId,
      boardId: updated.list.board.id,
      entityId: updated.id,
      entityType: ENTITY_TYPE.TASK,
      entityTitle: updated.title,
      action: ACTION.UPDATE,
      userId: updated.list.board.workspace.members[0]?.id || "",
      userName: updated.list.board.workspace.members[0]?.user.name || "",
      userImage: updated.list.board.workspace.members[0]?.user.avatar || "",
    },
  });

  return updated;
};

export const trashTask = async ({
  boardId,
  taskId,
  userId,
  workspaceId,
  listId,
}: {
  boardId: string;
  taskId: string;
  userId: string;
  workspaceId: string;
  listId: string;
}) => {
  const task = await taskRepository.trashTask({
    boardId,
    taskId,
    userId,
    workspaceId,
    listId,
  });
  io.to(`board:${boardId}`).emit("task:deleted", task);
  addAuditLog({
    workspaceId: workspaceId,
    boardId: boardId,
    entityId: task.id,
    entityType: ENTITY_TYPE.TASK,
    entityTitle: task.title,
    action: ACTION.TRASHED,
    userId: task.list.board.workspace.members[0]?.id || "",
    userName: task.list.board.workspace.members[0]?.user.name || "",
    userImage: task.list.board.workspace.members[0]?.user.avatar || "",
  });
  const { list, ...rest } = task;
  return rest;
};
export const restoreTask = async ({
  boardId,
  taskId,
  userId,
  workspaceId,
  listId,
}: {
  boardId: string;
  taskId: string;
  userId: string;
  workspaceId: string;
  listId: string;
}) => {
  const task = await taskRepository.restoreTask({
    boardId,
    taskId,
    userId,
    workspaceId,
    listId,
  });
  io.to(`board:${boardId}`).emit("task:created", task);
  addAuditLog({
    workspaceId: workspaceId,
    boardId: boardId,
    entityId: task.id,
    entityType: ENTITY_TYPE.TASK,
    entityTitle: task.title,
    action: ACTION.TRASHED,
    userId: task.list.board.workspace.members[0]?.id || "",
    userName: task.list.board.workspace.members[0]?.user.name || "",
    userImage: task.list.board.workspace.members[0]?.user.avatar || "",
  });
  const { list, ...rest } = task;
  return rest;
};

export const deleteTask = async ({
  taskId,
  boardId,
  userId,
}: {
  taskId: string;
  boardId: string;
  userId: string;
}) => {
  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      list: {
        include: { board: { include: { workspace: true } } },
      },
    },
  });

  if (!task) throw new AppError("Task not found", 404);

  const member = await db.member.findFirst({
    where: {
      userId,
      workspaceId: task.list.board.workspaceId,
      role: ROLE.ADMIN,
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });

  if (!member) throw new AppError("Not authorized", 403);

  const deleted = await db.task.delete({
    where: { id: taskId },
  });

  io.to(`board:${boardId}`).emit("task:deleted", deleted);

  addAuditLog({
    workspaceId: task.list.board.workspaceId,
    entityId: deleted.id,
    entityType: ENTITY_TYPE.TASK,
    entityTitle: deleted.title,
    action: ACTION.DELETE,
    userId: member.id,
    userName: member.user.name,
    userImage: member.user.avatar || "",
  });
};

export const getTask = async ({
  taskId,
  boardId,
  userId,
  workspaceId,
  listId,
}: {
  taskId: string;
  boardId: string;
  userId: string;
  workspaceId: string;
  listId: string;
}) => {
  return await taskRepository.getTask({
    taskId,
    boardId,
    userId,
    workspaceId,
    listId,
  });
};
