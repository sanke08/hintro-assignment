import { api } from "@/lib/axios";
import type { Member } from "@/lib/types";

export const createTask = async ({
  boardId,
  listId,
  workspaceId,
}: {
  boardId: string;
  listId: string;
  workspaceId: string;
}) => {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/tasks`,
    { title: "default" }
  );
  return data;
};

export type UpdateTaskParams = {
  taskId: string;
  boardId: string;
  listId: string;
  workspaceId: string;
  title?: string;
  description?: string | null;
  status?: "TO_DO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | undefined;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string | null;
  assigneeId?: string | null;
  assignedById?: string | null; // Added this field
};

export const updateTask = async ({
  taskId,
  boardId,
  listId,
  workspaceId,
  title,
  description,
  status,
  priority,
  dueDate,
  assigneeId,
  assignedById,
}: UpdateTaskParams) => {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/tasks/${taskId}`,
    {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate }),
      ...(assigneeId !== undefined && { assigneeId }),
      ...(assignedById !== undefined && { assignedById }), // Added this field
    }
  );
  return data;
};

export const trashTask = async ({
  taskId,
  boardId,
  listId,
  workspaceId,
}: {
  taskId: string;
  boardId: string;
  listId: string;
  workspaceId: string;
}) => {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/tasks/${taskId}/trash`
  );
  return data;
};

export const getTask = async ({
  taskId,
  boardId,
  workspaceId,
  listId,
}: {
  taskId: string;
  boardId: string;
  workspaceId: string;
  listId: string;
}) => {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/tasks/${taskId}`
  );
  return data.data;
};

export type GetMembersParams = {
  workspaceId: string;
};

export const getWorkspaceMembers = async ({
  workspaceId,
}: GetMembersParams): Promise<Member[]> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/members`);
  return data;
};
