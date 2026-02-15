import { api } from "@/lib/axios";
import type { Board, List, Task } from "@/lib/types";

interface GetTrashedItemsParams {
  workspaceId: string;
}

interface GetTrashedItemsResponse {
  boards: Board[];
  lists: List[];
  tasks: Task[];
}

interface RestoreItemParams {
  workspaceId: string;
  type: "board" | "list" | "task";

  // shared
  itemId?: string;

  // task-specific
  boardId?: string;
  listId?: string;
  taskId?: string;
}

interface DeleteItemPermanentlyParams {
  workspaceId: string;
  type: "board" | "list" | "task";

  itemId?: string;
  boardId?: string;
  listId?: string;
  taskId?: string;
}

// Get all trashed items (boards and lists)
export const getTrashedItems = async ({
  workspaceId,
}: GetTrashedItemsParams): Promise<GetTrashedItemsResponse> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/trash`);
  return data.data;
};

// Restore an item from trash
export const restoreItem = async ({
  workspaceId,
  type,
  itemId,
  boardId,
  listId,
  taskId,
}: RestoreItemParams): Promise<Board | List> => {
  let endpoint = "";

  switch (type) {
    case "board":
      endpoint = `/workspaces/${workspaceId}/boards/${itemId}/restore`;
      break;

    case "list":
      endpoint = `/workspaces/${workspaceId}/boards/${boardId}/lists/${itemId}/restore`;
      break;

    case "task":
      endpoint = `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/task/${taskId}/restore`;
      break;

    default:
      throw new Error("Invalid restore type");
  }
  const { data } = await api.patch(endpoint);
  return data;
};

// Delete an item permanently
export const deleteItemPermanently = async ({
  workspaceId,
  type,
  itemId,
  boardId,
  listId,
  taskId,
}: DeleteItemPermanentlyParams): Promise<void> => {
  let endpoint = "";

  switch (type) {
    case "board":
      endpoint = `/workspaces/${workspaceId}/boards/${itemId}`;
      break;

    case "list":
      endpoint = `/workspaces/${workspaceId}/boards/${boardId}/lists/${itemId}`;
      break;

    case "task":
      endpoint = `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/task/${taskId}`;
      break;

    default:
      throw new Error("Invalid delete type");
  }

  await api.delete(endpoint);
};
