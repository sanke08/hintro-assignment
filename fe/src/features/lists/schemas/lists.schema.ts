import { z } from "zod";

export const createListSchema = z.object({
  title: z
    .string()
    .min(1, "List title is required")
    .max(50, "List title is too long"),
  boardId: z.cuid(),
  workspaceId: z.cuid(),
});

export type CreateListInput = z.infer<typeof createListSchema>;

export const updateListSchema = z.object({
  listId: z.cuid(),
  title: z.string().min(1).max(50),
  boardId: z.cuid(),
  workspaceId: z.cuid(),
});

export type UpdateListInput = z.infer<typeof updateListSchema>;
