// src/features/members/api/members.ts
import { api } from "@/lib/axios";
import type { Member, ROLE } from "@/lib/types";

interface GetWorkspaceMembersParams {
  workspaceId: string;
  page?: number;
  limit?: number;
}

interface GetWorkspaceMembersResponse {
  members: Member[];
  totalCount: number;
  page: number;
  limit: number;
}

interface RemoveMemberParams {
  workspaceId: string;
  memberId: string;
}

interface ChangeRoleParams {
  workspaceId: string;
  memberId: string;
  role: ROLE;
}

export const getWorkspaceMembers = async ({
  workspaceId,
  page = 1,
  limit = 10,
}: GetWorkspaceMembersParams): Promise<GetWorkspaceMembersResponse> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/members`, {
    params: { page, limit },
  });
  return data;
};

export const removeMember = async ({
  workspaceId,
  memberId,
}: RemoveMemberParams): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
};

export const changeRole = async ({
  workspaceId,
  memberId,
  role,
}: ChangeRoleParams): Promise<Member> => {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/members/${memberId}`,
    { role }
  );
  return data;
};
