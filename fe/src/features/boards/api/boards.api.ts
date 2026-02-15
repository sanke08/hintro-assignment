import { api } from "@/lib/axios";
import type { Board, Member } from "@/lib/types";

export const fetchWorkspaceBoards = async (workspaceId: string) => {
  const { data } = await api.get(`/workspaces/${workspaceId}/boards`);
  return data.data;
};

export const createBoardApi = async ({
  title,
  workspaceId,
}: {
  title: string;
  workspaceId: string;
}) => {
  const { data } = await api.post(`/workspaces/${workspaceId}/boards`, {
    title,
  });
  return data;
};

export const fetchBoard = async (workspaceId: string, boardId: string) => {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/boards/${boardId}`
  );
  return data.data as { board: Board; member: Member };
};

export const updateBoard = async (
  boardId: string,
  workspaceId: string,
  payload: { title: string }
) => {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/boards/${boardId}`,
    payload
  );
  return data;
};

export const trashBoard = async ({
  boardId,
  workspaceId,
}: {
  boardId: string;
  workspaceId: string;
}) => {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/boards/${boardId}/trash`
  );
  return data;
};
