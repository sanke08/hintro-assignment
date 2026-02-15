import { db } from "../utils/db.js";
import { ACTION, ENTITY_TYPE } from "../prisma/generated/prisma/enums.js";

interface CreateLogInput {
  workspaceId: string;
  boardId?: string | undefined;

  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;

  action: ACTION;
  userId: string;
  userImage: string;
  userName: string;
}

export const createAuditLog = async ({ boardId, ...data }: CreateLogInput) => {
  return await db.auditLog.create({
    data: { ...data, boardId: boardId || null },
  });
};

export const getAudits = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  return await db.workspace.findUnique({
    where: {
      id: workspaceId,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      auditLogs: { orderBy: { createdAt: "desc" } },
    },
  });
};
