import { ACTION, ENTITY_TYPE } from "../prisma/generated/prisma/enums.js";
import * as auditLogRepository from "../repositories/auditLog.repository.js";

export const addAuditLog = async ({
  workspaceId,
  boardId,
  entityId,
  entityType,
  entityTitle,
  action,
  userId,
  userName,
  userImage,
}: {
  workspaceId: string;
  boardId?: string;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
  userId: string;
  userName: string;
  userImage: string;
}) => {
  auditLogRepository
    .createAuditLog({
      workspaceId,
      boardId,
      entityId,
      entityType,
      entityTitle,
      action,
      userId,
      userName,
      userImage,
    })
    .catch((err) => {
      console.log(err);
      // Do further processing
    });
};

export const getAudits = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  return auditLogRepository.getAudits({ workspaceId, userId });
};
