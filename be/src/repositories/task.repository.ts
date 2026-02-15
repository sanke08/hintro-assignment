import { db } from "../utils/db.js";

export const createTask = async ({
  title,
  listId,
}: {
  title: string;
  listId: string;
}) => {
  return db.task.create({
    data: {
      title,
      listId,
    },
  });
};

export const getTask = async ({
  taskId,
  listId,
  boardId,
  workspaceId,
  userId,
}: {
  taskId: string;
  listId: string;
  boardId: string;
  workspaceId: string;
  userId: string;
}) => {
  return db.task.findUnique({
    where: {
      id: taskId,
      listId,
      list: {
        board: {
          id: boardId,
          workspace: { id: workspaceId, members: { some: { userId } } },
        },
      },
    },
    include: {
      assignedBy: {
        select: {
          user: {
            select: { name: true, avatar: true, email: true, id: true },
          },
        },
      },
      assignee: {
        select: {
          user: { select: { name: true, avatar: true, email: true, id: true } },
        },
      },
    },
  });
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
  return db.task.update({
    where: {
      id: taskId,
      listId,
      list: {
        board: {
          id: boardId,
          workspace: { id: workspaceId, members: { some: { userId } } },
        },
      },
    },
    include: {
      list: {
        select: {
          board: {
            select: {
              workspace: {
                select: {
                  members: {
                    where: { userId },
                    select: {
                      id: true,
                      user: { select: { name: true, avatar: true, id: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    data: {
      trash: true,
    },
  });
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
  return db.task.update({
    where: {
      id: taskId,
      listId,
      list: {
        board: {
          id: boardId,
          workspace: { id: workspaceId, members: { some: { userId } } },
        },
      },
    },
    include: {
      list: {
        select: {
          board: {
            select: {
              workspace: {
                select: {
                  members: {
                    where: { userId },
                    select: {
                      id: true,
                      user: { select: { name: true, avatar: true, id: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    data: {
      trash: false,
    },
  });
};
