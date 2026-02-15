import { useQuery } from "@tanstack/react-query";
import { fetchBoard } from "../api/boards.api";

export const useBoard = ({
  workspaceId,
  boardId,
}: {
  workspaceId: string;
  boardId: string;
}) => {
  return useQuery({
    queryKey: ["board", workspaceId, boardId],
    enabled: !!workspaceId && !!boardId,
    queryFn: () => fetchBoard(workspaceId!, boardId!),
    retry: 0,
  });
};
