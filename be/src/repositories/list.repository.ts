import { db } from "../utils/db.js";

export const findListWithCards = ({
  listId,
  boardId,
  workspaceId,
}: {
  listId: string;
  boardId: string;
  workspaceId: string;
}) => {
  return db.list.findFirst({
    where: {
      id: listId,
      boardId,
      board: { workspaceId },
    },
    include: { tasks: true },
  });
};

export const createListCopy = ({
  boardId,
  title,
  tasks,
}: {
  boardId: string;
  title: string;
  tasks: { title: string; description: string }[];
}) => {
  return db.list.create({
    data: {
      boardId,
      title,
      tasks: { createMany: { data: tasks } },
    },
    include: { tasks: true },
  });
};

export const findList = ({
  listId,
  boardId,
  workspaceId,
  userId,
}: {
  listId: string;
  boardId: string;
  workspaceId: string;
  userId: string;
}) => {
  return db.list.findUnique({
    where: {
      id: listId,
      boardId,
      board: { workspaceId, workspace: { members: { some: { userId } } } },
    },
    include: {
      board: {
        include: {
          workspace: {
            include: {
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
};

export const updateListTrash = ({
  listId,
  trash,
}: {
  listId: string;
  trash: boolean;
}) => {
  return db.list.update({
    where: { id: listId },
    data: { trash },
  });
};

export const deleteListById = ({ listId }: { listId: string }) => {
  return db.list.delete({ where: { id: listId } });
};
