import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as taskService from "../services/task.service.js";
import { AppError } from "../utils/appError.js";
import { updateTaskSchema } from "../dtos/task.dto.js";

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const { title } = req.body;
  const { listId, boardId, workspaceId } = req.params;

  if (!title || !listId || !boardId || !workspaceId)
    throw new AppError(
      "Title, listId, boardId, and workspaceId are required",
      400
    );

  const task = await taskService.createTask({
    title,
    listId,
    boardId,
    workspaceId,
    userId: req.user.id,
  });

  res.status(201).json({ status: "success", data: task });
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId, boardId, workspaceId, listId } = req.params as {
    taskId: string;
    boardId: string;
    workspaceId: string;
    listId: string;
  };

  const validatedBody = updateTaskSchema.safeParse(req.body);

  if (!validatedBody.success) {
    throw new AppError(validatedBody.error.message, 400);
  }

  console.log({ ...validatedBody.data });

  const task = await taskService.updateTask({
    taskId,
    boardId,
    workspaceId,
    listId,
    userId: req.user.id,
    data: validatedBody.data,
  });

  res.status(200).json({ status: "success", data: task });
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId, boardId } = req.params;

  if (!taskId || !boardId)
    throw new AppError("TaskId, boardId are required", 400);

  await taskService.deleteTask({
    taskId,
    boardId,
    userId: req.user.id,
  });

  res.status(204).send();
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId, boardId, listId, workspaceId } = req.params as {
    taskId: string;
    boardId: string;
    listId: string;
    workspaceId: string;
  };
  const task = await taskService.getTask({
    taskId,
    boardId,
    userId: req.user.id,
    listId,
    workspaceId,
  });
  res.status(200).json({ status: "success", data: task });
});

export const trashTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId, boardId, workspaceId, listId } = req.params as {
    taskId: string;
    boardId: string;
    workspaceId: string;
    listId: string;
  };

  await taskService.trashTask({
    taskId,
    boardId,
    workspaceId,
    listId,
    userId: req.user.id,
  });
  res.status(204).send();
});

export const restoreTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId, boardId, workspaceId, listId } = req.params as {
    taskId: string;
    boardId: string;
    workspaceId: string;
    listId: string;
  };
  await taskService.restoreTask({
    taskId,
    boardId,
    workspaceId,
    listId,
    userId: req.user.id,
  });
  res.status(204).send({ status: "success" });
});
