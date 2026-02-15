import * as workspaceRepository from "../repositories/workspace.repository.js";
import * as memberRepository from "../repositories/member.repository.js";
import {
  type CreateWorkspaceInput,
  type UpdateWorkspaceInput,
} from "../dtos/workspace.dto.js";
import { AppError } from "../utils/appError.js";
import { ROLE } from "../prisma/generated/prisma/enums.js";
import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";

const generateRandomeCode = () => {
  const randomNumber: number = Math.floor(Math.random() * 1000000);
  const link = jwt.sign({ randomNumber }, "SECRET_TOKEN");
  return link;
};
export const createWorkspace = async ({
  userId,
  data,
}: {
  userId: string;
  data: CreateWorkspaceInput;
}) => {
  // Logic from nextjs: generate invite link (mocked or real)
  const inviteCode = generateRandomeCode();

  // Create workspace
  const workspace = await workspaceRepository.createWorkspace({
    creatorId: userId,
    data,
    inviteCode,
  });

  // Add creator as Admin
  await memberRepository.addMember({
    workspaceId: workspace.id,
    userId,
    role: ROLE.ADMIN,
  });

  return workspace;
};

export const getMyWorkspaces = async (userId: string) => {
  return await workspaceRepository.findWorkspacesByUserId({ userId });
};

export const updateWorkspace = async ({
  workspaceId,
  userId,
  data,
}: {
  workspaceId: string;
  userId: string;
  data: UpdateWorkspaceInput;
}) => {
  // Check if user is admin or member (logic from nextjs wasn't strict on role for update, but assuming Admin)
  const member = await memberRepository.findMember({ workspaceId, userId });
  if (!member || member.role !== ROLE.ADMIN) {
    throw new AppError("Not authorized to update workspace", 403);
  }

  return await workspaceRepository.updateWorkspace({ id: workspaceId, data });
};

export const deleteWorkspace = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  const member = await memberRepository.findMember({ workspaceId, userId });
  if (!member || member.role !== ROLE.ADMIN) {
    throw new AppError("Not authorized", 403);
  }
  return await workspaceRepository.deleteWorkspace({ id: workspaceId });
};

export const getWorkspaceById = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  return await workspaceRepository.findWorkspaceById({
    id: workspaceId,
    userId,
  });
};

export const getTrash = async ({
  userId,
  workspaceId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  return await workspaceRepository.findTrash({
    id: workspaceId,
    userId,
  });
};

export const getTasks = async ({
  workspaceId,
  userId,
  search,
  status,
  priority,
  sortBy,
  sortOrder,
}: {
  workspaceId: string;
  userId: string;
  search?: string | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}) => {
  return await workspaceRepository.findTasks({
    id: workspaceId,
    userId,
    search,
    status,
    priority,
    sortBy,
    sortOrder,
  });
};

export const generateInviteLink = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  const inviteCode = generateRandomeCode();

  return await db.workspace.update({
    where: { id: workspaceId, members: { some: { userId, role: ROLE.ADMIN } } },
    data: { inviteCode },
  });

  // return await workspaceRepository.updateWorkspace({
  //   id: workspaceId,
  //   data: { inviteCode },
  // });
};

export const getWorkspaceByInviteCode = async ({
  inviteCode,
}: {
  inviteCode: string;
}) => {
  return await workspaceRepository.findWorkspaceByInviteCode({ inviteCode });
};
