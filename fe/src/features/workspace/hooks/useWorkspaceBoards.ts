import { fetchWorkspaceBoards } from "@/features/boards/api/boards.api";
import type { Board } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export type WorkspaceBoardsResponse = {
  id: string;
  name: string;
  boards: Board[];
};

export const useWorkspaceBoards = (workspaceId?: string) => {
  return useQuery<WorkspaceBoardsResponse>({
    queryKey: ["workspace-boards", workspaceId],
    enabled: !!workspaceId, // 🚨 IMPORTANT
    queryFn: () => fetchWorkspaceBoards(workspaceId!),
    staleTime: 1000 * 60 * 5,
  });
};
