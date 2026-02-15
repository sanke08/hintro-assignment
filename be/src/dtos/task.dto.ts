import { z } from "zod";

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  assignedById: z.string().nullable().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z
    .enum(["TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
    .default("TO_DO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("LOW"),
  dueDate: z.string().datetime().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  assignedById: z.string().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
