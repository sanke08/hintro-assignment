import * as listRepo from "../repositories/list.repository.js";
import * as memberRepo from "../repositories/member.repository.js";
import { AppError } from "../utils/appError.js";
import { ENTITY_TYPE, ACTION } from "../prisma/generated/prisma/enums.js";
import { CopyListInput } from "../dtos/list.dto.js";
import { db } from "../utils/db.js";
import { io } from "../server.js";
import { addAuditLog } from "./auditlog.service.js";

export const copyList = async ({
  userId,
  data,
}: {
  userId: string;
  data: CopyListInput;
}) => {
  const list = await listRepo.findListWithCards({
    listId: data.listId,
    boardId: data.boardId,
    workspaceId: data.workspaceId,
  });
  if (!list) throw new AppError("List not found", 404);

  const member = await memberRepo.findMember({
    userId,
    workspaceId: data.workspaceId,
  });
  if (!member) throw new AppError("Not a member of workspace", 403);

  const newList = await listRepo.createListCopy({
    boardId: data.boardId,
    title: `${list.title} - Copy`,
    tasks: list.tasks.map((t) => ({
      title: t.title,
      description: t.description || "",
    })),
  });

  addAuditLog({
    workspaceId: data.workspaceId,
    entityId: newList.id,
    entityType: ENTITY_TYPE.LIST,
    entityTitle: newList.title,
    userId: userId,
    userName: member.user.name,
    userImage: member.user.avatar || "",
    action: ACTION.CREATE,
  });

  return newList;
};

export const trashList = async ({
  userId,
  listId,
  boardId,
  workspaceId,
}: {
  userId: string;
  listId: string;
  boardId: string;
  workspaceId: string;
}) => {
  const list = await listRepo.findList({
    listId,
    boardId,
    workspaceId,
    userId,
  });
  if (!list) throw new AppError("List not found", 404);

  await listRepo.updateListTrash({ listId, trash: true });
  io.to(`board:${boardId}`).emit("list:trashed", list);

  addAuditLog({
    workspaceId: list.board.workspaceId,
    boardId: list.boardId,
    entityId: list.id,
    entityType: ENTITY_TYPE.LIST,
    entityTitle: list.title,
    action: ACTION.TRASHED,
    userId: list.board.workspace.members[0]?.id || "",
    userName: list.board.workspace.members[0]?.user.name || "", // fetch once if needed
    userImage: list.board.workspace.members[0]?.user.avatar || "",
  });
};

export const restoreList = async ({
  userId,
  listId,
  boardId,
  workspaceId,
}: {
  userId: string;
  listId: string;
  boardId: string;
  workspaceId: string;
}) => {
  const list = await listRepo.findList({
    listId,
    boardId,
    userId,
    workspaceId,
  });
  if (!list) throw new AppError("List not found", 404);

  await listRepo.updateListTrash({ listId, trash: false });

  addAuditLog({
    workspaceId: list.board.workspaceId,
    boardId: list.boardId,
    entityId: list.id,
    entityType: ENTITY_TYPE.LIST,
    entityTitle: list.title,
    userId: list.board.workspace.members[0]?.id || "",
    userName: list.board.workspace.members[0]?.user.name!,
    userImage: list.board.workspace.members[0]?.user.avatar || "",
    action: ACTION.RESTORED,
  });
};

export const createList = async ({
  title,
  boardId,
  userId,
}: {
  title: string;
  boardId: string;
  userId: string;
}) => {
  const board = await db.board.findUnique({ where: { id: boardId } });
  if (!board) throw new AppError("Board not found", 404);

  const list = await db.list.create({
    data: {
      title,
      boardId,
    },
    include: {
      board: {
        select: {
          workspace: {
            select: {
              members: {
                where: { userId },
                select: {
                  id: true,
                  user: { select: { name: true, avatar: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  io.to(`board:${boardId}`).emit("list:created", list);

  addAuditLog({
    workspaceId: board.workspaceId,
    boardId: boardId,
    entityId: list.id,
    entityType: ENTITY_TYPE.LIST,
    entityTitle: list.title,
    action: ACTION.CREATE,
    userId: list.board.workspace.members[0]?.id || "",
    userName: list.board.workspace.members[0]?.user.name!, // fetch once if needed
    userImage: list.board.workspace.members[0]?.user.avatar || "",
  });

  return list;
};

export const updateList = async ({
  title,
  boardId,
  listId,
  userId,
  workspaceId,
}: {
  title: string;
  boardId: string;
  listId: string;
  userId: string;
  workspaceId: string;
}) => {
  const list = await db.list.findUnique({ where: { id: listId, boardId } });
  if (!list) throw new AppError("List not found", 404);

  const updated = await db.list.update({
    where: { id: listId, boardId },
    data: { title },
    include: {
      board: {
        select: {
          workspace: {
            select: {
              members: {
                where: { userId },
                select: {
                  id: true,
                  user: { select: { name: true, avatar: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  io.to(`board:${boardId}`).emit("list:updated", updated);

  addAuditLog({
    workspaceId,
    entityId: list.id,
    entityType: ENTITY_TYPE.LIST,
    entityTitle: updated.title,
    action: ACTION.UPDATE,
    userId: updated.board.workspace.members[0]?.id || "",
    userName: updated.board.workspace.members[0]?.user.name!, // fetch once if needed
    userImage: updated.board.workspace.members[0]?.user.avatar || "",
  });

  return updated;
};

export const deleteList = async ({
  boardId,
  listId,
  userId,
  workspaceId,
}: {
  boardId: string;
  listId: string;
  userId: string;
  workspaceId: string;
}) => {
  const list = await db.list.findUnique({ where: { id: listId } });
  if (!list) throw new AppError("List not found", 404);

  const deleted = await listRepo.deleteListById({ listId });

  io.to(`board:${boardId}`).emit("list:deleted", deleted);

  addAuditLog({
    workspaceId,
    entityId: list.id,
    entityType: ENTITY_TYPE.LIST,
    entityTitle: list.title,
    userId,
    userName: "snapshot",
    userImage: "",
    action: ACTION.DELETE,
  });
};
