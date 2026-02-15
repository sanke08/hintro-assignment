import * as boardRepo from "../repositories/board.repository.js";
import * as memberRepo from "../repositories/member.repository.js";
import { AppError } from "../utils/appError.js";
import { ROLE, ENTITY_TYPE, ACTION } from "../prisma/generated/prisma/enums.js";
import { UpdateBoardInput } from "../dtos/board.dto.js";
import { addAuditLog } from "./auditlog.service.js";

export const getBoards = async ({ name }: { name: string }) => {
  return boardRepo.findBoardsByName({ name });
};

export const getBoardsByWorkspaceId = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  return boardRepo.getBoardsByWorkspaceId({ workspaceId });
};

export const createBoard = async ({
  userId,
  title,
  workspaceId,
}: {
  userId: string;
  title: string;
  workspaceId: string;
}) => {
  const exist = await boardRepo.findBoardsByName({ name: title });
  if (exist.length > 0) throw new AppError("Board already exists", 400);

  const member = await memberRepo.findMember({ userId, workspaceId });
  if (!member) throw new AppError("Not authorized", 403);

  const board = await boardRepo.createBoard({ title, workspaceId });

  addAuditLog({
    workspaceId,
    boardId: board.id,
    entityId: board.id,
    entityTitle: board.title,
    entityType: ENTITY_TYPE.BOARD,
    action: ACTION.CREATE,
    userId: member.id,
    userName: member.user.name,
    userImage: member.user.avatar || "",
  });

  return board;
};

export const updateBoardService = async ({
  userId,
  title,
  workspaceId,
  boardId,
}: UpdateBoardInput & {
  userId: string;
  workspaceId: string;
  boardId: string;
}) => {
  const board = await boardRepo.updateBoard({
    boardId,
    title: title || "",
    workspaceId,
    userId,
  });

  addAuditLog({
    workspaceId: board.workspaceId,
    boardId: board.id,
    entityId: board.id,
    entityTitle: board.title,
    entityType: ENTITY_TYPE.BOARD,
    action: ACTION.UPDATE,
    userId: board.workspace.members[0]?.id || "",
    userName: board.workspace.members[0]?.user.name || "",
    userImage: board.workspace.members[0]?.user.avatar || "",
  });

  return board;
};

export const trashBoard = async ({
  userId,
  boardId,
  workspaceId,
}: {
  userId: string;
  boardId: string;
  workspaceId: string;
}) => {
  const board = await boardRepo.findBoardById({ boardId, workspaceId });
  if (!board) throw new AppError("Board not found", 404);

  const member = await memberRepo.findMember({
    userId,
    workspaceId: board.workspaceId,
  });
  if (!member || member.role === ROLE.MEMBER)
    throw new AppError("Not authorized", 403);

  await boardRepo.updateBoardTrash({ boardId, trash: true });

  addAuditLog({
    workspaceId: board.workspaceId,
    boardId: board.id,
    entityId: board.id,
    entityTitle: board.title,
    entityType: ENTITY_TYPE.BOARD,
    action: ACTION.TRASHED,
    userId: member.id,
    userName: member.user.name,
    userImage: member.user.avatar || "",
  });
};

export const restoreBoard = async ({
  userId,
  boardId,
  workspaceId,
}: {
  userId: string;
  boardId: string;
  workspaceId: string;
}) => {
  const board = await boardRepo.findBoardById({ boardId, workspaceId });
  if (!board) throw new AppError("Board not found", 404);

  const member = await memberRepo.findMember({
    userId,
    workspaceId: board.workspaceId,
  });
  if (!member || member.role === ROLE.MEMBER)
    throw new AppError("Not authorized", 403);

  await boardRepo.updateBoardTrash({ boardId, trash: false });

  addAuditLog({
    workspaceId: board.workspaceId,
    boardId: board.id,
    entityId: board.id,
    entityTitle: board.title,
    entityType: ENTITY_TYPE.BOARD,
    action: ACTION.RESTORED,
    userId: member.id,
    userName: member.user.name,
    userImage: member.user.avatar || "",
  });
};

export const deleteBoardService = async ({
  userId,
  boardId,
  workspaceId,
}: {
  userId: string;
  boardId: string;
  workspaceId: string;
}) => {
  const board = await boardRepo.findBoardById({ boardId, workspaceId });
  if (!board) throw new AppError("Board not found", 404);

  const member = await memberRepo.findMember({
    userId,
    workspaceId: board.workspaceId,
  });
  if (!member || member.role === ROLE.MEMBER)
    throw new AppError("Not authorized", 403);

  await boardRepo.deleteBoardById({ boardId });

  addAuditLog({
    workspaceId: board.workspaceId,
    boardId: board.id,
    entityId: board.id,
    entityTitle: board.title,
    entityType: ENTITY_TYPE.BOARD,
    action: ACTION.DELETE,
    userId: member.id,
    userName: member.user.name,
    userImage: member.user.avatar || "",
  });
};

export const getBoardsDetails = async ({
  userId,
  workspaceId,
  boardId,
}: {
  userId: string;
  workspaceId: string;
  boardId: string;
}) => {
  const board = await boardRepo.getBoardDetail({
    boardId,
    workspaceId,
    userId,
  });
  if (!board) throw new AppError("Board not found", 404);
  // const member = await memberRepo.findMember({ userId, workspaceId });
  // if (!member || member.role === ROLE.MEMBER)
  // throw new AppError("Not authorized", 403);
  return board;
};
