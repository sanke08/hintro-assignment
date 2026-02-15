import { NextFunction, type Request, type Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as memberService from "../services/member.service.js";
import { AppError } from "../utils/appError.js";
import {
  updateMemberRoleSchema,
  joinWorkspaceSchema,
} from "../dtos/workspace.dto.js";
import { db } from "../utils/db.js";
import { ROLE } from "../prisma/generated/prisma/enums.js";

export const join = catchAsync(async (req: Request, res: Response) => {
  const validation = joinWorkspaceSchema.safeParse(req.body);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }

  // const workspaceId = req.params.workspaceId as string;
  const member = await memberService.joinWorkspace({
    // workspaceId,
    userId: req.user.id,
    inviteCode: validation.data.inviteCode,
  });
  res.status(201).json({ status: "success", data: member });
});

export const leave = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  await memberService.leaveWorkspace({ userId: req.user.id, workspaceId });
  res.status(204).json({ status: "success", data: null });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const memberId = req.params.memberId as string;
  await memberService.removeMember({
    actorId: req.user.id,
    workspaceId,
    targetMemberId: memberId,
  });
  res.status(204).json({ status: "success", data: null });
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const memberId = req.params.memberId as string;

  const validation = updateMemberRoleSchema.safeParse(req.body);
  if (!validation.success) {
    const message =
      validation.error?.issues[0]?.message || "updating Role Validation error";

    throw new AppError(message, 400);
  }

  const member = await memberService.updateRole({
    actorId: req.user.id,
    workspaceId,
    targetMemberId: memberId,
    newRole: validation.data.role,
  });
  res.status(200).json({ status: "success", data: member });
});

export const getWorkspaceMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params as { workspaceId: string };
    const userId = req.user!.id;

    // Verify user has access to this workspace
    const userMembership = await db.member.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!userMembership) {
      throw new AppError("Access denied", 403);
    }

    // Fetch all members of the workspace
    const members = await db.member.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(members);
  } catch (error) {
    next(error);
  }
};

export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params as { workspaceId: string };
    const { email, role = "MEMBER" } = req.body as {
      email: string;
      role?: ROLE;
    };
    const userId = req.user!.id;

    // Verify user is admin/owner of workspace
    const requesterMembership = await db.member.findFirst({
      where: {
        workspaceId,
        userId,
        role: {
          in: ["ADMIN"],
        },
      },
    });

    if (!requesterMembership) {
      throw new AppError("Only admins can add members", 403);
    }

    // Find user by email
    const targetUser = await db.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    // Check if already a member
    const existingMember = await db.member.findFirst({
      where: {
        workspaceId,
        userId: targetUser.id,
      },
    });

    if (existingMember) {
      throw new AppError("User is already a member", 400);
    }

    // Add member
    const member = await db.member.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatar: member.user.avatar,
      role: member.role,
      workspaceId: member.workspaceId,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId, memberId } = req.params as {
      workspaceId: string;
      memberId: string;
    };
    const { role } = req.body as { role: ROLE };
    const userId = req.user!.id;

    // Verify user is admin/owner
    const requesterMembership = await db.member.findFirst({
      where: {
        workspaceId,
        userId,
        role: {
          in: ["ADMIN"],
        },
      },
    });

    if (!requesterMembership) {
      throw new AppError("Only admins can update member roles", 403);
    }

    // Update member role
    const member = await db.member.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    res.json({ member });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId, memberId } = req.params as {
      workspaceId: string;
      memberId: string;
    };
    const userId = req.user!.id;

    // Verify user is admin/owner
    const requesterMembership = await db.member.findFirst({
      where: {
        workspaceId,
        userId,
        role: "ADMIN",
      },
    });

    if (!requesterMembership) {
      throw new AppError("Only admins can remove members", 403);
    }

    // Can't remove admin
    const targetMember = await db.member.findUnique({
      where: { id: memberId },
    });

    if (targetMember?.role === "ADMIN") {
      throw new AppError("Cannot remove admin", 400);
    }

    // Remove member
    await db.member.delete({
      where: { id: memberId },
    });

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    next(error);
  }
};
