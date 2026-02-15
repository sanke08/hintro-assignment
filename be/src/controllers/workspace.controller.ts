import { type Request, type Response, type NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as workspaceService from "../services/workspace.service.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../dtos/workspace.dto.js";
import { AppError } from "../utils/appError.js";

export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = createWorkspaceSchema.safeParse(req.body);
    if (!validation.success) {
      const message =
        validation.error?.issues[0]?.message ||
        "Creating workspace failed Validation error";
      throw new AppError(message, 400);
    }

    const user = req.user as any;
    const workspace = await workspaceService.createWorkspace({
      userId: user.id,
      data: validation.data,
    });
    res.status(201).json({ status: "success", data: workspace });
  }
);

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const workspaces = await workspaceService.getMyWorkspaces(req.user.id);
  res.status(200).json({ status: "success", data: workspaces });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const validation = updateWorkspaceSchema.safeParse(req.body);
  if (!validation.success) {
    const message =
      validation.error?.issues[0]?.message ||
      "Updating workspace failed Validation error";
    throw new AppError(message, 400);
  }

  const workspace = await workspaceService.updateWorkspace({
    workspaceId: req.params.workspaceId as string,
    userId: req.user.id,
    data: validation.data,
  });
  res.status(200).json({ status: "success", data: workspace });
});

export const deleteWs = catchAsync(async (req: Request, res: Response) => {
  await workspaceService.deleteWorkspace({
    workspaceId: req.params.workspaceId as string,
    userId: req.user.id,
  });
  res.status(204).json({ status: "success", data: null });
});

export const get = catchAsync(async (req: Request, res: Response) => {
  const workspace = await workspaceService.getWorkspaceById({
    workspaceId: req.params.workspaceId as string,
    userId: req.user.id,
  });
  res.status(200).json({ status: "success", data: workspace });
});

export const getTrash = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params as { workspaceId: string };
  const userId = req.user.id;
  const workspaces = await workspaceService.getTrash({ workspaceId, userId });
  res.status(200).json({ status: "success", data: workspaces });
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const userId = req.user.id;
  const { search, status, priority, sortBy, sortOrder } = req.query as {
    search?: string | undefined;
    status?: string | undefined;
    priority?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
  };

  const tasks = await workspaceService.getTasks({
    workspaceId,
    userId,
    search,
    status,
    priority,
    sortBy,
    sortOrder,
  });
  res.status(200).json({ status: "success", data: tasks });
});

export const generateInviteLink = catchAsync(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user.id;
    const workspace = await workspaceService.generateInviteLink({
      workspaceId,
      userId,
    });
    res.status(200).json({ status: "success", data: workspace });
  }
);

export const getWorkspaceByInviteCode = catchAsync(
  async (req: Request, res: Response) => {
    const { inviteCode } = req.params as { inviteCode: string };
    const workspace = await workspaceService.getWorkspaceByInviteCode({
      inviteCode,
    });
    res.status(200).json({ status: "success", data: workspace });
  }
);
