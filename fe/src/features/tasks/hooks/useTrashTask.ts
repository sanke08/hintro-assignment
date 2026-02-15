import { useMutation } from "@tanstack/react-query";
import { trashTask } from "../api/task.api";
import { queryClient } from "@/lib/queryClient";

export const useTrashTask = () => {
  return useMutation({
    mutationFn: trashTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board-lists", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trashed-items", variables.workspaceId],
      });
    },
  });
};

