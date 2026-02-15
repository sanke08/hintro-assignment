import { api } from "@/lib/axios";

export const getAudits = async ({ workspaceId }: { workspaceId: string }) => {
  const { data } = await api.get(`/workspaces/${workspaceId}/audits`);
  return data.data;
};
