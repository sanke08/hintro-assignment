import { db } from "../utils/db.js";
import { ROLE } from "../prisma/generated/prisma/enums.js";

export const addMember = async ({
  workspaceId,
  userId,
  role,
}: {
  workspaceId: string;
  userId: string;
  role: ROLE;
}) => {
  return await db.member.create({
    data: {
      workspaceId,
      userId,
      role,
    },
    include: {
      user: true,
    },
  });
};

export const findMember = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  return await db.member.findFirst({
    where: {
      workspaceId,
      userId,
    },
    include: {
      user: true,
    },
  });
};

export const findMemberById = async ({ id }: { id: string }) => {
  return await db.member.findUnique({
    where: { id },
    include: { user: true },
  });
};

export const updateMemberRole = async ({
  id,
  role,
}: {
  id: string;
  role: ROLE;
}) => {
  return await db.member.update({
    where: { id },
    data: { role },
    include: { user: true },
  });
};

export const removeMember = async ({ id }: { id: string }) => {
  return await db.member.delete({
    where: { id },
    include: { user: true }, // Return info for logs
  });
};
