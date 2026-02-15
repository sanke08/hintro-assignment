import { z } from "zod";

export const copyListSchema = z.object({
  listId: z.cuid(),
  boardId: z.cuid(),
  workspaceId: z.cuid(), // was orgId before
});

export const listIdSchema = z.object({
  listId: z.cuid(),
  workspaceId: z.cuid(),
  boardId: z.cuid(),
});

export type CopyListInput = z.infer<typeof copyListSchema>;
export type ListIdInput = z.infer<typeof listIdSchema>;
