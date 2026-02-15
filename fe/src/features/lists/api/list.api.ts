import { api } from "@/lib/axios";
import type { CreateListInput, UpdateListInput } from "../schemas/lists.schema";

export const fetchBoardLists = async ({
  workspaceId,
  boardId,
}: {
  workspaceId: string;
  boardId: string;
}) => {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/boards/${boardId}/lists`
  );
  return data.data;
};

export const createList = async ({
  boardId,
  title,
  workspaceId,
}: CreateListInput) => {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/boards/${boardId}/lists`,
    { title }
  );
  return data;
};

export const updateList = async ({
  listId,
  title,
  boardId,
  workspaceId,
}: UpdateListInput) => {
  const { data } = await api.put(
    `workspaces/${workspaceId}/boards/${boardId}/lists/${listId}`,
    { title, boardId, workspaceId }
  );
  return data;
};

export const trashList = async ({
  listId,
  workspaceId,
  boardId,
}: {
  listId: string;
  workspaceId: string;
  boardId: string;
}) => {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/trash`,
    {}
  );
  return data;
};
