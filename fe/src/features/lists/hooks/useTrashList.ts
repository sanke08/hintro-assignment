import { useMutation } from "@tanstack/react-query";
import { trashList } from "../api/list.api";
import { queryClient } from "@/lib/queryClient";

export const useTrashList = () => {
  return useMutation({
    mutationFn: trashList,
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

