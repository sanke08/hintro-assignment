import { useMutation } from "@tanstack/react-query";
import { updateBoard } from "../api/boards.api";
import { queryClient } from "@/lib/queryClient";

export const useUpdateBoard = ({
  boardId,
  workspaceId,
}: {
  boardId: string;
  workspaceId: string;
}) => {
  return useMutation({
    mutationFn: (payload: { title: string }) =>
      updateBoard(boardId, workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["board", workspaceId, boardId],
      });
    },
  });
};
