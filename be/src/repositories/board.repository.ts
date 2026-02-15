import { ROLE } from "../prisma/generated/prisma/enums.js";
import { db } from "../utils/db.js";

export const findBoardsByName = ({ name }: { name: string }) => {
  return db.board.findMany({
    where: { title: { startsWith: name } },
  });
};

export const getBoardsByWorkspaceId = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  return db.workspace.findFirst({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      boards: { where: { trash: false }, select: { id: true, title: true } },
    },
  });
};

export const findBoardById = ({
  boardId,
  workspaceId,
}: {
  boardId: string;
  workspaceId: string;
}) => {
  return db.board.findUnique({
    where: { id: boardId, workspaceId },
    include: { workspace: true },
  });
};

export const createBoard = ({
  title,
  workspaceId,
}: {
  title: string;
  workspaceId: string;
}) => {
  return db.board.create({
    data: { title, workspaceId },
  });
};

export const updateBoard = ({
  boardId,
  title,
  userId,
  workspaceId,
}: {
  boardId: string;
  userId: string;
  workspaceId: string;
  title?: string;
}) => {
  const updateData: Record<string, any> = {};
  if (title !== undefined) updateData.title = title;

  // If nothing to update, throw an error
  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields provided to update");
  }

  return db.board.update({
    where: {
      id: boardId,
      workspace: {
        id: workspaceId,
        members: { some: { userId, role: { in: [ROLE.ADMIN] } } },
      },
    },
    select: {
      title: true,
      id: true,
      workspaceId: true,
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
    data: updateData,
  });
};

export const updateBoardTrash = ({
  boardId,
  trash,
}: {
  boardId: string;
  trash: boolean;
}) => {
  return db.board.update({
    where: { id: boardId },
    data: { trash },
  });
};

export const deleteBoardById = ({ boardId }: { boardId: string }) => {
  return db.board.delete({ where: { id: boardId } });
};

export const getBoardDetail = ({
  boardId,
  workspaceId,
  userId,
}: {
  boardId: string;
  workspaceId: string;
  userId: string;
}) => {
  return db.board.findUnique({
    where: { id: boardId, workspaceId, trash: false },
    include: {
      lists: {
        where: { trash: false },
        include: {
          tasks: { where: { trash: false }, select: { id: true, title: true } },
        },
      },
      workspace: {
        select: {
          members: { where: { userId: userId } },
        },
      },
    },
  });
};
