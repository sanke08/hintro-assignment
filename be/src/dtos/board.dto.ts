import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1),
});

export const updateBoardSchema = z.object({
  // id: z.string().uuid(),
  title: z.string().optional(),
  // imageUrl: z.string().optional(),
});

export const boardIdSchema = z.object({
  boardId: z.cuid(),
});

export const boardDetailSchema = z.object({
  boardId: z.cuid(),
  workspaceId: z.cuid(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type BoardIdInput = z.infer<typeof boardIdSchema>;
export type BoardDetailInput = z.infer<typeof boardDetailSchema>;
