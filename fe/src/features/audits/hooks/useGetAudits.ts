import { useQuery } from "@tanstack/react-query";
import { getAudits } from "../api/audit.api";

export const useGetAudits = ({ workspaceId }: { workspaceId: string }) => {
  return useQuery({
    queryKey: ["audits", workspaceId],
    queryFn: () => getAudits({ workspaceId }),
    staleTime: 5 * 60 * 1000, // 5 minutes - members don't change frequently
  });
};
