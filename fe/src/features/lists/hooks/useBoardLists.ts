// features/boards/hooks/useBoardLists.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBoardLists } from "../api/list.api";

export const useBoardLists = ({
  boardId,
  workspaceId,
}: {
  boardId: string;
  workspaceId: string;
}) => {
  return useQuery({
    queryKey: ["board-lists", boardId],
    enabled: !!boardId,
    queryFn: () => fetchBoardLists({ boardId, workspaceId }),
    staleTime: 1000 * 60,
  });
};
