import { api } from "@/lib/axios";
import type { CreateWorkspaceInput } from "../schemas/workspace.schema";
import type { Workspace } from "@/lib/types";

export const createWorkspace = async (payload: CreateWorkspaceInput) => {
  const { data } = await api.post("/workspaces", payload);
  return data;
};

interface UpdateWorkspaceParams {
  workspaceId: string;
  name: string;
}

interface GenerateInviteLinkParams {
  workspaceId: string;
}

interface DeleteWorkspaceParams {
  workspaceId: string;
}

interface LeaveWorkspaceParams {
  workspaceId: string;
}

export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<Workspace> => {
  const { data } = await api.get(`/workspaces/${workspaceId}`);
  return data.data;
};

export const updateWorkspace = async ({
  workspaceId,
  name,
}: UpdateWorkspaceParams): Promise<Workspace> => {
  const { data } = await api.patch(`/workspaces/${workspaceId}`, { name });
  return data;
};

export const generateInviteLink = async ({
  workspaceId,
}: GenerateInviteLinkParams): Promise<Workspace> => {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/generate-invite`
  );
  return data;
};

export const deleteWorkspace = async ({
  workspaceId,
}: DeleteWorkspaceParams): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}`);
};

export const leaveWorkspace = async ({
  workspaceId,
}: LeaveWorkspaceParams): Promise<void> => {
  await api.post(`/workspaces/${workspaceId}/leave`);
};

export const getWorkspaceByInviteCode = async ({
  inviteCode,
}: {
  inviteCode: string;
}): Promise<Workspace> => {
  try {
    const { data } = await api.get(`/workspaces/invite/${inviteCode}`);
    return data.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const joinWorkspace = async ({ inviteCode }: { inviteCode: string }) => {
  try {
    const { data } = await api.post(`/workspaces/join`, { inviteCode });
    return data.data;
  } catch (error) {
    console.log({ error });
    return error;
  }
};
