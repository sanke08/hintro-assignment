import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMembers, type GetMembersParams } from "../api/task.api";

export const useGetMembers = ({ workspaceId }: GetMembersParams) => {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getWorkspaceMembers({ workspaceId }),
    staleTime: 5 * 60 * 1000, // 5 minutes - members don't change frequently
  });
};
