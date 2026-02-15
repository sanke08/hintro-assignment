import { useMutation } from "@tanstack/react-query";
import { trashBoard } from "../api/boards.api";
import { queryClient } from "@/lib/queryClient";

export const useTrashBoard = ({
  boardId,
  workspaceId,
}: {
  boardId: string;
  workspaceId: string;
}) => {
  return useMutation({
    mutationFn: () => trashBoard({ boardId, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["board", workspaceId, boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trashed-items", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-boards", workspaceId],
      });
    },
  });
};
