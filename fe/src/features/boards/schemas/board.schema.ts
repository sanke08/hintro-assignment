import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1, "Board title is required"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
