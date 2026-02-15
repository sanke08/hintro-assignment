import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "../api/workspace.api";

export const useGetWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspace({ workspaceId }),
  });
};
