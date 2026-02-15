import { catchAsync } from "../utils/catchAsync.js";
import * as boardService from "../services/board.service.js";
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdSchema,
  boardDetailSchema,
} from "../dtos/board.dto.js";
import { AppError } from "../utils/appError.js";

export const getBoards = catchAsync(async (req, res) => {
  const { workspaceId } = req.params as { workspaceId: string };
  if (!workspaceId) throw new AppError("Workspace ID is required", 400);
  const workspace = await boardService.getBoardsByWorkspaceId({
    workspaceId,
  });
  if (!workspace) throw new AppError("Workspace not found", 404);

  res.status(200).json({ status: "success", data: workspace });
});

export const createBoard = catchAsync(async (req, res) => {
  const { workspaceId } = req.params as { workspaceId: string };
  if (!workspaceId) throw new AppError("Workspace ID is required", 400);

  const validation = createBoardSchema.safeParse(req.body);

  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }
  const board = await boardService.createBoard({
    userId: req.user.id,
    title: validation.data.title,
    workspaceId,
  });
  res.status(201).json({ status: "success", data: board });
});

export const updateBoard = catchAsync(async (req, res) => {
  const { workspaceId, boardId } = req.params as {
    workspaceId: string;
    boardId: string;
  };
  const validation = updateBoardSchema.safeParse(req.body);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }
  const board = await boardService.updateBoardService({
    userId: req.user.id,
    workspaceId,
    title: validation.data.title,
    boardId,
  });
  res.status(200).json({ status: "success", data: board });
});

export const trashBoard = catchAsync(async (req, res) => {
  const { workspaceId } = req.params as { workspaceId: string };
  const validation = boardIdSchema.safeParse(req.params);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }
  await boardService.trashBoard({
    userId: req.user.id,
    boardId: validation.data.boardId,
    workspaceId: workspaceId,
  });
  res.status(200).json({ status: "success" });
});

export const restoreBoard = catchAsync(async (req, res) => {
  const { workspaceId } = req.params as { workspaceId: string };
  const validation = boardIdSchema.safeParse(req.params);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }
  await boardService.restoreBoard({
    userId: req.user.id,
    boardId: validation.data.boardId,
    workspaceId: workspaceId,
  });
  res.status(200).json({ status: "success" });
});

export const deleteBoard = catchAsync(async (req, res) => {
  const { workspaceId } = req.params as { workspaceId: string };
  const validation = boardIdSchema.safeParse(req.params);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }
  await boardService.deleteBoardService({
    userId: req.user.id,
    boardId: validation.data.boardId,
    workspaceId: workspaceId,
  });
  res.status(204).send();
});

export const getBoardDetails = catchAsync(async (req, res) => {
  const validation = boardDetailSchema.safeParse(req.params);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }
  const board = await boardService.getBoardsDetails({
    boardId: validation.data.boardId,
    workspaceId: validation.data.workspaceId,
    userId: req.user.id,
  });
  const { workspace, ...rest } = board;
  res.status(200).json({
    status: "success",
    data: { member: workspace.members[0], board: { ...rest } },
  });
});
